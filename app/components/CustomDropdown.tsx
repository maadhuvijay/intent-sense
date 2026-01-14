'use client';

import React, { useState, useRef, useEffect } from 'react';

interface CustomDropdownProps<T extends string> {
  value: T | '';
  options: T[];
  onChange: (value: T) => void;
  className?: string;
  placeholder?: string;
  onOpen?: () => void;
}

export default function CustomDropdown<T extends string>({
  value,
  options,
  onChange,
  className = '',
  placeholder = 'Select an option...',
  onOpen,
}: CustomDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option: T) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Selector Button */}
      <button
        type="button"
        onClick={() => {
          if (!isOpen && onOpen) {
            onOpen();
          }
          setIsOpen(!isOpen);
        }}
        className="w-full rounded-xl border border-[#00FFDE]/20 bg-gradient-to-br from-[#00FFDE]/10 via-[#00FFDE]/5 to-[#00FFDE]/5 px-4 py-5 text-lg text-white backdrop-blur-xl shadow-[0_4px_16px_0_rgba(0,255,222,0.15)] transition-all hover:border-[#00FFDE]/30 hover:from-[#00FFDE]/15 hover:via-[#00FFDE]/8 hover:to-[#00FFDE]/8 focus:border-[#00FFDE]/30 focus:outline-none focus:ring-2 focus:ring-[#00FFDE]/20 min-h-[56px] flex items-center justify-between"
      >
        <span className={value ? '' : 'text-white/50'}>{value || placeholder}</span>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 rounded-xl border border-[#00FFDE]/20 bg-gradient-to-br from-[#00FFDE]/10 via-[#00FFDE]/5 to-[#00FFDE]/5 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,255,222,0.25)] overflow-hidden">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className={`w-full px-4 py-4 text-left text-lg text-white transition-all ${
                option === value
                  ? 'bg-[#00FFDE]/20 font-medium'
                  : 'hover:bg-[#00FFDE]/15'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
