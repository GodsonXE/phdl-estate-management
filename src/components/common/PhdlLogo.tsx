import React, { useState } from 'react';

export interface PhdlLogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const PhdlLogo: React.FC<PhdlLogoProps> = ({ size = 40, className, style }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    // Fallback if image path is unavailable
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: '#071A0B',
          border: '2px solid #F59E0B',
          color: '#F59E0B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          fontSize: size * 0.35,
          ...style,
        }}
      >
        PHDL
      </div>
    );
  }

  return (
    <img
      src="/phdl-logo.png"
      alt="Post-Service Housing Development Limited (PHDL) Official Crest Logo"
      width={size}
      height={size}
      className={className}
      onError={() => setHasError(true)}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))',
        ...style,
      }}
    />
  );
};

export default PhdlLogo;
