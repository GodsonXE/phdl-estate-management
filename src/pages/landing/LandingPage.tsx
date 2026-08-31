import React from 'react';
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
} from 'lucide-react';

interface LandingPageProps {
  onNavigateToAuth: (mode: 'login' | 'register', role?: Role) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToAuth }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#030E06', color: '#FFFFFF', fontFamily: 'var(--font-sans, system-ui, sans-serif)', overflowX: 'hidden' }}>
      {/* 1. STICKY NAVIGATION BAR */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(7, 26, 11, 0.94)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
          padding: '0.85rem 2rem',
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

        {/* Navigation Action CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => onNavigateToAuth('login')}
            style={{
              padding: '0.55rem 1.25rem',
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
            onClick={() => onNavigateToAuth('register')}
            style={{
              padding: '0.55rem 1.25rem',
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

      {/* 2. HERO SECTION WITH FADED REAL-ESTATE PHOTOGRAPHY */}
      <section
        style={{
          position: 'relative',
          minHeight: '88vh',
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
        <div style={{ maxWidth: 1150, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          {/* PHDL CREST LOGO IN HERO */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: 86,
                height: 86,
                borderRadius: '50%',
                backgroundColor: 'rgba(7, 26, 11, 0.85)',
                border: '2px solid rgba(245, 158, 11, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 25px rgba(245, 158, 11, 0.35)',
              }}
            >
              <PhdlLogo size={68} />
            </div>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: 'clamp(2.8rem, 5.8vw, 4.6rem)',
              fontWeight: 950,
              lineHeight: 1.12,
              color: '#FFFFFF',
              letterSpacing: '-0.035em',
              margin: '0 auto 1.25rem',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.85)',
              maxWidth: 1000,
            }}
          >
            Modern Armed Forces Housing & Residential Administration
          </h1>

          {/* Updated Subheading */}
          <p
            style={{
              fontSize: 'clamp(0.85rem, 1.35vw, 0.96rem)',
              color: 'rgba(255, 255, 255, 0.82)',
              lineHeight: 1.6,
              maxWidth: 760,
              margin: '0 auto 2.25rem',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
            }}
          >
            Centralized digital ecosystem for <strong>PHDL Estates</strong> — overseeing Soldier Landlord allocations, civilian tenancy agreements, service charge billing, 24/7 QR gate passes, and military command security concerns, nationwide.
          </p>

          {/* Primary Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigateToAuth('login')}
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
              }}
            >
              <Lock size={18} /> Access Security Portal <ArrowRight size={18} />
            </button>

            <button
              onClick={() => onNavigateToAuth('register')}
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
              }}
            >
              <Sparkles size={18} /> Create Resident Account
            </button>
          </div>

          {/* 4 Stats Grid */}
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
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FCD34D' }}>?10k / mo</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.2rem' }}>Standardized Service Charge Levy</div>
            </div>
            <div style={{ backgroundColor: 'rgba(7, 26, 11, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FCD34D' }}>24/7 Smart Pass</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.2rem' }}>Biometric QR Gate Clearance</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THREE DEDICATED PORTAL ROLES */}
      <section style={{ padding: '5rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ color: '#F59E0B', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            ROLE-BASED COMMAND TIERS
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#FFFFFF', marginTop: '0.35rem' }}>
            Select Your Clearance Portal
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* SUPERADMIN */}
          <div style={{ backgroundColor: 'rgba(10, 36, 15, 0.75)', border: '1.5px solid rgba(153, 27, 27, 0.6)', borderRadius: '12px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <div style={{ width: 46, height: 46, borderRadius: '8px', backgroundColor: '#991B1B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={24} color="#FFFFFF" />
                </div>
                <span style={{ backgroundColor: 'rgba(153, 27, 27, 0.3)', color: '#FCA5A5', padding: '4px 10px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>COMMAND HQ</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.5rem' }}>PHDL SuperAdmin HQ</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.5 }}>
                Master estate administration: 8-lane hierarchy oversight, tariff & levy control, bulk SMS/email broadcasts, and signature stamp verification.
              </p>
            </div>
            <button
              onClick={() => onNavigateToAuth('login', 'phdl_admin')}
              style={{ marginTop: '1.5rem', width: '100%', padding: '0.75rem', backgroundColor: '#991B1B', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              Sign In as SuperAdmin HQ <ChevronRight size={16} />
            </button>
          </div>

          {/* SOLDIER */}
          <div style={{ backgroundColor: 'rgba(10, 36, 15, 0.75)', border: '1.5px solid rgba(21, 128, 61, 0.6)', borderRadius: '12px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <div style={{ width: 46, height: 46, borderRadius: '8px', backgroundColor: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building size={24} color="#FFFFFF" />
                </div>
                <span style={{ backgroundColor: 'rgba(21, 128, 61, 0.3)', color: '#86EFAC', padding: '4px 10px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>ALLOCATEE / OWNER</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.5rem' }}>Soldier Landlord Portal</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.5 }}>
                For military allocatees: monitor allocated housing flats, track rental payouts & revenue, and review subletting civilian tenant profiles.
              </p>
            </div>
            <button
              onClick={() => onNavigateToAuth('login', 'soldier')}
              style={{ marginTop: '1.5rem', width: '100%', padding: '0.75rem', backgroundColor: '#15803D', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              Sign In as Soldier Landlord <ChevronRight size={16} />
            </button>
          </div>

          {/* TENANT */}
          <div style={{ backgroundColor: 'rgba(10, 36, 15, 0.75)', border: '1.5px solid rgba(245, 158, 11, 0.6)', borderRadius: '12px', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <div style={{ width: 46, height: 46, borderRadius: '8px', backgroundColor: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={24} color="#FFFFFF" />
                </div>
                <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.3)', color: '#FDE68A', padding: '4px 10px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>VERIFIED RESIDENT</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.5rem' }}>Civilian Resident Portal</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.5 }}>
                For estate tenants: pay ?10,000/month service charge levies, view digital tenancy agreements, and generate smart QR gate passes.
              </p>
            </div>
            <button
              onClick={() => onNavigateToAuth('login', 'tenant')}
              style={{ marginTop: '1.5rem', width: '100%', padding: '0.75rem', backgroundColor: '#D97706', color: '#FFFFFF', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              Sign In as Resident Tenant <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(245, 158, 11, 0.2)', backgroundColor: '#020A04', padding: '3rem 2rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <PhdlLogo size={36} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#FFFFFF' }}>POST-SERVICE HOUSING DEVELOPMENT LIMITED</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>FEDERAL REPUBLIC OF NIGERIA • RC 676563</div>
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', textAlign: 'right' }}>
            <div>PHDL Unity Estate HQ • Kurudu, Abuja FCT</div>
            <div style={{ marginTop: '0.2rem', color: '#F59E0B' }}>© {new Date().getFullYear()} PHDL Nigeria. All Rights Reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
