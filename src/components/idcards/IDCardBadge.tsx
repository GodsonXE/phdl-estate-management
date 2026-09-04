import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode } from '../../types';
import { Shield, CheckCircle2, AlertTriangle, Printer } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface IDCardBadgeProps {
  card: QrCode;
  showPrintButton?: boolean;
}

export const IDCardBadge: React.FC<IDCardBadgeProps> = ({ card, showPrintButton = true }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(card.qrData || card.cardNumber, {
      width: 140,
      margin: 1,
      color: {
        dark: '#072B1C',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR code', err));
  }, [card]);

  const isExpired = new Date(card.expiryDate || '2026-12-31') < new Date('2026-08-14');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
      {/* Front of ID Card */}
      <div
        className="printable-area"
        style={{
          width: 360,
          minHeight: 230,
          borderRadius: 14,
          background: 'linear-gradient(135deg, #072B1C 0%, #0D452B 65%, #125E3A 100%)',
          color: '#FFFFFF',
          padding: '1rem',
          boxShadow: '0 12px 28px -6px rgba(7, 43, 28, 0.45), 0 0 0 1px rgba(245, 158, 11, 0.3)',
          border: '2px solid var(--army-gold-500)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Top Scarlet Red & Gold Strip */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #DC2626 0%, #DC2626 50%, #F59E0B 50%, #F59E0B 100%)',
          }}
        />

        {/* Subtle Watermark background */}
        <div
          style={{
            position: 'absolute',
            right: -25,
            bottom: -25,
            opacity: 0.12,
            pointerEvents: 'none',
            width: 170,
            height: 170,
          }}
        >
          <img src="/phdl-logo.png" alt="watermark" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>

        {/* Card Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(245, 158, 11, 0.4)', paddingBottom: '0.45rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#FFFFFF', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
              <img src="/phdl-logo.png" alt="PHDL Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.625rem', fontWeight: 800, letterSpacing: '0.04em', color: '#FFFFFF', lineHeight: 1.15 }}>POST-SERVICE HOUSING DEV LTD</div>
              <div style={{ fontSize: '0.55rem', color: 'var(--army-gold-300)', letterSpacing: '0.04em', fontWeight: 700 }}>RC 676563 • NIGERIAN ARMY</div>
            </div>
          </div>
          <span
            style={{
              fontSize: '0.6rem',
              fontWeight: 800,
              padding: '0.2rem 0.5rem',
              borderRadius: 4,
              backgroundColor: card.holderType === 'soldier' ? 'var(--army-red-600)' : card.holderType === 'tenant' ? '#0284C7' : 'var(--army-gold-500)',
              color: '#FFFFFF',
              letterSpacing: '0.04em',
            }}
          >
            {card.holderType.toUpperCase()}
          </span>
        </div>

        {/* Card Body */}
        <div style={{ display: 'flex', gap: '0.85rem', marginTop: '0.6rem', zIndex: 2 }}>
          {/* Photo */}
          <div style={{ width: 75, height: 85, borderRadius: 8, overflow: 'hidden', border: '2px solid var(--army-gold-400)', flexShrink: 0, backgroundColor: '#072B1C' }}>
            {card.photoUrl ? (
              <img src={card.photoUrl} alt={card.holderName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--army-gold-300)', fontSize: '0.75rem', fontWeight: 800 }}>
                PHDL ID
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {card.holderName}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--army-gold-300)', fontWeight: 700 }}>
              {card.holderRoleOrRank}
            </div>
            <div style={{ fontSize: '0.675rem', color: '#E2E8F0', marginTop: '0.15rem' }}>
              Unit: <strong style={{ color: '#FFFFFF' }}>Flat {card.flatCode}</strong> • {card.laneName}
            </div>
            <div style={{ fontSize: '0.6rem', color: 'var(--army-gold-300)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem', fontWeight: 700 }}>
              ID: {card.cardNumber}
            </div>
          </div>

          {/* QR Code */}
          <div style={{ width: 72, height: 72, backgroundColor: '#FFFFFF', borderRadius: 6, padding: 3, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--army-gold-400)' }}>
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="QR Access Pass" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <div style={{ fontSize: '0.6rem', color: '#000' }}>QR Code</div>
            )}
          </div>
        </div>

        {/* Card Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '0.4rem', marginTop: '0.5rem', fontSize: '0.6rem', zIndex: 2 }}>
          <div>
            <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Valid Through: </span>
            <strong style={{ color: isExpired ? '#F87171' : 'var(--army-gold-300)' }}>{formatDate(card.expiryDate || '2026-12-31')}</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: isExpired ? '#DC2626' : '#22C55E' }} />
            <span style={{ fontWeight: 800, color: isExpired ? '#F87171' : '#86EFAC', letterSpacing: '0.04em' }}>
              {isExpired ? 'EXPIRED' : 'VERIFIED PASS'}
            </span>
          </div>
        </div>
      </div>

      {showPrintButton && (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handlePrint} className="btn btn-primary btn-sm" style={{ gap: '0.35rem' }}>
            <Printer size={14} />
            Print Official Smart ID
          </button>
        </div>
      )}
    </div>
  );
};
