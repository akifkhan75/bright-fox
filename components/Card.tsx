
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const clickableStyles = onClick ? 'cursor-pointer hover:shadow-xl transition-shadow duration-200' : '';
  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-4 md:p-6 ${clickableStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;