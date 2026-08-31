import React, { useState, useEffect } from 'react';
import { PhdlLogo } from './PhdlLogo';
import { ShieldCheck, Lock, Sparkles } from 'lucide-react';

interface PhdlAppLoaderProps {
  onComplete?: () => void;
}

export const PhdlAppLoader: React.FC<PhdlAppLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(15);
  const [statusMessage, setStatusMessage] = useState('Authenticating Armed Forces Command Credentials...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setProgress(40);
      setStatusMessage('Loading 404 Housing Units & Estate Hierarchy...');
    }, 300);

    const t2 = setTimeout(() => {
      setProgress(75);
      setStatusMessage('Verifying Tenancy Registers & Smart Gate Passes...');
    }, 650);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStatusMessage('Clearance Granted: Launching Security Portal...');
    }, 950);

    const t4 = setTimeout(() => {
      setIsFadingOut(true);
    }, 1250);

    const t5 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#041409',
        background: 'radial-gradient(circle at center, #0B331A 0%, #041409 70%, #020A05 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        transition: 'opacity 0.35s ease-out',
        opacity: isFadingOut ? 0 : 1,
        pointerEvents: isFadingOut ? 'none' : 'auto',
      }}
    >
      <style>{`
        @keyframes orbitRolling {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes orbitRollingReverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes logoGentleBounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.03); }
        }
        @keyframes radarPulse {
          0% { transform: scale(0.85); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 0.3; }
          100% { transform: scale(0.85); opacity: 0.8; }
        }
        @keyframes shimmerBar {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
      `}</style>

      {/* Main Animated Logo Assembly */}
      <div style={{ position: 'relative', width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Outer Rolling Circles / Orbit */}
        <div
          style={{
            position: 'absolute',
            width: 154,
            height: 154,
            borderRadius: '50%',
            border: '2px dashed rgba(245, 158, 11, 0.4)',
            animation: 'orbitRolling 6s linear infinite',
          }}
        />

        {/* Middle Rolling Orbit with Accent Nodes */}
        <div
          style={{
            position: 'absolute',
            width: 130,
            height: 130,
            borderRadius: '50%',
            border: '2px solid rgba(13, 69, 43, 0.7)',
            borderTopColor: '#F59E0B',
            borderRightColor: '#DC2626',
            animation: 'orbitRollingReverse 3.5s linear infinite',
          }}
        />

        {/* Pulsing Radar Aura */}
        <div
          style={{
            position: 'absolute',
            width: 110,
            height: 110,
            borderRadius: '50%',
            backgroundColor: 'rgba(13, 69, 43, 0.25)',
            boxShadow: '0 0 35px rgba(245, 158, 11, 0.3)',
            animation: 'radarPulse 2.5s ease-in-out infinite',
          }}
        />

        {/* Bouncing Logo */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            animation: 'logoGentleBounce 2s ease-in-out infinite',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.45))',
          }}
        >
          <PhdlLogo size={76} />
        </div>
      </div>

      {/* Title & Brand Typography */}
      <div style={{ marginTop: '1.75rem', textAlign: 'center', color: '#FFFFFF', padding: '0 1rem' }}>
        <div
          style={{
            fontSize: '0.725rem',
            letterSpacing: '0.12em',
            fontWeight: 800,
            color: '#F59E0B',
            textTransform: 'uppercase',
            marginBottom: '0.35rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
          }}
        >
          <Lock size={12} color="#F59E0B" /> PHDL Estates
        </div>

        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 900,
            letterSpacing: '0.04em',
            color: '#FFFFFF',
            margin: 0,
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          PHDL ESTATE COMMAND & RESIDENCY PORTAL
        </h2>

        <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.65)', marginTop: '0.25rem' }}>
          Federal Republic of Nigeria • RC 676563 • 24/7 Security Clearance
        </div>
      </div>

      {/* Progress Bar Container */}
      <div style={{ width: 280, marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        <div
          style={{
            width: '100%',
            height: 6,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 6,
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #15803D, #F59E0B, #DC2626)',
              borderRadius: 6,
              transition: 'width 0.3s ease-out',
            }}
          />
        </div>

        {/* Dynamic Status Text */}
        <div
          style={{
            fontSize: '0.725rem',
            color: '#A7F3D0',
            fontFamily: 'var(--font-mono, monospace)',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <ShieldCheck size={13} color="#10B981" />
          <span>{statusMessage}</span>
        </div>
      </div>
    </div>
  );
};
