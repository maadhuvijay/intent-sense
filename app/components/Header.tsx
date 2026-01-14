import React from 'react';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 w-full bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 items-center justify-center px-6">
        <div className="flex items-center gap-3">
          <Image
            src="/logo2.png"
            alt="IntentSense Logo"
            width={32}
            height={32}
            className="h-8 w-8"
            priority
          />
          <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-[#5409DA] to-[#9D7AFF] bg-clip-text text-transparent">
            Intentsense - AI powered Text Labeling Application
          </h1>
        </div>
      </div>
    </header>
  );
}
