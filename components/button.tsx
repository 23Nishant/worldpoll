import React from 'react';

interface ButtonProps {
  variant?: 'outline' | 'solid';
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ variant = 'solid', children, className }) => {
  const baseStyles = 'px-4 py-2 rounded focus:outline-none focus:ring-2';
  const variantStyles = variant === 'outline'
    ? 'border border-gray-300 text-gray-700'
    : 'bg-blue-500 text-white';

  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`}>
      {children}
    </button>
  );
};

export default Button;
