import React from 'react';

export interface PhdlLogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const PhdlLogo: React.FC<PhdlLogoProps> = ({ size = 40, className, style }) => {
  return (
    <img
      src="/phdl-logo.png"
      alt="PHDL Official Logo"
      width={size}
      height={size}
      className={className}
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