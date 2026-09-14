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
  DollarSign,
  UserCheck,
  UserPlus,
  LogIn,
  ArrowLeft
} from 'lucide-react';

export const LandingPage: React.FC<any> = (props) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'landlords' | 'tenants' | 'security' | 'finance'>('landlords');
  
  // Interactive Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'selector' | 'form' | 'eoi'>('selector');
  const [selectedRole, setSelectedRole] = useState<'soldier' | 'tenant' | 'admin' | 'security'>('soldier');

  // Form Inputs
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('••••••••');
  const [authSuccess, setAuthSuccess] = useState(false);

  // EOI Form State
  const [fullName, setFullName] = useState('');
  const [serviceNumber, setServiceNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [eoiSubmitted, setEoiSubmitted] = useState(false);

  // Interactive Calculator State
  const [rentEstimate, setRentEstimate] = useState<number>(1800000);
  const [levyEstimate, setLevyEstimate] = useState<number>(120000);
  const [flatsCount, setFlatsCount] = useState<number>(1);

  const grossRent = rentEstimate * flatsCount;
  const totalLevies = levyEstimate * flatsCount;
  const netIncome = grossRent - totalLevies;
  const monthlyRemittance = Math.round(netIncome / 12);

  // Safe Universal Login Execution
  const triggerLogin = (role: 'soldier' | 'tenant' | 'admin' | 'security') => {
    setAuthSuccess(true);

    const userPayload = {
      role: role,
      name: role === 'soldier' ? 'Major Ibrahim Danjuma' :
            role === 'tenant' ? 'Dr. Emeka Okafor' :
            role === 'security' ? 'Sentry Commander S. Okon' : 'Col. M. Bello (HQ Director)',
      serviceNo: role === 'soldier' ? 'N/12849' : 'PHDL/CIV/092',
      flat: 'House 14, Flat B (Lane 3)',
      lane: 'Lane 3 (Command Avenue)',
      isLoggedIn: true
    };

    // Store in localStorage
    try {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('phdl_role', role);
      localStorage.setItem('userRole', role);
      localStorage.setItem('phdl_user', JSON.stringify(userPayload));
    } catch (err) {
      console.error(err);
    }

    // Safely execute whichever callback props App.tsx provided
    setTimeout(() => {
      setAuthModalOpen(false);
      setAuthSuccess(false);

      if (typeof props.onLogin === 'function') {
        props.onLogin(role, userPayload);
      }
      if (typeof props.onSelectRole === 'function') {
        props.onSelectRole(role);
      }
      if (typeof props.onNavigate === 'function') {
        props.onNavigate(role, role);
        props.onNavigate('dashboard', role);
      }
      if (typeof props.onLoginClick === 'function') {
        props.onLoginClick(role);
      }
      if (typeof props.setCurrentRole === 'function') {
        props.setCurrentRole(role);
      }
      if (typeof props.setCurrentPage === 'function') {
        props.setCurrentPage(role);
      }
      if (typeof props.setCurrentView === 'function') {
        props.setCurrentView(role);
      }
      if (typeof props.setUser === 'function') {
        props.setUser(userPayload);
      }
      if (typeof props.setIsLoggedIn === 'function') {
        props.setIsLoggedIn(true);
      }
      if (typeof props.setIsAuthenticated === 'function') {
        props.setIsAuthenticated(true);
      }

      // Sync window hash for hash routers
      window.location.hash = `#${role}`;
    }, 200);
  };

  const handleOpenAuth = (role?: 'soldier' | 'tenant' | 'admin' | 'security', mode: 'selector' | 'form' | 'eoi' = 'selector') => {
    if (role) {
      setSelectedRole(role);
      setLoginId(
        role === 'soldier' ? 'N/12849' :
        role === 'tenant' ? 'LAN-4-H50-FLAT-B' :
        role === 'security' ? 'SENTRY-ALPHA-01' : 'HQ-DIRECTOR-BELLO'
      );
      setModalMode(mode === 'selector' ? 'form' : mode);
    } else {
      setModalMode(mode);
    }
    setAuthModalOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#07120a', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', overflowX: 'hidden' }}>
      
      {/* 1. TOP ANNOUNCEMENT TICKER */}
      <div style={{ backgroundColor: '#0f291e', borderBottom: '1px solid rgba(245, 158, 11, 0.2)', padding: '0.45rem 1rem', fontSize: '0.78rem', color: '#fef3c7', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', textAlign: 'center', flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#15803d', color: '#fff', padding: '0.1rem 0.5rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.04em' }}>
          <Zap size={11} /> LIVE OPS
        </span>
        <span>
          <strong>PHDL Unity Estate (Kurudu, Abuja):</strong> 400 Residential Flats (100 Houses) across 8 Zoned Lanes operational.
        </span>
        <button
          type="button"
          onClick={() => handleOpenAuth(undefined, 'selector')}
          style={{ background: 'none', border: 'none', color: '#fbbf24', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', padding: 0, font: 'inherit' }}
        >
          Staff & Resident Login &rarr;
        </button>
      </div>

      {/* 2. STICKY NAVBAR */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => handleOpenAuth(undefined, 'selector')}>
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

        {/* Desktop Nav */}
        <div className="landing-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <a href="#features" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600 }}>Features</a>
          <a href="#lanes" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600 }}>400 Flats Layout</a>
          <a href="#calculator" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600 }}>Yield Calculator</a>
          <a href="#schemes" style={{ color: '#cbd5e1', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600 }}>18 Nationwide Schemes</a>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleOpenAuth(undefined, 'selector')}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => handleOpenAuth('soldier', 'eoi')}
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
                gap: '0.4rem'
              }}
            >
              Apply (EOI) <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
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
          <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: 600 }}>Platform Features</a>
          <a href="#lanes" onClick={() => setMobileMenuOpen(false)} style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: 600 }}>400 Flats Layout</a>
          <a href="#calculator" onClick={() => setMobileMenuOpen(false)} style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: 600 }}>Rental Yield Calculator</a>
          <a href="#schemes" onClick={() => setMobileMenuOpen(false)} style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: 600 }}>18 Nationwide Schemes</a>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); handleOpenAuth(undefined, 'selector'); }}
              style={{ textAlign: 'center', padding: '0.7rem', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer' }}
            >
              Sign In to Dashboard
            </button>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); handleOpenAuth('soldier', 'eoi'); }}
              style={{ textAlign: 'center', padding: '0.7rem', borderRadius: '8px', backgroundColor: '#15803d', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer' }}
            >
              Apply for Housing (EOI)
            </button>
          </div>
        </div>
      )}

      {/* 3. HERO SECTION */}
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
        
        {/* Floating Glider 1 */}
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
          zIndex: 10,
          cursor: 'pointer'
        }} onClick={() => triggerLogin('tenant')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e', boxShadow: '0 0 10px #22c55e', animation: 'pulseRadar 2s infinite' }} />
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#86efac', textTransform: 'uppercase' }}>
              Autopay Settlement
            </div>
          </div>
          <div style={{ marginTop: '0.35rem', fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>
            ₦10,000 Service Charge
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            Lane 4 (Victory Cres) • Click to Enter
          </div>
        </div>

        {/* Floating Glider 2 */}
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
          zIndex: 10,
          cursor: 'pointer'
        }} onClick={() => triggerLogin('security')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={16} color="#fbbf24" />
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fde047', textTransform: 'uppercase' }}>
              Sentinel Access Guard
            </div>
          </div>
          <div style={{ marginTop: '0.35rem', fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>
            372 Active RFID Gate Passes
          </div>
          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            Click to Open Security Console
          </div>
        </div>

        {/* Hero Center */}
        <div style={{ position: 'relative', zIndex: 5, maxWidth: '920px', textAlign: 'center', margin: '0 auto' }}>
          
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
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={15} color="#f59e0b" />
            <span>POST-HOUSING DEVELOPMENT LIMITED • RESIDENCY COMMAND</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5.5vw, 3.85rem)',
            fontWeight: 900,
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            marginBottom: '1.25rem'
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

          <p style={{
            fontSize: 'clamp(0.98rem, 2vw, 1.2rem)',
            color: '#cbd5e1',
            lineHeight: 1.6,
            maxWidth: '760px',
            margin: '0 auto 2.25rem'
          }}>
            The premier PropTech ecosystem engineered for <strong>400 Residential Flats (100 Houses across 8 Zoned Lanes)</strong> at Unity Estate, Kurudu. Oversee soldier equity allocations, automated ₦10,000 monthly service levies, smart RFID gate passes, and military pension sync.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <button
              type="button"
              onClick={() => triggerLogin('soldier')}
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
                gap: '0.5rem'
              }}
            >
              Enter Soldier Portal <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={() => triggerLogin('tenant')}
              style={{
                padding: '0.9rem 1.75rem',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#f8fafc',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Home size={18} color="#38bdf8" /> Enter Resident App
            </button>

            <a
              href="#calculator"
              style={{
                padding: '0.9rem 1.5rem',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#fbbf24',
                fontSize: '0.95rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              <Calculator size={16} /> Yield Calculator
            </a>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            backgroundColor: 'rgba(15, 35, 22, 0.7)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '14px',
            padding: '1.25rem 1.5rem'
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

      {/* 4. MARQUEE TICKER */}
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
            <span style={{ color: '#38bdf8' }}>💧</span> <strong>WATER FILTRATION RESERVE:</strong> 40,000 Litres
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.84rem', color: '#4ade80' }}>
            <span style={{ color: '#4ade80' }}>💰</span> <strong>SERVICE CHARGE COLLECTION:</strong> 98.4% (₦3.94M / ₦4.0M)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.84rem', color: '#eab308' }}>
            <span style={{ color: '#eab308' }}>🎖️</span> <strong>STATUTORY ALLOCATIONS:</strong> 400 / 400 Flats Assigned
          </span>
        </div>
      </div>

      {/* 5. 4-PILLAR FEATURES */}
      <section id="features" style={{ padding: 'clamp(4rem, 6vw, 7rem) clamp(1rem, 4vw, 2.5rem)', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ color: '#4ade80', fontWeight: 800, fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            ENGINEERED FOR MILITARY & RESIDENTIAL PRECISION
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 900, color: '#ffffff' }}>
            Complete Lifecycle PropTech Platform
          </h2>
        </div>

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
                type="button"
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
                  cursor: 'pointer'
                }}
              >
                <Icon size={16} color={isActive ? '#fef08a' : '#94a3b8'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div style={{
          backgroundColor: 'rgba(15, 35, 22, 0.5)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '18px',
          padding: 'clamp(1.5rem, 4vw, 3rem)'
        }}>
          {activeTab === 'landlords' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#fbbf24', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem' }}>OFFICER & SOLDIER HUB</div>
                <h3 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', marginBottom: '1rem' }}>
                  Guaranteed Statutory Equity & Remittance Tracking
                </h3>
                <p style={{ color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Enforces the strict 1-apartment statutory limit per active/retired military personnel. Monitor rent payments, tenant leases, and automated military pension deductions directly from your smartphone.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => triggerLogin('soldier')}
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', backgroundColor: '#15803d', color: '#ffffff', fontWeight: 800, border: 'none', cursor: 'pointer' }}
                  >
                    Enter Soldier Landlord Portal &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tenants' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem' }}>RESIDENT EXPERIENCE</div>
                <h3 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', marginBottom: '1rem' }}>
                  Frictionless Living, Metering & Instant Maintenance
                </h3>
                <p style={{ color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Enjoy automated monthly service charge payments (₦10,000/flat), digital electricity recharge tokens, gate passes for visitors, and 24/7 direct communication with estate management.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => triggerLogin('tenant')}
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', backgroundColor: '#0284c7', color: '#ffffff', fontWeight: 800, border: 'none', cursor: 'pointer' }}
                  >
                    Enter Resident App &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <div style={{ color: '#f43f5e', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem' }}>MILITARY-GRADE DEFENSE</div>
              <h3 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', marginBottom: '1rem' }}>
                Perimeter Sentinel & Smart RFID Gate Barriers
              </h3>
              <button
                type="button"
                onClick={() => triggerLogin('security')}
                style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', backgroundColor: '#be123c', color: '#ffffff', fontWeight: 800, border: 'none', cursor: 'pointer' }}
              >
                Launch Security Console &rarr;
              </button>
            </div>
          )}

          {activeTab === 'finance' && (
            <div>
              <div style={{ color: '#eab308', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem' }}>FINANCIAL AUDIT TRAIL</div>
              <h3 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', marginBottom: '1rem' }}>
                ₦4.0M Monthly Levies & Automated Reconciliation
              </h3>
              <button
                type="button"
                onClick={() => triggerLogin('admin')}
                style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', backgroundColor: '#ca8a04', color: '#ffffff', fontWeight: 800, border: 'none', cursor: 'pointer' }}
              >
                Open HQ Admin Console &rarr;
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 6. 400 FLATS BREAKDOWN */}
      <section id="lanes" style={{ padding: 'clamp(4rem, 6vw, 6rem) clamp(1rem, 4vw, 2.5rem)', backgroundColor: '#05140b' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ color: '#fbbf24', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              UNITY ESTATE MASTER ARCHITECTURE (KURUDU, ABUJA)
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', fontWeight: 900, color: '#ffffff' }}>
              400 Flats • 100 Houses across 8 Zoned Lanes
            </h2>
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
                onClick={() => triggerLogin('soldier')}
                style={{
                  backgroundColor: 'rgba(15, 35, 22, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fbbf24' }}>{item.lane}</span>
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

      {/* 7. FOOTER */}
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
              Post-Housing Development Limited (PHDL) — Transforming Nigerian Armed Forces welfare through sustainable housing infrastructure.
            </p>
          </div>

          <div>
            <div style={{ fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>Estate Portals</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <li><button type="button" onClick={() => triggerLogin('admin')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>SuperAdmin HQ Console</button></li>
              <li><button type="button" onClick={() => triggerLogin('soldier')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>Soldier Landlord Dashboard</button></li>
              <li><button type="button" onClick={() => triggerLogin('tenant')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>Resident Tenant App</button></li>
              <li><button type="button" onClick={() => triggerLogin('security')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>Sentry & Gate Pass Access</button></li>
            </ul>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.78rem' }}>
          <div>
            &copy; {new Date().getFullYear()} Post-Housing Development Limited (PHDL). All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* 8. AUTH MODAL WITH 1-CLICK DEMO LOGIN */}
      {authModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(3, 12, 6, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#0a1d12',
            border: '1px solid rgba(245, 158, 11, 0.45)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '520px',
            padding: 'clamp(1.5rem, 4vw, 2.25rem)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
            position: 'relative'
          }}>
            <button
              type="button"
              onClick={() => { setAuthModalOpen(false); setAuthSuccess(false); }}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                color: '#cbd5e1',
                padding: '0.4rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            {modalMode === 'form' && (
              <button
                type="button"
                onClick={() => setModalMode('selector')}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  left: '1.25rem',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}

            <div style={{ textAlign: 'center', marginBottom: '1.5rem', marginTop: modalMode === 'form' ? '0.75rem' : 0 }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: selectedRole === 'soldier' ? 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)' :
                            selectedRole === 'tenant' ? 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)' :
                            selectedRole === 'security' ? 'linear-gradient(135deg, #be123c 0%, #f43f5e 100%)' :
                            'linear-gradient(135deg, #ca8a04 0%, #fbbf24 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
                boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                {selectedRole === 'soldier' ? <Award size={24} color="#fff" /> :
                 selectedRole === 'tenant' ? <Home size={24} color="#fff" /> :
                 selectedRole === 'security' ? <Shield size={24} color="#fff" /> :
                 <Building2 size={24} color="#000" />}
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.25rem' }}>
                {modalMode === 'form' ? (
                   selectedRole === 'soldier' ? 'Soldier Landlord Login' :
                   selectedRole === 'tenant' ? 'Resident Tenant Login' :
                   selectedRole === 'security' ? 'Sentry Command Login' : 'SuperAdmin HQ Login'
                 ) :
                 'Access Estate Command Portal'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Unity Estate Residency & Property Management Hub
              </p>
            </div>

            {modalMode === 'selector' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Select your portal access level:</div>
                
                {[
                  { role: 'soldier', title: 'Soldier Landlord Portal', desc: 'Manage statutory equity, leases & pensions', icon: Award, color: '#22c55e' },
                  { role: 'tenant', title: 'Resident Tenant App', desc: 'Pay ₦10k levies, electricity & gate passes', icon: Home, color: '#38bdf8' },
                  { role: 'security', title: 'Sentry & Gate Pass Console', desc: 'RFID vehicle check & visitor clearance', icon: Shield, color: '#f43f5e' },
                  { role: 'admin', title: 'SuperAdmin HQ Console', desc: 'Estate master telemetry & financial ledger', icon: Building2, color: '#fbbf24' }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      type="button"
                      key={item.role}
                      onClick={() => triggerLogin(item.role as any)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.9rem 1.15rem',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{ padding: '0.55rem', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.4)', color: item.color }}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.92rem' }}>{item.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.desc}</div>
                        </div>
                      </div>
                      <ChevronRight size={18} color="#fbbf24" />
                    </button>
                  );
                })}
              </div>
            )}

            {modalMode === 'form' && (
              <div>
                {authSuccess ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(34, 197, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: '#22c55e' }}>
                      <CheckCircle2 size={32} />
                    </div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
                      Authenticated!
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      Launching Dashboard...
                    </p>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); triggerLogin(selectedRole); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => triggerLogin(selectedRole)}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, rgba(21, 128, 61, 0.4) 0%, rgba(245, 158, 11, 0.25) 100%)',
                        border: '1px solid rgba(251, 191, 36, 0.5)',
                        color: '#fef08a',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Zap size={16} color="#fbbf24" />
                      <span>
                        ⚡ 1-Click Quick Demo Sign In
                      </span>
                    </button>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '0.35rem' }}>
                        ID / Number:
                      </label>
                      <input
                        type="text"
                        required
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.88rem', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '0.35rem' }}>
                        Password:
                      </label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.88rem', boxSizing: 'border-box' }}
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        marginTop: '0.5rem',
                        padding: '0.85rem',
                        borderRadius: '8px',
                        background: selectedRole === 'soldier' ? 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)' :
                                    selectedRole === 'tenant' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' :
                                    selectedRole === 'security' ? 'linear-gradient(135deg, #be123c 0%, #9f1239 100%)' :
                                    'linear-gradient(135deg, #ca8a04 0%, #a16207 100%)',
                        color: '#ffffff',
                        fontWeight: 800,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.92rem'
                      }}
                    >
                      Sign In &rarr;
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};