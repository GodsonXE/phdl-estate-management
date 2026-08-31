import React, { useState } from 'react';
import { PhdlLogo } from '../../components/common/PhdlLogo';
import { Role } from '../../types';
import {
  Shield,
  Building,
  Users,
  CreditCard,
  Lock,
  ArrowRight,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  IdCard,
  Sparkles,
  KeyRound,
  FileCheck,
  ChevronRight,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface LandingPageProps {
  onSelectRole: (role: Role) => void;
  onStartOnboarding: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole, onStartOnboarding }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedAuthRole, setSelectedAuthRole] = useState<Role>('phdl_admin');

  const handleQuickLogin = (role: Role) => {
    onSelectRole(role);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#030E06', color: '#FFFFFF', fontFamily: 'var(--font-sans, system-ui, sans-serif)', overflowX: 'hidden' }}>
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div
        style={{
          backgroundColor: '#8B0000',
          background: 'linear-gradient(90deg, #7F1D1D 0%, #991B1B 50%, #7F1D1D 100%)',
          color: '#FFFFFF',
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '0.45rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ backgroundColor: '#F59E0B', color: '#0B2410', padding: '1px 6px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 800 }}>
            OFFICIAL
          </span>
          <span>FEDERAL REPUBLIC OF NIGERIA • ARMED FORCES HOUSING SCHEME • RC 676563</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.72rem' }}>
          <span>Emergency Security Hotline: <strong>+234 803 999 0001</strong></span>
          <span style={{ color: '#FCD34D' }}>24/7 Gate Verification Active</span>
        </div>
      </div>

      {/* 2. STICKY NAVIGATION BAR */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(7, 26, 11, 0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
          padding: '0.75rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <PhdlLogo size={42} />
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#FFFFFF', letterSpacing: '0.04em' }}>
              POST-SERVICE HOUSING DEVELOPMENT LIMITED
            </div>
            <div style={{ fontSize: '0.7rem', color: '#F59E0B', fontWeight: 700 }}>
              PHDL UNITY ESTATE COMMAND & RESIDENCY PORTAL
            </div>
          </div>
        </div>

        {/* Navigation Links & Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <a href="#about" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
            Estate Architecture
          </a>
          <a href="#portals" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
            Access Portals
          </a>
          <a href="#security" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
            Security & Gate
          </a>

          <button
            onClick={() => {
              setAuthMode('login');
              setShowAuthModal(true);
            }}
            style={{
              padding: '0.5rem 1.15rem',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              border: '1.5px solid #F59E0B',
              color: '#FCD34D',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: '0.2s',
            }}
          >
            <Lock size={14} /> Portal Sign-In
          </button>

          <button
            onClick={onStartOnboarding}
            style={{
              padding: '0.5rem 1.15rem',
              borderRadius: '6px',
              backgroundColor: '#991B1B',
              border: 'none',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 12px rgba(153, 27, 27, 0.4)',
              transition: '0.2s',
            }}
          >
            <Sparkles size={14} /> Resident Onboarding
          </button>
        </div>
      </nav>

      {/* 3. HERO SECTION WITH FADED REAL-ESTATE PHOTOGRAPHY */}
      <section
        style={{
          position: 'relative',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 2rem',
          backgroundImage: 'linear-gradient(180deg, rgba(4, 20, 9, 0.82) 0%, rgba(7, 26, 11, 0.90) 60%, rgba(3, 14, 6, 0.98) 100%), url("/estate-hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Subtle Military Red & Gold Glow Accents */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(153, 27, 27, 0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          {/* Eyebrow Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '999px',
              padding: '0.35rem 1rem',
              color: '#FCD34D',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}
          >
            <Shield size={14} color="#F59E0B" />
            Official Housing Command Platform • 404 Residential Units
          </div>

          {/* Main Hero Title */}
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
              margin: '0 auto 1.25rem',
              textShadow: '0 4px 16px rgba(0, 0, 0, 0.7)',
            }}
          >
            Modern Armed Forces Housing & Residential Administration
          </h1>

          {/* Subheading */}
          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
              color: 'rgba(255, 255, 255, 0.85)',
              lineHeight: 1.6,
              maxWidth: 820,
              margin: '0 auto 2.5rem',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
            }}
          >
            Centralized digital ecosystem for <strong>PHDL Unity Estate</strong> — overseeing Soldier Landlord allocations, civilian tenancy agreements, ₦10,000/mo service charge billing, 24/7 QR gate passes, and military command security.
          </p>

          {/* Primary Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setAuthMode('login');
                setShowAuthModal(true);
              }}
              style={{
                padding: '0.95rem 2rem',
                borderRadius: '8px',
                backgroundColor: '#15803D',
                background: 'linear-gradient(135deg, #15803D 0%, #1B4D21 100%)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 6px 20px rgba(21, 128, 61, 0.45)',
                transition: 'all 0.2s ease',
              }}
            >
              <Lock size={18} /> Access Security Portal <ArrowRight size={18} />
            </button>

            <button
              onClick={onStartOnboarding}
              style={{
                padding: '0.95rem 2rem',
                borderRadius: '8px',
                backgroundColor: '#991B1B',
                background: 'linear-gradient(135deg, #991B1B 0%, #7F1D1D 100%)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 6px 20px rgba(153, 27, 27, 0.45)',
                transition: 'all 0.2s ease',
              }}
            >
              <Sparkles size={18} /> Resident & Landlord Registration
            </button>
          </div>

          {/* 4 Key Real-Time Estate Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginTop: '3.5rem',
              textAlign: 'left',
            }}
          >
            <div style={{ backgroundColor: 'rgba(7, 26, 11, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FCD34D' }}>404 Flats</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.2rem' }}>101 Four-Flat Residential Blocks</div>
            </div>
            <div style={{ backgroundColor: 'rgba(7, 26, 11, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FCD34D' }}>8 Dedicated Lanes</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.2rem' }}>Zoned Infrastructure & Night Patrols</div>
            </div>
            <div style={{ backgroundColor: 'rgba(7, 26, 11, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FCD34D' }}>₦10k / mo</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.2rem' }}>Standardized Service Charge Levy</div>
            </div>
            <div style={{ backgroundColor: 'rgba(7, 26, 11, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FCD34D' }}>24/7 Smart Pass</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.2rem' }}>Biometric QR Gate Clearance</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THREE DEDICATED PORTAL ROLES */}
      <section id="portals" style={{ padding: '5rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ color: '#F59E0B', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            ROLE-BASED COMMAND TIERS
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#FFFFFF', marginTop: '0.35rem' }}>
            Choose Your Access Portal
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.65)', maxWidth: 600, margin: '0.5rem auto 0' }}>
            Select your persona to enter the specialized operational environment.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* CARD 1: SUPERADMIN HQ */}
          <div
            style={{
              backgroundColor: 'rgba(10, 36, 15, 0.75)',
              border: '1.5px solid rgba(153, 27, 27, 0.6)',
              borderRadius: '12px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: '0.2s',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <div style={{ width: 46, height: 46, borderRadius: '8px', backgroundColor: '#991B1B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={24} color="#FFFFFF" />
                </div>
                <span style={{ backgroundColor: 'rgba(153, 27, 27, 0.3)', color: '#FCA5A5', padding: '4px 10px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 800 }}>
                  COMMAND HQ
                </span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.5rem' }}>
                PHDL SuperAdmin HQ
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.5 }}>
                Master estate administration: 8-lane hierarchy oversight, tariff & levy control, bulk SMS/email broadcasts, officer privilege delegation, and signature stamp verification.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '1.2rem 0', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.85)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={15} color="#F59E0B" /> 404 Housing Units Directory & Meter Sync
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={15} color="#F59E0B" /> Official Signature Stamp & Cryptographic Export
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={15} color="#F59E0B" /> SuperAdmin Bulk SMS (Termii / BulkSMSNigeria)
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleQuickLogin('phdl_admin')}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#991B1B',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              Enter SuperAdmin HQ <ChevronRight size={16} />
            </button>
          </div>

          {/* CARD 2: SOLDIER LANDLORD */}
          <div
            style={{
              backgroundColor: 'rgba(10, 36, 15, 0.75)',
              border: '1.5px solid rgba(21, 128, 61, 0.6)',
              borderRadius: '12px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: '0.2s',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <div style={{ width: 46, height: 46, borderRadius: '8px', backgroundColor: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building size={24} color="#FFFFFF" />
                </div>
                <span style={{ backgroundColor: 'rgba(21, 128, 61, 0.3)', color: '#86EFAC', padding: '4px 10px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 800 }}>
                  ALLOCATEE / OWNER
                </span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.5rem' }}>
                Soldier Landlord Portal
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.5 }}>
                For military allocatees: monitor allocated housing flats, track rental payouts & revenue, review subletting civilian tenant profiles, and issue digital passes.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '1.2rem 0', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.85)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={15} color="#22C55E" /> Allocated Unit Property Management
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={15} color="#22C55E" /> Rent Payment Remittance Tracking
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={15} color="#22C55E" /> Armed Forces Gate Pass Identification
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleQuickLogin('soldier')}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#15803D',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              Enter Soldier Portal <ChevronRight size={16} />
            </button>
          </div>

          {/* CARD 3: CIVILIAN RESIDENT TENANT */}
          <div
            style={{
              backgroundColor: 'rgba(10, 36, 15, 0.75)',
              border: '1.5px solid rgba(245, 158, 11, 0.6)',
              borderRadius: '12px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: '0.2s',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <div style={{ width: 46, height: 46, borderRadius: '8px', backgroundColor: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={24} color="#FFFFFF" />
                </div>
                <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.3)', color: '#FDE68A', padding: '4px 10px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 800 }}>
                  VERIFIED RESIDENT
                </span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.5rem' }}>
                Civilian Resident Portal
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.5 }}>
                For estate tenants: pay ₦10,000/month service charge levies, view digital tenancy agreements, manage registered dependents, and log maintenance tickets.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '1.2rem 0', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.85)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={15} color="#F59E0B" /> Pay Monthly Levies via Paystack / Flutterwave
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={15} color="#F59E0B" /> Household Dependents Gate Clearances
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={15} color="#F59E0B" /> Instant Digital Smart QR Gate Pass
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleQuickLogin('tenant')}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#D97706',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              Enter Resident Portal <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 5. AUTHENTICATION / SIGN-IN MODAL */}
      {showAuthModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#071A0B',
              border: '2px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '12px',
              width: '100%',
              maxWidth: 460,
              padding: '2rem',
              color: '#FFFFFF',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <PhdlLogo size={36} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#FFFFFF' }}>
                    Command Portal Sign-In
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: '#F59E0B' }}>Select Your Official Persona</div>
                </div>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '1.5rem 0' }}>
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  onSelectRole('phdl_admin');
                }}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(153, 27, 27, 0.25)',
                  border: '1.5px solid #991B1B',
                  color: '#FFFFFF',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <Shield size={18} color="#EF4444" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Col. Farouk Danjuma (Rtd.)</div>
                  <div style={{ fontSize: '0.72rem', color: '#FCA5A5' }}>SuperAdmin HQ Clearance</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowAuthModal(false);
                  onSelectRole('soldier');
                }}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(21, 128, 61, 0.25)',
                  border: '1.5px solid #15803D',
                  color: '#FFFFFF',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <Building size={18} color="#22C55E" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Staff Sgt. Adamu Mohammed</div>
                  <div style={{ fontSize: '0.72rem', color: '#86EFAC' }}>Soldier Landlord (Flat L1H1A)</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowAuthModal(false);
                  onSelectRole('tenant');
                }}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(217, 119, 6, 0.25)',
                  border: '1.5px solid #D97706',
                  color: '#FFFFFF',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <Users size={18} color="#F59E0B" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Emeka Gabriel Okon</div>
                  <div style={{ fontSize: '0.72rem', color: '#FDE68A' }}>Resident Tenant (Flat L1H1A)</div>
                </div>
              </button>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                New resident or military allocatee?
              </div>
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  onStartOnboarding();
                }}
                style={{
                  marginTop: '0.5rem',
                  background: 'none',
                  border: 'none',
                  color: '#F59E0B',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Begin Tenant Onboarding Wizard →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(245, 158, 11, 0.2)', backgroundColor: '#020A04', padding: '3rem 2rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <PhdlLogo size={36} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#FFFFFF' }}>
                POST-SERVICE HOUSING DEVELOPMENT LIMITED
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>
                FEDERAL REPUBLIC OF NIGERIA • RC 676563
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', textAlign: 'right' }}>
            <div>PHDL Unity Estate HQ • Kurudu, Abuja FCT</div>
            <div style={{ marginTop: '0.2rem', color: '#F59E0B' }}>
              © {new Date().getFullYear()} Post-Service Housing Development Limited. All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
