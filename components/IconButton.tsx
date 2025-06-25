
import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  className?: string;
  ariaLabel: string;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, className = '', ariaLabel, ...props }) => {
  return (
    <button
      aria-label={ariaLabel}
      className={`p-2 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-sky-500 ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
};

export default IconButton;
