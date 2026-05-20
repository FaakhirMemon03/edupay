import React from 'react';

export const Button = ({ children, onClick, type = 'button', disabled = false, variant = 'primary' }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors duration-200';
  const variants = {
    primary: 'bg-[#2563EB] text-white hover:bg-[#1e4bb8] disabled:bg-gray-400',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-300',
  };
  const className = `${baseClasses} ${variants[variant]}`;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  );
};
