import React, { useState } from 'react';
import { usePhdlStore, NATIONWIDE_18_ESTATES } from '../../data/storage';
import { Role } from '../../types';
import { PhdlLogo } from '../../components/common/PhdlLogo';
import {
  Shield,
  Building,
  Building2,
  Users,
  CreditCard,
  QrCode,
  Lock,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Phone,
  Mail,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

interface LandingPageProps {
  onNavigateToAuth: (mode: 'login' | 'register', role?: Role) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToAuth }) => {
  const store = usePhdlStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#071A0B', color: '#FFFFFF', overflowX: 'hidden' }}>
      {/* ========================================================================= */}
      {/* 1. TOP NAVBAR (STICKY, BLURRED, RESPONSIVE WITH MOBILE HAMBURGER) */}
      {/* ========================================================================= */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(7, 26, 11, 0.94)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <PhdlLogo size={36} />
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#FFFFFF', letterSpacing: '0.03em', lineHeight: 1.2 }}>
              PHDL Estates
            </div>
            <div style={{ fontSize: '0.65rem', color: '#FBBF24', fontWeight: 700, letterSpacing: '0.04em' }}>
              UNITY ESTATE COMMAND & RESIDENCY PORTAL
            </div>
          </div>
        </div>

        {/* Desktop Nav Actions */}
        <div className="landing-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => onNavigateToAuth('login')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 6,
              backgroundColor: 'transparent',
              border: '1.5px solid #F59E0B',
              color: '#FCD34D',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Lock size={14} /> Portal Sign-In
          </button>

          <button
            type="button"
            onClick={() => onNavigateToAuth('register')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 6,
              backgroundColor: '#991B1B',
              border: 'none',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 12px rgba(153, 27, 27, 0.4)',
            }}
          >
            <Sparkles size={14} /> Resident Onboarding
          </button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="landing-mobile-toggle"
          aria-label="Toggle Navigation Menu"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 6,
            color: '#FFFFFF',
            padding: '0.45rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {mobileMenuOpen ? <X size={22} color="#FBBF24" /> : <Menu size={22} color="#FFFFFF" />}
        </button>
      </nav>

      {/* Mobile Slide-Down Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#0A240F',
            borderBottom: '2px solid rgba(245, 158, 11, 0.3)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: '0 20px 25px rgba(0,0,0,0.5)',
            zIndex: 99,
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#FBBF24', textTransform: 'uppercase' }}>
            Instant Access Portals:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <button
              onClick={() => onNavigateToAuth('login', 'phdl_admin')}
              style={{ padding: '0.6rem 0.4rem', borderRadius: 6, backgroundColor: 'rgba(153, 27, 27, 0.3)', border: '1px solid #991B1B', color: '#FCA5A5', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              🏛️ Admin HQ
            </button>
            <button
              onClick={() => onNavigateToAuth('login', 'soldier')}
              style={{ padding: '0.6rem 0.4rem', borderRadius: 6, backgroundColor: 'rgba(217, 119, 6, 0.3)', border: '1px solid #D97706', color: '#FDE68A', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              🪖 Soldier
            </button>
            <button
              onClick={() => onNavigateToAuth('login', 'tenant')}
              style={{ padding: '0.6rem 0.4rem', borderRadius: 6, backgroundColor: 'rgba(37, 99, 235, 0.3)', border: '1px solid #2563EB', color: '#BFDBFE', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              🏠 Tenant
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              onClick={() => onNavigateToAuth('login')}
              className="btn btn-outline"
              style={{ width: '100%', borderColor: '#F59E0B', color: '#FCD34D', fontWeight: 800 }}
            >
              <Lock size={15} /> Sign In to Resident Portal
            </button>
            <button
              onClick={() => onNavigateToAuth('register')}
              className="btn btn-primary"
              style={{ width: '100%', backgroundColor: '#991B1B', fontWeight: 800 }}
            >
              <Sparkles size={15} /> Register New Resident Profile
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. HERO SECTION (WITH STRICT 400 FLATS & 100 HOUSES) */}
      {/* ========================================================================= */}
      <section
        style={{
          padding: '3rem 1.5rem',
          maxWidth: 1200,
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: 20, backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#FCD34D', fontSize: '0.75rem', fontWeight: 800 }}>
          <Shield size={14} color="#FBBF24" />
          <span>ARMED FORCES HOUSING SCHEME • RC 676563</span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.15, maxWidth: 900 }}>
          Post-Housing Development Limited Estate Management System
        </h1>

        <p style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)', color: 'rgba(255, 255, 255, 0.8)', maxWidth: 780, lineHeight: 1.6 }}>
          Central command for <strong>PHDL Unity Estate (Kurudu, Abuja)</strong> — managing all <strong>400 residential flats across 100 houses and 8 zoned lanes</strong>, ₦10,000 monthly service charges, 24/7 QR gate passes, and 18 portfolio schemes nationwide.
        </p>

        {/* Primary Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={() => onNavigateToAuth('login', 'phdl_admin')}
            className="btn btn-primary"
            style={{ backgroundColor: '#15803D', padding: '0.75rem 1.5rem', fontWeight: 800, fontSize: '0.92rem', gap: '0.5rem' }}
          >
            🏛️ SuperAdmin HQ Control <ArrowRight size={16} />
          </button>

          <button
            type="button"
            onClick={() => onNavigateToAuth('login', 'soldier')}
            className="btn btn-outline"
            style={{ borderColor: '#F59E0B', color: '#FCD34D', padding: '0.75rem 1.5rem', fontWeight: 800, fontSize: '0.92rem', gap: '0.5rem' }}
          >
            🪖 Soldier Landlord Portal
          </button>

          <button
            type="button"
            onClick={() => onNavigateToAuth('login', 'tenant')}
            className="btn btn-outline"
            style={{ borderColor: '#3B82F6', color: '#93C5FD', padding: '0.75rem 1.5rem', fontWeight: 800, fontSize: '0.92rem', gap: '0.5rem' }}
          >
            🏠 Resident Tenant Portal
          </button>
        </div>

        {/* 4 Primary Metric Badges (Strictly 400 Flats) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', width: '100%', marginTop: '2rem' }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 10, padding: '1.25rem' }}>
            <Building2 size={24} color="#22C55E" style={{ marginBottom: 6 }} />
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF' }}>400 Flats</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.65)' }}>100 Houses • 8 Zoned Lanes</div>
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 10, padding: '1.25rem' }}>
            <Users size={24} color="#FBBF24" style={{ marginBottom: 6 }} />
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF' }}>372 Residents</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.65)' }}>288 Soldiers • 84 Tenants</div>
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 10, padding: '1.25rem' }}>
            <CreditCard size={24} color="#38BDF8" style={{ marginBottom: 6 }} />
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF' }}>₦4,000,000</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.65)' }}>Monthly Service Charge Target</div>
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 10, padding: '1.25rem' }}>
            <Shield size={24} color="#F87171" style={{ marginBottom: 6 }} />
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF' }}>18 Schemes</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.65)' }}>Nationwide Military Schemes</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', padding: '2rem 1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>
        <div>POST-HOUSING DEVELOPMENT LIMITED (PHDL) • ARMED FORCES HOUSING SCHEME RC 676563</div>
        <div style={{ marginTop: '0.35rem' }}>Unity Estate, Kurudu, Abuja FCT • Emergency Security: +234 803 999 0001</div>
      </footer>
    </div>
  );
};

export default LandingPage;