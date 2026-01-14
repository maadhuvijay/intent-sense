import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

function buildSystemPrompt(
  labelingTask: string,
  labelingMode: string,
  userText: string
): string {
  const taskLower = labelingTask.toLowerCase();
  const modeLower = labelingMode.toLowerCase();

  // Define allowed labels for each task
  let allowedLabels: string[] = [];
  let labelType = '';
  let labelInstructions = '';

  if (taskLower === 'sentiment analysis') {
    allowedLabels = ['positive', 'neutral', 'negative', 'mixed'];
    labelType = 'single label only';
    labelInstructions = 'Assign EXACTLY ONE label.';
  } else if (taskLower === 'intent classification') {
    allowedLabels = ['question', 'request', 'complaint', 'instruction', 'feedback', 'informational', 'other'];
    labelType = 'multi-label allowed';
    labelInstructions = 'Assign ONE OR MORE labels only if clearly supported.';
  } else if (taskLower === 'user signal classification') {
    allowedLabels = ['implicit_expectation', 'frustration_signal', 'blocked_progress', 'workaround_seeking'];
    labelType = 'multi-label allowed';
    labelInstructions = 'Assign ONE OR MORE labels only if clearly supported.';
  }

  let prompt = `You are an AI text labeling engine used in a professional data labeling application.
You must strictly follow the task, labeling mode, allowed labels, and rules provided.
You must output ONLY valid JSON. Do not include explanations, markdown, or extra text.
Task: ${taskLower}
Labeling Mode: ${modeLower}

IMPORTANT: For this task, you MUST use ONLY the following allowed labels. Do NOT use labels from other tasks (Sentiment, Intent, or any other classification system).

Allowed Labels (${labelType}):
${allowedLabels.map(label => `- ${label}`).join('\n')}

Text to Label:
${userText}
## If ${modeLower} = zero-shot, IGNORE all examples and rely only on the rules.`;

  // Add few-shot examples based on task and mode
  if (modeLower === 'few-shot') {
    if (taskLower === 'intent classification') {
      prompt += `
## If task ="Intent Classification" and labeling_mode = "few-shot"
Example 1:
Text: "Can you help me reset my password?"
Output:
{
  "label": ["question"],
  "confidence": 0.86,
  "ambiguity_detected": false,
  "review_recommended": false
}
Example 2:
Text: "The app crashes whenever I try to submit the form."
Output:
{
  "label": ["complaint"],
  "confidence": 0.91,
  "ambiguity_detected": false,
  "review_recommended": false
}`;
    } else if (taskLower === 'sentiment analysis') {
      prompt += `
## If task ="Sentiment analysis" and labeling_mode = "Few-shot"
Example 1:
Text: "This update is fantastic, everything feels faster."
Output:
{
  "label": ["positive"],
  "confidence": 0.92,
  "ambiguity_detected": false,
  "review_recommended": false
}
Example 2:
Text: "It works fine, but nothing really stands out."
Output:
{
  "label": ["neutral"],
  "confidence": 0.78,
  "ambiguity_detected": false,
  "review_recommended": false
}`;
    } else if (taskLower === 'user signal classification') {
      prompt += `
## If task = "User Signal Classification" and labeling_mode = "Few-shot"
Example 1:
Text: "I thought this feature would work better than it does."
Output:
{
  "label": ["implicit_expectation"],
  "confidence": 0.83,
  "ambiguity_detected": false,
  "review_recommended": false
}
Example 2:
Text: "This is getting really annoying. Is there any workaround?"
Output:
{
  "label": ["frustration_signal", "workaround_seeking"],
  "confidence": 0.79,
  "ambiguity_detected": false,
  "review_recommended": false
}
Example 3:
Text: "I can't get past the verification screen."
Output:
{
  "label": ["blocked_progress"],
  "confidence": 0.88,
  "ambiguity_detected": false,
  "review_recommended": false
}`;
    }
  }

  prompt += `
## Labeling rules
Rules:
- Use ONLY labels from the allowed label list above. ${labelInstructions}
- Do NOT use labels from other tasks (e.g., do NOT use "negative", "complaint", "positive", etc. for User Signal Classification).
- Do NOT invent or modify labels.
- Confidence must be a number between 0.0 and 1.0.
- Set ambiguity_detected = true when:
    • Multiple labels are equally plausible, OR
    • The classification cannot be confidently inferred, OR
    • The text contains mixed or conflicting signals.
- Set review_recommended = true if:
    • confidence < 0.70, OR
    • ambiguity_detected = true
## Output format (json)
{
  "task": "${taskLower}",
  "label": ["<allowed label(s)>"],
  "confidence": <number between 0 and 1>,
  "ambiguity_detected": true | false,
  "review_recommended": true | false
}`;

  return prompt;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task, mode, text } = body;

    if (!task || !mode || !text) {
      return NextResponse.json(
        { error: 'Missing required fields: task, mode, or text' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Initialize OpenAI client lazily (only when needed, not during build)
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = buildSystemPrompt(task, mode, text);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: 'Please label the text and return ONLY valid JSON.',
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      return NextResponse.json(
        { error: 'No response from OpenAI' },
        { status: 500 }
      );
    }

    // Parse JSON response
    const result = JSON.parse(responseText);

    // Validate and filter labels based on task
    const taskLower = task.toLowerCase();
    let allowedLabels: string[] = [];
    
    if (taskLower === 'sentiment analysis') {
      allowedLabels = ['positive', 'neutral', 'negative', 'mixed'];
    } else if (taskLower === 'intent classification') {
      allowedLabels = ['question', 'request', 'complaint', 'instruction', 'feedback', 'informational', 'other'];
    } else if (taskLower === 'user signal classification') {
      allowedLabels = ['implicit_expectation', 'frustration_signal', 'blocked_progress', 'workaround_seeking'];
    }

    // Filter labels to only include allowed ones
    if (result.label) {
      const labels = Array.isArray(result.label) ? result.label : [result.label];
      const validLabels = labels.filter((label: string) => allowedLabels.includes(label));
      
      // Check if any invalid labels were filtered out
      const hadInvalidLabels = labels.length > validLabels.length;
      
      if (hadInvalidLabels) {
        // Mark for review if invalid labels were found
        result.review_recommended = true;
        result.ambiguity_detected = true;
      }
      
      // For single-label tasks (sentiment), take first valid label or default
      if (taskLower === 'sentiment analysis') {
        result.label = validLabels.length > 0 ? validLabels[0] : 'neutral';
      } else {
        // For multi-label tasks, return only valid labels (empty array if all were invalid)
        result.label = validLabels;
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process labeling request' },
      { status: 500 }
    );
  }
}
