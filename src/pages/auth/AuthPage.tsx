import React, { useState } from 'react';
import { PhdlLogo } from '../../components/common/PhdlLogo';
import { Role } from '../../types';
import {
  Shield,
  Building,
  Users,
  Lock,
  Mail,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  initialRole?: Role;
  onLoginSuccess: (role: Role) => void;
  onBackToLanding: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  initialRole = 'phdl_admin',
  onLoginSuccess,
  onBackToLanding,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [militaryIdOrPhone, setMilitaryIdOrPhone] = useState('');
  const [selectedFlat, setSelectedFlat] = useState('Flat L1H1A (Lane 1)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(selectedRole);
  };

  const handleQuickDemoAccess = (role: Role) => {
    setSelectedRole(role);
    onLoginSuccess(role);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#041409',
        backgroundImage: 'linear-gradient(180deg, rgba(4, 20, 9, 0.88) 0%, rgba(7, 26, 11, 0.94) 100%), url("/estate-hero-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
        color: '#FFFFFF',
      }}
    >
      {/* Top Back Button */}
      <div style={{ width: '100%', maxWidth: 480, marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onBackToLanding}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <ArrowLeft size={16} /> Return to Home Landing Page
        </button>
        <span style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 800 }}>
          RC 676563
        </span>
      </div>

      {/* Main Authentication Card */}
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          backgroundColor: 'rgba(7, 26, 11, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(245, 158, 11, 0.35)',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
        }}
      >
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <PhdlLogo size={52} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
            {mode === 'login' ? 'Command Portal Sign-In' : 'Resident & Landlord Registration'}
          </h2>
          <div style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 700, marginTop: '0.25rem' }}>
            POST-SERVICE HOUSING DEVELOPMENT LIMITED
          </div>
        </div>

        {/* Tab Switcher: Sign In vs Register */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            padding: '4px',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <button
            type="button"
            onClick={() => setMode('login')}
            style={{
              padding: '0.6rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: mode === 'login' ? '#15803D' : 'transparent',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: '0.2s',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            style={{
              padding: '0.6rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: mode === 'register' ? '#991B1B' : 'transparent',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: '0.2s',
            }}
          >
            Create Account
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.75)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            Select User Clearance Tier:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={() => setSelectedRole('phdl_admin')}
              style={{
                padding: '0.5rem 0.2rem',
                borderRadius: '6px',
                border: `1.5px solid ${selectedRole === 'phdl_admin' ? '#EF4444' : 'rgba(255,255,255,0.15)'}`,
                backgroundColor: selectedRole === 'phdl_admin' ? 'rgba(153, 27, 27, 0.4)' : 'rgba(0,0,0,0.3)',
                color: '#FFFFFF',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              🛡️ SuperAdmin
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('soldier')}
              style={{
                padding: '0.5rem 0.2rem',
                borderRadius: '6px',
                border: `1.5px solid ${selectedRole === 'soldier' ? '#22C55E' : 'rgba(255,255,255,0.15)'}`,
                backgroundColor: selectedRole === 'soldier' ? 'rgba(21, 128, 61, 0.4)' : 'rgba(0,0,0,0.3)',
                color: '#FFFFFF',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              🪖 Soldier Owner
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('tenant')}
              style={{
                padding: '0.5rem 0.2rem',
                borderRadius: '6px',
                border: `1.5px solid ${selectedRole === 'tenant' ? '#F59E0B' : 'rgba(255,255,255,0.15)'}`,
                backgroundColor: selectedRole === 'tenant' ? 'rgba(217, 119, 6, 0.4)' : 'rgba(0,0,0,0.3)',
                color: '#FFFFFF',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              🏠 Resident Tenant
            </button>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '0.25rem' }}>
                Full Name (with Military Rank if applicable)
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Major S. Bello / Emeka Okon"
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '0.25rem' }}>
              Official Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                selectedRole === 'phdl_admin'
                  ? 'commandant.hq@phdl.gov.ng'
                  : selectedRole === 'soldier'
                    ? 's.adamu@phdl.gov.ng'
                    : 'resident@gmail.com'
              }
              style={{
                width: '100%',
                padding: '0.65rem 0.75rem',
                borderRadius: '6px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '0.25rem' }}>
              Access Password / Gate PIN
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.65rem 0.75rem',
                borderRadius: '6px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '0.25rem' }}>
                Assigned Housing Unit (Flat)
              </label>
              <select
                value={selectedFlat}
                onChange={(e) => setSelectedFlat(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '6px',
                  backgroundColor: '#071A0B',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  boxSizing: 'border-box',
                }}
              >
                <option value="Flat L1H1A (Lane 1)">Flat L1H1A (Lane 1 - North Wing)</option>
                <option value="Flat L2H3B (Lane 2)">Flat L2H3B (Lane 2)</option>
                <option value="Flat L3H2A (Lane 3)">Flat L3H2A (Lane 3)</option>
                <option value="Flat L4H1C (Lane 4)">Flat L4H1C (Lane 4)</option>
                <option value="Flat L5H4D (Lane 5)">Flat L5H4D (Lane 5 - South Wing)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            style={{
              marginTop: '0.5rem',
              padding: '0.85rem',
              borderRadius: '6px',
              backgroundColor: mode === 'login' ? '#15803D' : '#991B1B',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.95rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}
          >
            {mode === 'login' ? (
              <>
                <Lock size={16} /> Sign In & Launch Dashboard <ArrowRight size={16} />
              </>
            ) : (
              <>
                <Sparkles size={16} /> Complete Registration & Onboard <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Instant 1-Click Persona Access Section */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Instant 1-Click Persona Access
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <button
              onClick={() => handleQuickDemoAccess('phdl_admin')}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '4px',
                backgroundColor: 'rgba(153, 27, 27, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#FCA5A5',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>🛡️ Sign in as <strong>Col. Farouk Danjuma (HQ SuperAdmin)</strong></span>
              <span style={{ fontSize: '0.68rem', color: '#F87171' }}>Access →</span>
            </button>

            <button
              onClick={() => handleQuickDemoAccess('soldier')}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '4px',
                backgroundColor: 'rgba(21, 128, 61, 0.2)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                color: '#86EFAC',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>🪖 Sign in as <strong>Staff Sgt. Adamu (Soldier Landlord)</strong></span>
              <span style={{ fontSize: '0.68rem', color: '#4ADE80' }}>Access →</span>
            </button>

            <button
              onClick={() => handleQuickDemoAccess('tenant')}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '4px',
                backgroundColor: 'rgba(217, 119, 6, 0.2)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#FDE68A',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>🏠 Sign in as <strong>Emeka Okon (Resident Tenant)</strong></span>
              <span style={{ fontSize: '0.68rem', color: '#FBBF24' }}>Access →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
