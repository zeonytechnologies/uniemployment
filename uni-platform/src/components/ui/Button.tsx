import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}: ButtonProps) {
  
  let variantClass = '';
  if (variant === 'primary') variantClass = 'btn-primary';
  if (variant === 'secondary') variantClass = 'btn-secondary';
  if (variant === 'outline') variantClass = 'btn-outline';
  if (variant === 'ghost') variantClass = 'btn-ghost';
  
  let sizeClass = '';
  if (size === 'sm') sizeClass = 'btn-sm';
  if (size === 'md') sizeClass = 'btn-md';
  if (size === 'lg') sizeClass = 'btn-lg';

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`btn ${variantClass} ${sizeClass} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
