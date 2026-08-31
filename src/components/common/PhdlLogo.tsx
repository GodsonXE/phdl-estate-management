import React from 'react';

interface PhdlLogoProps {
    size?: number;
    className?: string;
    style?: React.CSSProperties;
}

export const PhdlLogo: React.FC<PhdlLogoProps> = ({ size = 40, className = '', style = {} }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={className}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                minWidth: `${size}px`,
                minHeight: `${size}px`,
                maxWidth: `${size}px`,
                maxHeight: `${size}px`,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'inline-block',
                verticalAlign: 'middle',
                ...style,
            }}
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="50" cy="50" r="48" fill="#1B4D21" stroke="#F59E0B" strokeWidth="4" />
            <circle cx="50" cy="50" r="38" fill="#991B1B" stroke="#FBBF24" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="30" fill="#0E3314" />
            <polygon points="50,22 53,30 62,30 55,35 57,43 50,38 43,43 45,35 38,30 47,30" fill="#FBBF24" />
            <text x="50" y="58" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="sans-serif">
                PHDL
            </text>
            <text x="50" y="70" textAnchor="middle" fill="#FBBF24" fontSize="7.5" fontWeight="800" fontFamily="sans-serif">
                RC 676563
            </text>
        </svg>
    );
};