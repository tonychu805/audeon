import React from 'react';

interface EarLogoProps {
  className?: string;
}

export const EarLogo: React.FC<EarLogoProps> = ({ className = "w-6 h-6" }) => {
  return (
    <img 
      src="/images/Amplify_Logo-removebg-preview.png" 
      alt="Audeon Logo" 
      className="w-9 h-9"
    />
  );
};