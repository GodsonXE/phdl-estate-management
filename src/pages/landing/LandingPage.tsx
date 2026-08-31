import React, { useState } from 'react';
import { PhdlLogo } from '../../components/common/PhdlLogo';
import { Role } from '../../types';
import {
  Shield,
  Building,
  Users,
  Lock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

interface LandingPageProps {
  onNavigateToAuth: (mode: 'login' | 'register', role?: Role) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToAuth }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#030E06', color: '#FFFFFF', fontFamily: 'var(--font-sans, system-ui, sans-serif)', overflowX: 'hidden' }}>
      {/* 1. STICKY RESPONSIVE NAVIGATION BAR */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(7, 26, 11, 0.94)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
          padding: '0.75rem clamp(1rem, 3vw, 2rem)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <PhdlLogo size={36} />
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#FFFFFF', letterSpacing: '0.03em', lineHeight: 1.2 }}>
              PHDL Estates
            </div>
            <div className="mobile-subtext" style={{ fontSize: '0.68rem', color: '#F59E0B', fontWeight: 700, letterSpacing: '0.02em' }}>
              UNITY ESTATE COMMAND & RESIDENCY PORTAL
            </div>
          </div>
        </div>

        {/* Desktop Navigation Action CTAs */}
        <div className="landing-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            onClick={() => onNavigateToAuth('login')}
            style={{
              padding: '0.55rem 1.15rem',
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
              transition: 'all 0.2s ease',
            }}
          >
            <Lock size={14} /> Portal Sign-In
          </button>

          <button
            onClick={() => onNavigateToAuth('register')}
            style={{
              padding: '0.55rem 1.15rem',
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
              transition: 'all 0.2s ease',
            }}
          >
            <Sparkles size={14} /> Resident Onboarding
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="landing-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '6px',
            color: '#FFFFFF',
            padding: '0.45rem',
            cursor: 'pointer',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {mobileMenuOpen ? <X size={22} color="#F59E0B" /> : <Menu size={22} color="#FFFFFF" />}
        </button>
      </nav>

      {/* Mobile Navigation Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div
          className="landing-mobile-menu"
          style={{
            backgroundColor: 'rgba(5, 20, 9, 0.98)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '2px solid rgba(245, 158, 11, 0.4)',
            padding: '1.25rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.7)',
            position: 'sticky',
            top: 56,
            zIndex: 99,
          }}
        >
          <div style={{ fontSize: '0.72rem', color: '#F59E0B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            PORTAL ACCESS & REGISTRATION
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToAuth('login');
              }}
              style={{
                width: '100%',
                minHeight: '46px',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                border: '1.5px solid #F59E0B',
                color: '#FCD34D',
                fontWeight: 800,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
              }}
            >
              <Lock size={16} /> Portal Sign-In
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToAuth('register');
              }}
              style={{
                width: '100%',
                minHeight: '46px',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: '#991B1B',
                border: 'none',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(153, 27, 27, 0.4)',
                cursor: 'pointer',
              }}
            >
              <Sparkles size={16} /> Resident Onboarding
            </button>
          </div>

          <hr style={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '0.25rem 0' }} />

          <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 700 }}>
            DIRECT ROLE CLEARANCE
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToAuth('login', 'phdl_admin');
              }}
              style={{
                padding: '0.65rem 0.85rem',
                backgroundColor: 'rgba(153, 27, 27, 0.2)',
                border: '1px solid rgba(153, 27, 27, 0.5)',
                borderRadius: '6px',
                color: '#FCA5A5',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={14} color="#FCA5A5" /> SuperAdmin HQ Portal
              </span>
              <ChevronRight size={14} />
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToAuth('login', 'soldier');
              }}
              style={{
                padding: '0.65rem 0.85rem',
                backgroundColor: 'rgba(21, 128, 61, 0.2)',
                border: '1px solid rgba(21, 128, 61, 0.5)',
                borderRadius: '6px',
                color: '#86EFAC',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building size={14} color="#86EFAC" /> Soldier Landlord Portal
              </span>
              <ChevronRight size={14} />
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToAuth('login', 'tenant');
              }}
              style={{
                padding: '0.65rem 0.85rem',
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                border: '1px solid rgba(245, 158, 11, 0.5)',
                borderRadius: '6px',
                color: '#FDE68A',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={14} color="#FDE68A" /> Civilian Resident Portal
              </span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 2. HERO SECTION WITH FADED REAL-ESTATE PHOTOGRAPHY */}
      <section
        style={{
          position: 'relative',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(2.5rem, 5vw, 4.5rem) clamp(1rem, 3vw, 2rem)',
          backgroundImage: 'linear-gradient(180deg, rgba(4, 20, 9, 0.82) 0%, rgba(7, 26, 11, 0.90) 60%, rgba(3, 14, 6, 0.98) 100%), url("/estate-hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div style={{ maxWidth: 1150, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2, width: '100%' }}>
          {/* PHDL CREST LOGO IN HERO */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: '50%',
                backgroundColor: 'rgba(7, 26, 11, 0.88)',
                border: '2px solid rgba(245, 158, 11, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 25px rgba(245, 158, 11, 0.35)',
              }}
            >
              <PhdlLogo size={58} />
            </div>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: 'clamp(1.85rem, 5.2vw, 4.2rem)',
              fontWeight: 950,
              lineHeight: 1.15,
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
              margin: '0 auto 1.25rem',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.85)',
              maxWidth: 960,
              padding: '0 0.5rem',
            }}
          >
            Modern Armed Forces Housing & Residential Administration
          </h1>

          {/* Subheading */}
          <p
            style={{
              fontSize: 'clamp(0.85rem, 2.2vw, 1.05rem)',
              color: 'rgba(255, 255, 255, 0.88)',
              lineHeight: 1.6,
              maxWidth: 760,
              margin: '0 auto 2rem',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
              padding: '0 0.5rem',
            }}
          >
            Centralized digital ecosystem for <strong style={{ color: '#FCD34D' }}>PHDL Estates</strong> — overseeing Soldier Landlord allocations, civilian tenancy agreements, service charge billing, 24/7 QR gate passes, and military command security concerns, nationwide.
          </p>

          {/* Primary Action Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.85rem',
              flexWrap: 'wrap',
              margin: '0 auto',
              maxWidth: 600,
            }}
          >
            <button
              onClick={() => onNavigateToAuth('login')}
              style={{
                flex: '1 1 240px',
                minHeight: '48px',
                padding: '0.85rem 1.5rem',
                borderRadius: '8px',
                backgroundColor: '#15803D',
                background: 'linear-gradient(135deg, #15803D 0%, #1B4D21 100%)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.95rem',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                boxShadow: '0 6px 20px rgba(21, 128, 61, 0.45)',
                transition: 'transform 0.15s ease',
              }}
            >
              <Lock size={18} /> Access Security Portal <ArrowRight size={18} />
            </button>

            <button
              onClick={() => onNavigateToAuth('register')}
              style={{
                flex: '1 1 240px',
                minHeight: '48px',
                padding: '0.85rem 1.5rem',
                borderRadius: '8px',
                backgroundColor: '#991B1B',
                background: 'linear-gradient(135deg, #991B1B 0%, #7F1D1D 100%)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.95rem',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                boxShadow: '0 6px 20px rgba(153, 27, 27, 0.45)',
                transition: 'transform 0.15s ease',
              }}
            >
              <Sparkles size={18} /> Create Resident Account
            </button>
          </div>

          {/* 4 Stats Grid (Responsive 2-col on mobile, 4-col on desktop) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '0.85rem',
              marginTop: '3rem',
              textAlign: 'left',
            }}
          >
            <div style={{ backgroundColor: 'rgba(7, 26, 11, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.75rem)', fontWeight: 900, color: '#FCD34D', lineHeight: 1.1 }}>404 Flats</div>
              <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.75)', marginTop: '0.25rem' }}>101 Four-Flat Residential Blocks</div>
            </div>
            <div style={{ backgroundColor: 'rgba(7, 26, 11, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.75rem)', fontWeight: 900, color: '#FCD34D', lineHeight: 1.1 }}>8 Dedicated Lanes</div>
              <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.75)', marginTop: '0.25rem' }}>Zoned Infrastructure & Security</div>
            </div>
            <div style={{ backgroundColor: 'rgba(7, 26, 11, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.75rem)', fontWeight: 900, color: '#FCD34D', lineHeight: 1.1 }}>₦10k / mo</div>
              <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.75)', marginTop: '0.25rem' }}>Standardized Service Charge Levy</div>
            </div>
            <div style={{ backgroundColor: 'rgba(7, 26, 11, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.75rem)', fontWeight: 900, color: '#FCD34D', lineHeight: 1.1 }}>24/7 Smart Pass</div>
              <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.75)', marginTop: '0.25rem' }}>Biometric QR Gate Clearance</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THREE DEDICATED PORTAL ROLES */}
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) clamp(1rem, 3vw, 2rem)', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ color: '#F59E0B', fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            ROLE-BASED COMMAND TIERS
          </div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 900, color: '#FFFFFF', marginTop: '0.35rem' }}>
            Select Your Clearance Portal
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {/* SUPERADMIN */}
          <div style={{ backgroundColor: 'rgba(10, 36, 15, 0.75)', border: '1.5px solid rgba(153, 27, 27, 0.6)', borderRadius: '12px', padding: 'clamp(1.25rem, 3vw, 1.75rem)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '8px', backgroundColor: '#991B1B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={22} color="#FFFFFF" />
                </div>
                <span style={{ backgroundColor: 'rgba(153, 27, 27, 0.3)', color: '#FCA5A5', padding: '4px 10px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>COMMAND HQ</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.5rem' }}>PHDL SuperAdmin HQ</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.5 }}>
                Master estate administration: 8-lane hierarchy oversight, tariff & levy control, bulk SMS/email broadcasts, and signature stamp verification.
              </p>
            </div>
            <button
              onClick={() => onNavigateToAuth('login', 'phdl_admin')}
              style={{ marginTop: '1.25rem', width: '100%', minHeight: '44px', padding: '0.75rem', backgroundColor: '#991B1B', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              Sign In as SuperAdmin HQ <ChevronRight size={16} />
            </button>
          </div>

          {/* SOLDIER */}
          <div style={{ backgroundColor: 'rgba(10, 36, 15, 0.75)', border: '1.5px solid rgba(21, 128, 61, 0.6)', borderRadius: '12px', padding: 'clamp(1.25rem, 3vw, 1.75rem)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '8px', backgroundColor: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building size={22} color="#FFFFFF" />
                </div>
                <span style={{ backgroundColor: 'rgba(21, 128, 61, 0.3)', color: '#86EFAC', padding: '4px 10px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>ALLOCATEE / OWNER</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.5rem' }}>Soldier Landlord Portal</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.5 }}>
                For military allocatees: monitor allocated housing flats, track rental payouts & revenue, and review subletting civilian tenant profiles.
              </p>
            </div>
            <button
              onClick={() => onNavigateToAuth('login', 'soldier')}
              style={{ marginTop: '1.25rem', width: '100%', minHeight: '44px', padding: '0.75rem', backgroundColor: '#15803D', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              Sign In as Soldier Landlord <ChevronRight size={16} />
            </button>
          </div>

          {/* TENANT */}
          <div style={{ backgroundColor: 'rgba(10, 36, 15, 0.75)', border: '1.5px solid rgba(245, 158, 11, 0.6)', borderRadius: '12px', padding: 'clamp(1.25rem, 3vw, 1.75rem)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '8px', backgroundColor: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={22} color="#FFFFFF" />
                </div>
                <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.3)', color: '#FDE68A', padding: '4px 10px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>VERIFIED RESIDENT</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.5rem' }}>Civilian Resident Portal</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.5 }}>
                For estate tenants: pay ₦10,000/month service charge levies, view digital tenancy agreements, and generate smart QR gate passes.
              </p>
            </div>
            <button
              onClick={() => onNavigateToAuth('login', 'tenant')}
              style={{ marginTop: '1.25rem', width: '100%', minHeight: '44px', padding: '0.75rem', backgroundColor: '#D97706', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              Sign In as Resident Tenant <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(245, 158, 11, 0.2)', backgroundColor: '#020A04', padding: '2.5rem clamp(1rem, 3vw, 2rem) 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <PhdlLogo size={36} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#FFFFFF' }}>PHDL Estates</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>FEDERAL REPUBLIC OF NIGERIA • RC 676563</div>
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
            <div>PHDL Unity Estate HQ • Kurudu, Abuja FCT</div>
            <div style={{ marginTop: '0.2rem', color: '#F59E0B' }}>© {new Date().getFullYear()} PHDL Estates Nigeria. All Rights Reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
