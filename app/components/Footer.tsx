import React from 'react';

export default function Footer() {
  return (
    <footer className="sticky bottom-0 z-10 w-full bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 items-center justify-center px-6">
        <div className="flex items-center gap-3">
          <p className="text-sm text-zinc-400">
            © 2026 IntentSense. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
