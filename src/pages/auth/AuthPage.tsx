import React, { useState } from 'react';
import { usePhdlStore, EstateFlat } from '../../data/storage';
import { PhdlLogo } from '../../components/common/PhdlLogo';
import { Role } from '../../types';
import {
  Shield,
  User,
  Lock,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  KeyRound,
  UserCheck,
  Building2,
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
  const store = usePhdlStore();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);
  
  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regServiceNo, setRegServiceNo] = useState('');
  const [regRank, setRegRank] = useState('Staff Sergeant');
  const [regPassword, setRegPassword] = useState('');
  const [regFlatCode, setRegFlatCode] = useState('L1H1A');

  const flats: EstateFlat[] = store.getFlats ? store.getFlats() : [];

  // Group flats by Lane (1 to 8)
  const lanes = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleQuickLogin = (role: Role) => {
    store.setActiveRole(role);
    onLoginSuccess(role);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.setActiveRole(selectedRole);
    onLoginSuccess(selectedRole);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.setActiveRole(selectedRole);
    onLoginSuccess(selectedRole);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#071A0B',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(27, 77, 33, 0.4) 0%, rgba(7, 26, 11, 0.95) 75%)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 520, margin: '0 auto' }}>
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-block', cursor: 'pointer' }} onClick={onBackToLanding}>
            <PhdlLogo size={64} />
          </div>
          <h2 style={{ color: '#FFFFFF', fontWeight: 900, fontSize: '1.4rem', marginTop: '0.75rem', letterSpacing: '0.02em' }}>
            POST-HOUSING DEVELOPMENT LIMITED
          </h2>
          <div style={{ fontSize: '0.75rem', color: '#FBBF24', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Armed Forces Housing Scheme • RC 676563
          </div>
        </div>

        {/* Auth Card */}
        <div
          className="card"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Quick 1-Click Role Login Bar */}
          <div style={{ padding: '1rem 1.25rem', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={13} color="var(--army-gold-600)" />
              1-Click Instant Test Portals:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('phdl_admin')}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.72rem', borderColor: '#15803D', color: '#15803D', fontWeight: 800 }}
              >
                🏛️ Admin HQ
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('soldier')}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.72rem', borderColor: '#D97706', color: '#B45309', fontWeight: 800 }}
              >
                🪖 Soldier
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('tenant')}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.72rem', borderColor: '#2563EB', color: '#1D4ED8', fontWeight: 800 }}
              >
                🏠 Tenant
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0' }}>
            <button
              type="button"
              onClick={() => setMode('login')}
              style={{
                flex: 1,
                padding: '0.85rem',
                border: 'none',
                backgroundColor: mode === 'login' ? '#FFFFFF' : '#F1F5F9',
                color: mode === 'login' ? '#1B4D21' : '#64748B',
                fontWeight: mode === 'login' ? 800 : 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                borderBottom: mode === 'login' ? '3px solid #1B4D21' : 'none',
              }}
            >
              Sign In to Account
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              style={{
                flex: 1,
                padding: '0.85rem',
                border: 'none',
                backgroundColor: mode === 'register' ? '#FFFFFF' : '#F1F5F9',
                color: mode === 'register' ? '#1B4D21' : '#64748B',
                fontWeight: mode === 'register' ? 800 : 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                borderBottom: mode === 'register' ? '3px solid #1B4D21' : 'none',
              }}
            >
              New Resident Registration
            </button>
          </div>

          <div style={{ padding: '1.5rem' }}>
            {/* Role Selection Tabs */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ marginBottom: '0.4rem', display: 'block' }}>
                Select User Portal:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                {[
                  { r: 'phdl_admin' as Role, label: 'SuperAdmin HQ' },
                  { r: 'soldier' as Role, label: 'Soldier Landlord' },
                  { r: 'tenant' as Role, label: 'Resident Tenant' },
                ].map((item) => (
                  <button
                    key={item.r}
                    type="button"
                    onClick={() => setSelectedRole(item.r)}
                    style={{
                      padding: '0.5rem 0.4rem',
                      borderRadius: 6,
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      border: selectedRole === item.r ? '2px solid #1B4D21' : '1px solid #CBD5E1',
                      backgroundColor: selectedRole === item.r ? '#F0FDF4' : '#FFFFFF',
                      color: selectedRole === item.r ? '#15803D' : '#334155',
                      cursor: 'pointer',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Email or Military Service ID:</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder={selectedRole === 'soldier' ? 'e.g. NN/8924/ARMY or s.adamu@phdl.gov.ng' : 'e.g. resident@phdl.gov.ng'}
                      className="form-control"
                      style={{ paddingLeft: '2.2rem' }}
                      required
                    />
                    <Mail size={16} color="#64748B" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Password:</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="form-control"
                      style={{ paddingLeft: '2.2rem' }}
                      required
                    />
                    <Lock size={16} color="#64748B" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ backgroundColor: '#1B4D21', padding: '0.65rem', fontWeight: 800, gap: '0.4rem', marginTop: '0.5rem' }}
                >
                  <KeyRound size={16} /> Access Portal as {selectedRole === 'phdl_admin' ? 'SuperAdmin' : selectedRole === 'soldier' ? 'Soldier' : 'Tenant'}
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Full Name *:</label>
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Engr. Emeka Okon"
                    className="form-control"
                    required
                  />
                </div>

                {selectedRole === 'soldier' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Rank:</label>
                      <select value={regRank} onChange={(e) => setRegRank(e.target.value)} className="form-select">
                        <option value="Captain">Captain</option>
                        <option value="Major">Major</option>
                        <option value="Staff Sergeant">Staff Sergeant</option>
                        <option value="Warrant Officer">Warrant Officer</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Service No *:</label>
                      <input
                        type="text"
                        value={regServiceNo}
                        onChange={(e) => setRegServiceNo(e.target.value)}
                        placeholder="e.g. NA/8924/ARMY"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Phone Number *:</label>
                    <input
                      type="text"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+234 803 000 0000"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Email Address *:</label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                {/* ========================================================= */}
                {/* 400 FLATS DROPDOWN LIST (ORGANIZED BY LANES 1 TO 8) */}
                {/* ========================================================= */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Building2 size={14} color="var(--army-green-800)" />
                    Assigned Flat Number * (100 Houses across 8 Lanes):
                  </label>
                  <select
                    value={regFlatCode}
                    onChange={(e) => setRegFlatCode(e.target.value)}
                    className="form-select"
                    required
                  >
                    {lanes.map((laneNum) => {
                      const laneFlats = flats.filter((f) => f.laneNumber === laneNum);
                      return (
                        <optgroup
                          key={laneNum}
                          label={`📍 Lane ${laneNum} (${laneFlats.length} Flats: L${laneNum}H1A to L${laneNum}H${laneFlats.length / 4}D)`}
                        >
                          {laneFlats.map((flat) => (
                            <option key={flat.id || flat.flatCode} value={flat.flatCode}>
                              Flat {flat.flatCode} — Lane {flat.laneNumber}, House {flat.houseNumber} (Flat {flat.flatPosition}) • {flat.apartmentType}
                            </option>
                          ))}
                        </optgroup>
                      );
                    })}
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Create Password *:</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a strong password..."
                    className="form-control"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ backgroundColor: '#15803D', padding: '0.65rem', fontWeight: 800, gap: '0.4rem', marginTop: '0.5rem' }}
                >
                  <UserCheck size={16} /> Complete Registration & Access Portal
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <button
            type="button"
            onClick={onBackToLanding}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.82rem',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            ← Back to Public Landing Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;