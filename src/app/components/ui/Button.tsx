'use client';

import React from 'react';
import clsx from 'clsx'; // Utility for conditionally combining class names

type ButtonProps = {
  children: React.ReactNode; // Button label or inner content
  type?: 'button' | 'submit' | 'reset'; // HTML button types
  onClick?: () => void; // Optional click handler
  className?: string; // Optional extra classes for custom styling
  disabled?: boolean; // Disable state for the button
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
};

// Reusable button styled with brand colors and hover effects
export default function Button({
  children,
  type = 'button',
  onClick,
  className,
  disabled = false,
  variant = 'primary',
  size = 'md',
}: ButtonProps) {

  const variantStyles = {
    primary: 'bg-[#00347B] text-white hover:bg-[#FED602] hover:text-[#00347B]',
    secondary: 'bg-gray-200 text-[#00347B] hover:bg-gray-300',
    outline: 'border border-[#00347B] text-[#00347B] bg-transparent hover:bg-[#00347B] hover:text-white',
  };

  // Map sizes to classes
  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'rounded bg-[#00347B] px-4 py-2 text-white transition-colors duration-200',
        'hover:bg-[#FED602] hover:text-[#00347B]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </button>
  );
}
