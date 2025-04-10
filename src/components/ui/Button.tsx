'use client';

import React from 'react';
import clsx from 'clsx'; // Utility for conditionally combining class names

type ButtonProps = {
  children: React.ReactNode; // Button label or inner content
  type?: 'button' | 'submit' | 'reset'; // HTML button types
  onClick?: () => void; // Optional click handler
  className?: string; // Optional extra classes for custom styling
  disabled?: boolean; // Disable state for the button
};

// Reusable button styled with brand colors and hover effects
export default function Button({
  children,
  type = 'button',
  onClick,
  className,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'w-full rounded bg-[#00347B] px-4 py-2 text-white transition-colors duration-200',
        'hover:bg-[#FED602] hover:text-[#00347B]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
}
