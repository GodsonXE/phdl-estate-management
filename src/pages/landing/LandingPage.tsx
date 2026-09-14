import React, { useState } from 'react';
import {
  Shield,
  Home,
  Key,
  CreditCard,
  Users,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Calculator,
  Building2,
  PhoneCall,
  FileText,
  Zap,
  Award,
  Activity,
  Lock,
  Check,
  ExternalLink,
  HelpCircle,
  Menu,
  X,
  Clock,
  Compass,
  DollarSign
} from 'lucide-react';

interface LandingPageProps {
  onNavigate?: (page: string) => void;
  onLoginClick?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onLoginClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'landlords' | 'tenants' | 'security' | 'finance'>('landlords');
  
  // Interactive Calculator State
  const [rentEstimate, setRentEstimate] = useState<number>(1800000);
  const [levyEstimate, setLevyEstimate] = useState<number>(120000);
  const [flatsCount, setFlatsCount] = useState<number>(1);

  // Computed Calculator Metrics
  const grossRent = rentEstimate * flatsCount;
  const totalLevies = levyEstimate * flatsCount;
  const netIncome = grossRent - totalLevies;
  const monthlyRemittance = Math.round(netIncome / 12);

  // Universal Navigation Dispatcher
  const handleNav = (target: string) => {
    if (target === 'login' && onLoginClick) {
      onLoginClick();
      return;
    }
    if (onNavigate) {
      onNavigate(target);
      return;
    }
    // Fallback URL / hash assignment
    if (target.startsWith('#') || target.startsWith('http')) {
      window.location.href = target;
    } else {
      window.location.hash = target;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#07120a', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', overflowX: 'hidden' }}>
      
      {/* ========================================================================= */}
      {/* 1. TOP ANNOUNCEMENT TICKER                                               */}
      {/* ========================================================================= */}
      <div style={{ backgroundColor: '#0f291e', borderBottom: '1px solid rgba(245, 158, 11, 0.2)', padding: '0.45rem 1rem', fontSize: '0.78rem', color: '#fef3c7', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', textAlign: 'center', flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#15803d', color: '#fff', padding: '0.1rem 0.5rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.04em' }}>
          <Zap size={11} /> LIVE OPS
        </span>
        <span>
          <strong>PHDL Unity Estate (Kurudu, Abuja):</strong> 400 Residential Flats (100 Houses) across 8 Zoned Lanes operational.
        </span>
        <button
          onClick={() => handleNav('login')}
          style={{ background: 'none', border: 'none', color: '#fbbf24', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', padding: 0, font: 'inherit' }}
        >
          Staff & Resident Login &rarr;
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. STICKY GLASSMORPHIC NAVBAR                                             */}
      {/* ========================================================================= */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(7, 18, 10, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0.75rem clamp(1rem, 4vw, 2.5rem)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => handleNav('home')}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #15803d 0%, #047857 50%, #b45309 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(21, 128, 61, 0.4)',
            border: '1px solid rgba(251, 191, 36, 0.3)'
          }}>
            <Shield size={24} color="#fef08a" />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.15rem', color: '#ffffff', letterSpacing: '0.02em', lineHeight: 1.1 }}>
              PHDL <span style={{ color: '#f59e0b' }}>ESTATES</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>
              ARMED FORCES RESIDENCY ECOSYSTEM
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="landing-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <a href="#features" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, transition: 'color 0.2s' }}>Features</a>
          <a href="#lanes" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, transition: 'color 0.2s' }}>400 Flats Layout</a>
          <a href="#calculator" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, transition: 'color 0.2s' }}>Yield Calculator</a>
          <a href="#schemes" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, transition: 'color 0.2s' }}>18 Nationwide Schemes</a>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
            <button
              onClick={() => handleNav('login')}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Sign In
            </button>

            <button
              onClick={() => handleNav('login')}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
                border: '1px solid rgba(251, 191, 36, 0.4)',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s'
              }}
            >
              Launch Portal <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="landing-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            color: '#ffffff',
            padding: '0.5rem',
            cursor: 'pointer'
          }}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#0a1a0f',
          borderBottom: '2px solid rgba(245, 158, 11, 0.3)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          position: 'sticky',
          top: '60px',
          zIndex: 99
        }}>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>Platform Features</a>
          <a href="#lanes" onClick={() => setMobileMenuOpen(false)} style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>400 Flats Layout</a>
          <a href="#calculator" onClick={() => setMobileMenuOpen(false)} style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>Rental Yield Calculator</a>
          <a href="#schemes" onClick={() => setMobileMenuOpen(false)} style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>18 Nationwide Schemes</a>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              onClick={() => { setMobileMenuOpen(false); handleNav('login'); }}
              style={{ textAlign: 'center', padding: '0.7rem', borderRadius: '8px', backgroundColor: '#15803d', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer' }}
            >
              Sign In to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. HERO SECTION WITH IMAGE BACKGROUND & FLOATING GLIDERS                 */}
      {/* ========================================================================= */}
      <section style={{
        position: 'relative',
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(3rem, 6vw, 6rem) clamp(1rem, 4vw, 2.5rem)',
        backgroundImage: `linear-gradient(180deg, rgba(7, 18, 10, 0.75) 0%, rgba(7, 18, 10, 0.92) 75%, #07120a 100%), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden'
      }}>
        
        {/* Ambient Glows */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: '380px', height: '380px', background: 'radial-gradient(circle, rgba(22, 163, 74, 0.22) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '420px', height: '420px', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.16) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        {/* Floating Glider 1 (Top Right: Live Autopay Settled) */}
        <div className="floating-glider-card glider-top-right" style={{
          position: 'absolute',
          top: '12%',
          right: '5%',
          backgroundColor: 'rgba(15, 35, 22, 0.82)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(34, 197, 94, 0.35)',
          borderRadius: '12px',
          padding: '0.85rem 1.15rem',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
          maxWidth: '290px',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 10px #22c55e', animation: 'pulseRadar 2s infinite' }} />
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#86efac', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Autopay Settlement
            </div>
          </div>
          <div style={{ marginTop: '0.35rem', fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>
            ₦10,000 Service Charge
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            Lane 4 (Victory Cres) • Auto-Reconciled
          </div>
        </div>

        {/* Floating Glider 2 (Bottom Left: Perimeter Sentinel) */}
        <div className="floating-glider-card glider-bottom-left" style={{
          position: 'absolute',
          bottom: '12%',
          left: '4%',
          backgroundColor: 'rgba(15, 35, 22, 0.82)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: '12px',
          padding: '0.85rem 1.15rem',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
          maxWidth: '280px',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={16} color="#fbbf24" />
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fde047', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Sentinel Access Guard
            </div>
          </div>
          <div style={{ marginTop: '0.35rem', fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>
            372 Active RFID Gate Passes
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            All 8 Lanes Under 24/7 Surveillance
          </div>
        </div>

        {/* Main Hero Center Container */}
        <div style={{ position: 'relative', zIndex: 5, maxWidth: '920px', textAlign: 'center', margin: '0 auto' }}>
          
          {/* Overline Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(21, 128, 61, 0.25)',
            border: '1px solid rgba(245, 158, 11, 0.45)',
            fontSize: '0.82rem',
            color: '#fef08a',
            fontWeight: 800,
            marginBottom: '1.5rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
          }}>
            <Sparkles size={15} color="#f59e0b" />
            <span>POST-HOUSING DEVELOPMENT LIMITED • RESIDENCY COMMAND</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5.5vw, 3.85rem)',
            fontWeight: 900,
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            marginBottom: '1.25rem',
            textShadow: '0 2px 20px rgba(0,0,0,0.6)'
          }}>
            Command & Luxury Living in <br />
            <span style={{
              background: 'linear-gradient(135deg, #4ade80 0%, #fbbf24 60%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Seamless Harmony.
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(0.98rem, 2vw, 1.2rem)',
            color: '#cbd5e1',
            lineHeight: 1.6,
            maxWidth: '760px',
            margin: '0 auto 2.25rem',
            textShadow: '0 1px 6px rgba(0,0,0,0.5)'
          }}>
            The premier PropTech ecosystem engineered for <strong>400 Residential Flats (100 Houses across 8 Zoned Lanes)</strong> at Unity Estate, Kurudu. Oversee soldier equity allocations, automated ₦10,000 monthly service levies, smart RFID gate passes, and military pension sync.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <button
              onClick={() => handleNav('login')}
              style={{
                padding: '0.9rem 2rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
                border: '1px solid rgba(251, 191, 36, 0.5)',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(22, 163, 74, 0.45)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'transform 0.2s'
              }}
            >
              Enter Resident Portal <ArrowRight size={18} />
            </button>

            <a
              href="#calculator"
              style={{
                padding: '0.9rem 1.75rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#f8fafc',
                fontSize: '1rem',
                fontWeight: 700,
                textDecoration: 'none',
                backdropFilter: 'blur(10px)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Calculator size={18} color="#fbbf24" /> Yield Calculator
            </a>
          </div>

          {/* Quick Metrics Banner */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            backgroundColor: 'rgba(15, 35, 22, 0.7)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '14px',
            padding: '1.25rem 1.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
          }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#4ade80' }}>400</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Residential Flats</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fbbf24' }}>100</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>4-Flat Blocks</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#38bdf8' }}>8</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Zoned Lanes</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f43f5e' }}>18</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Nationwide Schemes</div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. INFINITE MARQUEE TELEMETRY TICKER                                      */}
      {/* ========================================================================= */}
      <div style={{
        backgroundColor: '#05180c',
        borderTop: '1px solid rgba(245, 158, 11, 0.2)',
        borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
        padding: '0.75rem 0',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}>
        <div className="marquee-track" style={{ display: 'inline-flex', gap: '3rem', animation: 'marqueeGlider 32s linear infinite' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.84rem', color: '#cbd5e1' }}>
            <span style={{ color: '#22c55e' }}>●</span> <strong>GATE RFID SENTINEL:</strong> 99.8% Online (372 Passes Active)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.84rem', color: '#cbd5e1' }}>
            <span style={{ color: '#fbbf24' }}>⚡</span> <strong>MAIN GENERATOR:</strong> 42% Load (650 kVA Standby)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.84rem', color: '#cbd5e1' }}>
            <span style={{ color: '#38bdf8' }}>💧</span> <strong>WATER FILTRATION RESERVE:</strong> 40,000 Litres (Pumps Online)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.84rem', color: '#cbd5e1' }}>
            <span style={{ color: '#4ade80' }}>💰</span> <strong>SERVICE CHARGE COLLECTION:</strong> 98.4% (₦3.94M / ₦4.0M)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.84rem', color: '#eab308' }}>
            <span style={{ color: '#eab308' }}>🎖️</span> <strong>STATUTORY ALLOCATIONS:</strong> 400 / 400 Flats Assigned across 8 Lanes
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.84rem', color: '#f43f5e' }}>
            <span style={{ color: '#f43f5e' }}>🛡️</span> <strong>SENTINEL PATROL:</strong> 8/8 Lanes Active & Verified
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. 4-PILLAR PROPTECH FEATURE NAVIGATOR                                    */}
      {/* ========================================================================= */}
      <section id="features" style={{ padding: 'clamp(4rem, 6vw, 7rem) clamp(1rem, 4vw, 2.5rem)', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ color: '#4ade80', fontWeight: 800, fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            ENGINEERED FOR MILITARY & RESIDENTIAL PRECISION
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em' }}>
            Complete Lifecycle PropTech Platform
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '650px', margin: '0.75rem auto 0', fontSize: '1rem' }}>
            Designed exclusively to balance armed forces homeownership mandates, civilian tenancy convenience, automated financial reconciliations, and military-grade perimeter defense.
          </p>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {[
            { id: 'landlords', label: 'Soldier Landlords', icon: Award },
            { id: 'tenants', label: 'Resident Tenants', icon: Home },
            { id: 'security', label: 'Perimeter Sentinel', icon: Shield },
            { id: 'finance', label: 'Financial Automation', icon: CreditCard }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  backgroundColor: isActive ? '#15803d' : 'rgba(255, 255, 255, 0.05)',
                  border: isActive ? '1px solid rgba(251, 191, 36, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 6px 18px rgba(21, 128, 61, 0.4)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={16} color={isActive ? '#fef08a' : '#94a3b8'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Cards */}
        <div style={{
          backgroundColor: 'rgba(15, 35, 22, 0.5)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '18px',
          padding: 'clamp(1.5rem, 4vw, 3rem)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
        }}>
          {activeTab === 'landlords' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#fbbf24', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem' }}>OFFICER & SOLDIER HUB</div>
                <h3 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', marginBottom: '1rem', lineHeight: 1.2 }}>
                  Guaranteed Statutory Equity & Remittance Tracking
                </h3>
                <p style={{ color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  Enforces the strict 1-apartment statutory limit per active/retired military personnel. Monitor rent payments, tenant leases, and automated military pension deductions directly from your smartphone.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    'Instant Digital Expression of Interest (EOI) Filing',
                    'Real-time Rent Remittance to Personal Military Accounts',
                    'Official Printable Allocation Deeds with QR Verification',
                    'Direct Military Pension Remittance Sync'
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', color: '#e2e8f0' }}>
                      <CheckCircle2 size={18} color="#22c55e" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{
                backgroundColor: '#0a1e12',
                border: '1px solid rgba(34, 197, 94, 0.25)',
                borderRadius: '14px',
                padding: '1.75rem',
                boxShadow: '0 12px 24px rgba(0,0,0,0.5)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.95rem' }}>Officer Equity Portfolio</div>
                  <span style={{ fontSize: '0.72rem', backgroundColor: '#15803d', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>ALLOCATED</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Designated Apartment:</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fef08a' }}>House 14, Flat B • Lane 3 (Command Ave)</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Annual Rent:</div>
                    <div style={{ fontWeight: 800, color: '#4ade80' }}>₦1,800,000</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Next Remittance:</div>
                    <div style={{ fontWeight: 800, color: '#38bdf8' }}>1st Oct 2026</div>
                  </div>
                </div>
                <button
                  onClick={() => handleNav('login')}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    borderRadius: '8px',
                    backgroundColor: '#15803d',
                    color: '#ffffff',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Sign In to Landlord Portal &rarr;
                </button>
              </div>
            </div>
          )}

          {activeTab === 'tenants' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem' }}>RESIDENT EXPERIENCE</div>
                <h3 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', marginBottom: '1rem', lineHeight: 1.2 }}>
                  Frictionless Living, Metering & Instant Maintenance
                </h3>
                <p style={{ color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  Enjoy automated monthly service charge payments (₦10,000/flat), digital electricity recharge tokens, gate passes for visitors, and 24/7 direct communication with estate management.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    'One-Click ₦10,000 Monthly Service Charge Autopay',
                    'Instant Maintenance Dispatch & Plumber/Electrician Ticketing',
                    'Single-Use QR Codes for Visitor Gate Clearance',
                    'Community Broadcasts & Facility Booking (Football Turf & Hall)'
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', color: '#e2e8f0' }}>
                      <CheckCircle2 size={18} color="#38bdf8" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{
                backgroundColor: '#0a1e12',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '14px',
                padding: '1.75rem',
                boxShadow: '0 12px 24px rgba(0,0,0,0.5)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.95rem' }}>Resident Tenant App</div>
                  <span style={{ fontSize: '0.72rem', backgroundColor: '#0284c7', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>ACTIVE</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Service Charge Status:</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4ade80' }}>Settled (₦10,000 / Current Month)</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Visitor Pass:</div>
                    <div style={{ fontWeight: 800, color: '#fbbf24' }}>GEN-9824-QR</div>
                  </div>
                  <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Water Supply:</div>
                    <div style={{ fontWeight: 800, color: '#38bdf8' }}>Normal (Tank A)</div>
                  </div>
                </div>
                <button
                  onClick={() => handleNav('login')}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    borderRadius: '8px',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Access Resident Dashboard &rarr;
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#f43f5e', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem' }}>MILITARY-GRADE DEFENSE</div>
                <h3 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', marginBottom: '1rem', lineHeight: 1.2 }}>
                  Perimeter Sentinel & Smart RFID Gate Barriers
                </h3>
                <p style={{ color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  Secured by armed military sentries and automated access gates. Every vehicle and pedestrian is validated against our live registry before entry into the 8 zoned lanes.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    'Automatic Number Plate Recognition (ANPR) at Main Gate',
                    'Real-time RFID Vehicle Windshield Tags for 400 Flats',
                    'Instant Resident App Panic & SOS Emergency Beacon',
                    '24/7 Sentry Shift Telemetry & CCTV Perimeter Logging'
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', color: '#e2e8f0' }}>
                      <CheckCircle2 size={18} color="#f43f5e" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{
                backgroundColor: '#0a1e12',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                borderRadius: '14px',
                padding: '1.75rem',
                boxShadow: '0 12px 24px rgba(0,0,0,0.5)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.95rem' }}>Sentry Command Console</div>
                  <span style={{ fontSize: '0.72rem', backgroundColor: '#e11d48', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>ARMED SENTRY</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Gate Barrier State:</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#22c55e' }}>LOCKED & ARMED (RFID VERIFIED)</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Active RFID Tags:</div>
                    <div style={{ fontWeight: 800, color: '#4ade80' }}>372 Tags</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Incident Index:</div>
                    <div style={{ fontWeight: 800, color: '#22c55e' }}>0.00 (Zero Alert)</div>
                  </div>
                </div>
                <button
                  onClick={() => handleNav('login')}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    borderRadius: '8px',
                    backgroundColor: '#be123c',
                    color: '#ffffff',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Launch Security Console &rarr;
                </button>
              </div>
            </div>
          )}

          {activeTab === 'finance' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#eab308', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem' }}>FINANCIAL AUDIT TRAIL</div>
                <h3 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', marginBottom: '1rem', lineHeight: 1.2 }}>
                  ₦4.0M Monthly Levies & Automated Reconciliation
                </h3>
                <p style={{ color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  Eliminate cash leakages and disputes. Every ₦10,000 levy from all 400 flats is pooled automatically for estate generator diesel, waste disposal, water pumping, and sentry allowances.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    'Instant Multi-Channel Paystack / Flutterwave Gateways',
                    'Zero-Deficit Financial Audit Trails with Auto-Receipting',
                    'Automated Defaulter Gate Restriction Tagging',
                    'Transparent Public Ledger for Resident Association'
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', color: '#e2e8f0' }}>
                      <CheckCircle2 size={18} color="#eab308" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{
                backgroundColor: '#0a1e12',
                border: '1px solid rgba(234, 179, 8, 0.25)',
                borderRadius: '14px',
                padding: '1.75rem',
                boxShadow: '0 12px 24px rgba(0,0,0,0.5)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.95rem' }}>Monthly Levy Dashboard</div>
                  <span style={{ fontSize: '0.72rem', backgroundColor: '#ca8a04', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>400 FLATS</span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Monthly Pool:</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fef08a' }}>₦4,000,000 / Month</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Reconciled (98.4%):</div>
                    <div style={{ fontWeight: 800, color: '#4ade80' }}>₦3,940,000</div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Defaulter Count:</div>
                    <div style={{ fontWeight: 800, color: '#f87171' }}>6 Flats</div>
                  </div>
                </div>
                <button
                  onClick={() => handleNav('login')}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    borderRadius: '8px',
                    backgroundColor: '#ca8a04',
                    color: '#ffffff',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Open Financial Ledger &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. 400 FLATS 8-LANE ZONED ARCHITECTURE BREAKDOWN                          */}
      {/* ========================================================================= */}
      <section id="lanes" style={{
        padding: 'clamp(4rem, 6vw, 6rem) clamp(1rem, 4vw, 2.5rem)',
        backgroundColor: '#05140b',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ color: '#fbbf24', fontWeight: 800, fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              UNITY ESTATE MASTER ARCHITECTURE (KURUDU, ABUJA)
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 900, color: '#ffffff' }}>
              400 Flats • 100 Houses across 8 Zoned Lanes
            </h2>
            <p style={{ color: '#94a3b8', maxWidth: '680px', margin: '0.75rem auto 0', fontSize: '1rem' }}>
              Every residential block contains exactly 4 units (Flat A, Flat B, Flat C, Flat D). All 8 lanes are fully mapped and synchronized with smart utility meters.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
            {[
              { lane: 'Lane 1', name: "General's Boulevard", houses: 9, flats: 36, range: 'Houses 1 - 9' },
              { lane: 'Lane 2', name: 'Brigade Way', houses: 17, flats: 68, range: 'Houses 10 - 26' },
              { lane: 'Lane 3', name: 'Command Avenue', houses: 18, flats: 72, range: 'Houses 27 - 44' },
              { lane: 'Lane 4', name: 'Victory Crescent', houses: 18, flats: 72, range: 'Houses 45 - 62' },
              { lane: 'Lane 5', name: 'Courage Drive', houses: 16, flats: 64, range: 'Houses 63 - 78' },
              { lane: 'Lane 6', name: 'Harmony Lane', houses: 8, flats: 32, range: 'Houses 79 - 86' },
              { lane: 'Lane 7', name: 'Peace Close', houses: 7, flats: 28, range: 'Houses 87 - 93' },
              { lane: 'Lane 8', name: 'Unity Heights', houses: 7, flats: 28, range: 'Houses 94 - 100' }
            ].map((item, idx) => (
              <div
                key={idx}
                className="interactive-lane-card"
                style={{
                  backgroundColor: 'rgba(15, 35, 22, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  transition: 'all 0.25s',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase' }}>{item.lane}</span>
                  <span style={{ fontSize: '0.7rem', backgroundColor: 'rgba(34,197,94,0.15)', color: '#4ade80', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                    {item.flats} Flats
                  </span>
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.houses} Blocks (4 units ea)</span>
                  <span>{item.range}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. INTERACTIVE RENTAL YIELD & SERVICE LEVY CALCULATOR                     */}
      {/* ========================================================================= */}
      <section id="calculator" style={{ padding: 'clamp(4rem, 6vw, 7rem) clamp(1rem, 4vw, 2.5rem)', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: 'rgba(15, 35, 22, 0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '20px',
          padding: 'clamp(1.75rem, 4vw, 3.5rem)',
          boxShadow: '0 24px 50px rgba(0,0,0,0.5)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontWeight: 800, fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              <Calculator size={16} /> LIVE PROPTEX SIMULATOR
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, color: '#ffffff', marginTop: '0.4rem' }}>
              Rental Yield & Statutory Remittance Calculator
            </h2>
            <p style={{ color: '#cbd5e1', maxWidth: '620px', margin: '0.5rem auto 0', fontSize: '0.95rem' }}>
              Calculate expected annual gross rent, ₦10k monthly estate maintenance levies, and net net payout into military pension accounts.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            {/* Sliders Control */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>Annual Rent Per Flat:</label>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#4ade80' }}>₦{rentEstimate.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={1000000}
                  max={4000000}
                  step={50000}
                  value={rentEstimate}
                  onChange={(e) => setRentEstimate(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#22c55e', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b' }}>
                  <span>₦1.0M</span>
                  <span>₦2.5M</span>
                  <span>₦4.0M</span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>Annual Service Levy (₦10k/mo):</label>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fbbf24' }}>₦{levyEstimate.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={60000}
                  max={240000}
                  step={10000}
                  value={levyEstimate}
                  onChange={(e) => setLevyEstimate(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b' }}>
                  <span>₦60k (₦5k/mo)</span>
                  <span>₦120k (₦10k/mo)</span>
                  <span>₦240k (₦20k/mo)</span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>Number of Allocated Flats:</label>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38bdf8' }}>{flatsCount} {flatsCount === 1 ? 'Flat' : 'Flats'}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={4}
                  step={1}
                  value={flatsCount}
                  onChange={(e) => setFlatsCount(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b' }}>
                  <span>1 Unit (Standard)</span>
                  <span>2 Units</span>
                  <span>3 Units</span>
                  <span>4 Units (Full Block)</span>
                </div>
              </div>
            </div>

            {/* Computation Result Card */}
            <div style={{
              backgroundColor: '#07180e',
              border: '1px solid rgba(251, 191, 36, 0.4)',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 12px 30px rgba(0,0,0,0.6)'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                NET SIMULATION RESULTS
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#4ade80', marginBottom: '0.5rem' }}>
                ₦{netIncome.toLocaleString()}
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}> / Year Net</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                Equates to approx. <strong style={{ color: '#fef08a' }}>₦{monthlyRemittance.toLocaleString()}</strong> monthly take-home return.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Gross Rental Inflow:</span>
                  <span style={{ fontWeight: 800, color: '#ffffff' }}>₦{grossRent.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Statutory Estate Levies:</span>
                  <span style={{ fontWeight: 800, color: '#f87171' }}>- ₦{totalLevies.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Reconciliation Efficiency:</span>
                  <span style={{ fontWeight: 800, color: '#22c55e' }}>100% Automated</span>
                </div>
              </div>

              <button
                onClick={() => handleNav('login')}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)'
                }}
              >
                Apply for Housing Allocation &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. 18 NATIONWIDE PORTFOLIO SCHEMES                                        */}
      {/* ========================================================================= */}
      <section id="schemes" style={{ padding: 'clamp(3rem, 5vw, 5rem) clamp(1rem, 4vw, 2.5rem)', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ color: '#4ade80', fontWeight: 800, fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            EXPANDING MILITARY WELFARE REAL ESTATE
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#ffffff', marginTop: '0.35rem' }}>
            18 Nationwide Housing Schemes
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0.5rem auto 0', fontSize: '0.95rem' }}>
            Post-Housing Development Limited manages strategic high-security residential enclaves across Nigeria.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {[
            { city: 'Abuja (FCT)', name: 'Unity Estate, Kurudu', tag: 'Flagship (400 Flats)', status: 'Operational' },
            { city: 'Lagos', name: 'Victoria Island & Ikeja Enclaves', tag: 'High-Density Officers Qtrs', status: 'Operational' },
            { city: 'Kaduna', name: 'Command Green Enclave', tag: 'Northern Command Qtrs', status: 'Operational' },
            { city: 'Port Harcourt', name: 'Rivers Delta Palms Enclave', tag: 'Joint Armed Housing', status: 'Operational' },
            { city: 'Enugu', name: 'Coal City Defense Quarters', tag: 'Eastern Sector Scheme', status: 'Operational' },
            { city: 'Ibadan', name: 'Oyo Garrison Heights', tag: 'Western Command Sector', status: 'Operational' }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'rgba(15, 35, 22, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fbbf24' }}>{item.city}</span>
                  <span style={{ fontSize: '0.68rem', backgroundColor: '#15803d', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>{item.status}</span>
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  {item.tag}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. BOTTOM CALL TO ACTION                                                  */}
      {/* ========================================================================= */}
      <section style={{
        padding: 'clamp(4rem, 6vw, 6rem) clamp(1rem, 4vw, 2.5rem)',
        background: 'linear-gradient(180deg, #07120a 0%, #0d2818 50%, #05140b 100%)',
        textAlign: 'center',
        borderTop: '1px solid rgba(245, 158, 11, 0.2)'
      }}>
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            backgroundColor: '#15803d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 8px 24px rgba(21, 128, 61, 0.5)'
          }}>
            <Shield size={30} color="#fef08a" />
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: 900, color: '#ffffff', marginBottom: '1rem', lineHeight: 1.15 }}>
            Experience Next-Gen Armed Forces Residency.
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Whether you are an active duty soldier tracking your housing equity, a civilian resident paying monthly service charges, or an estate administrator managing sentry posts — the PHDL Platform is your central hub.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleNav('login')}
              style={{
                padding: '0.9rem 2.25rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
                border: '1px solid rgba(251, 191, 36, 0.5)',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(22, 163, 74, 0.45)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              Launch Resident Portal Now <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. FOOTER                                                                */}
      {/* ========================================================================= */}
      <footer style={{
        backgroundColor: '#030c06',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '3rem clamp(1rem, 4vw, 2.5rem) 2rem',
        fontSize: '0.85rem',
        color: '#94a3b8'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#ffffff', marginBottom: '0.5rem' }}>
              PHDL <span style={{ color: '#f59e0b' }}>ESTATES</span>
            </div>
            <p style={{ lineHeight: 1.5, fontSize: '0.82rem', color: '#94a3b8' }}>
              Post-Housing Development Limited (PHDL) — Transforming Nigerian Armed Forces welfare through sustainable, modern housing infrastructure.
            </p>
          </div>

          <div>
            <div style={{ fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Estate Portals</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <li><button onClick={() => handleNav('login')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>SuperAdmin HQ Console</button></li>
              <li><button onClick={() => handleNav('login')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>Soldier Landlord Dashboard</button></li>
              <li><button onClick={() => handleNav('login')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>Resident Tenant App</button></li>
              <li><button onClick={() => handleNav('login')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>Sentry & Gate Pass Access</button></li>
            </ul>
          </div>

          <div>
            <div style={{ fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Unity Estate Operations</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <li><span>📍 Kurudu, Abuja (FCT), Nigeria</span></li>
              <li><span>🏢 400 Residential Flats (100 Houses)</span></li>
              <li><span>🛣️ 8 Zoned Lanes (Lanes 1 to 8)</span></li>
              <li><span>⚡ Central Water & Diesel Generators</span></li>
            </ul>
          </div>

          <div>
            <div style={{ fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Emergency Contacts</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <li><span>🚨 Gate Sentinel: +234 800 000 PHDL</span></li>
              <li><span>🔧 Maintenance Desk: 24/7 In-App</span></li>
              <li><span>✉️ inquiries@phdl-estates.gov.ng</span></li>
            </ul>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.78rem' }}>
          <div>
            &copy; {new Date().getFullYear()} Post-Housing Development Limited (PHDL). All Rights Reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <button onClick={() => handleNav('privacy')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>Privacy Policy</button>
            <button onClick={() => handleNav('terms')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>Terms of Residency</button>
            <button onClick={() => handleNav('security-protocols')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>Security Protocols</button>
          </div>
        </div>
      </footer>

    </div>
  );
};