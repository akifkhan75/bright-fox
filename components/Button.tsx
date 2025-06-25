
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-all duration-150 ease-in-out transform active:scale-95';
  
  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles = 'bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-500';
      break;
    case 'secondary':
      variantStyles = 'bg-pink-500 text-white hover:bg-pink-600 focus:ring-pink-500';
      break;
    case 'danger':
      variantStyles = 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500';
      break;
    case 'ghost':
      variantStyles = 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400 border border-gray-300';
      break;
  }

  let sizeStyles = '';
  switch (size) {
    case 'sm':
      sizeStyles = 'px-3 py-1.5 text-sm';
      break;
    case 'md':
      sizeStyles = 'px-4 py-2 text-base';
      break;
    case 'lg':
      sizeStyles = 'px-6 py-3 text-lg';
      break;
  }

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${widthStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
