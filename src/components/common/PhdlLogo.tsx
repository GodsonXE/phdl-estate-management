import React from 'react';

export const PhdlLogo: React.FC<{ size?: number; className?: string }> = ({ size = 40, className = '' }) => {
  return (
    <img
      src="/phdl-logo.png"
      alt="PHDL Official Crest"
      width={size}
      height={size}
      className={className}
      style={{
        objectFit: 'contain',
        display: 'inline-block',
        flexShrink: 0,
      }}
      onError={(e) => {
        // Fallback badge if image is missing
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
      }}
    />
  );
};

export default PhdlLogo;