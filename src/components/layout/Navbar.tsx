import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { Role } from '../../types';
import { PhdlLogo } from '../common/PhdlLogo';
import {
  Menu,
  Shield,
  ChevronDown,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { TenantOnboardingWizard } from '../onboarding/TenantOnboardingWizard';

export interface NavbarProps {
  onToggleSidebar?: () => void;
  currentRole?: Role;
  onSwitchRole?: (role: Role) => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, currentRole, onSwitchRole, onLogout }) => {
  const store = usePhdlStore();
  const effectiveRole = currentRole || store.getActiveRole();
  const currentEstateId = store.getActiveEstateId();
  const currentEstate = store.getEstateById(currentEstateId);

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);

  const handleSwitchRole = (role: Role) => {
    if (onSwitchRole) {
      onSwitchRole(role);
    } else {
      store.setActiveRole(role);
    }
    setShowRoleDropdown(false);
  };

  const getRoleBadgeLabel = (role: Role) => {
    switch (role) {
      case 'phdl_admin':
        return 'SuperAdmin HQ';
      case 'soldier':
        return 'Soldier Landlord';
      case 'tenant':
        return 'Civilian Resident';
      default:
        return 'User';
    }
  };

  const getRoleShortLabel = (role: Role) => {
    switch (role) {
      case 'phdl_admin':
        return 'HQ Admin';
      case 'soldier':
        return 'Landlord';
      case 'tenant':
        return 'Resident';
      default:
        return 'User';
    }
  };

  return (
    <header
      className="navbar"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.65rem clamp(0.75rem, 2vw, 1.5rem)',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-light, #E2E8F0)',
        minHeight: '60px',
        width: '100%',
        boxSizing: 'border-box',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Brand Title & Mobile Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="navbar-mobile-toggle"
            aria-label="Open Navigation Menu"
            style={{
              padding: '0.4rem',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle, #CBD5E1)',
              backgroundColor: '#F8FAFC',
              color: 'var(--army-green-950, #0B2410)',
              cursor: 'pointer',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Menu size={20} />
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', minWidth: 0 }}>
          <PhdlLogo size={34} />
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <div
              style={{
                fontWeight: 900,
                fontSize: 'clamp(0.88rem, 2vw, 1.05rem)',
                color: 'var(--army-green-950, #0B2410)',
                lineHeight: 1.15,
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              PHDL Estates
            </div>
            <div
              className="navbar-subtitle"
              style={{
                fontSize: '0.68rem',
                color: 'var(--text-subtle, #64748B)',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              RC 676563 • {currentEstate?.name || 'Unity Estate'}
            </div>
          </div>
        </div>
      </div>

      {/* Role Persona Switcher & Sign Out */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="btn btn-outline btn-sm role-switcher-btn"
            style={{
              gap: '0.35rem',
              borderColor: 'var(--army-green-800, #1B4D21)',
              fontWeight: 700,
              backgroundColor: '#FFFFFF',
              color: 'var(--army-green-950, #0B2410)',
              padding: '0.4rem 0.65rem',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Shield size={14} color="var(--army-green-800, #1B4D21)" />
            <span className="role-btn-full-text">
              Role: {getRoleBadgeLabel(effectiveRole)}
            </span>
            <span className="role-btn-short-text">
              {getRoleShortLabel(effectiveRole)}
            </span>
            <ChevronDown size={14} />
          </button>

          {showRoleDropdown && (
            <div
              className="card dropdown-menu"
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.4rem',
                width: 'max-content',
                minWidth: '240px',
                maxWidth: 'calc(100vw - 1.5rem)',
                zIndex: 1000,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                padding: '0.5rem',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
              }}
            >
              <div
                style={{
                  padding: '0.35rem 0.5rem',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: '#64748B',
                }}
              >
                SWITCH USER PERSONA
              </div>
              <button
                onClick={() => handleSwitchRole('phdl_admin')}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  background: effectiveRole === 'phdl_admin' ? '#F1F5F9' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'block',
                }}
              >
                <strong style={{ fontSize: '0.82rem', color: '#0B2410' }}>
                  Col. Farouk Danjuma (Rtd.)
                </strong>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                  PHDL SuperAdmin HQ
                </div>
              </button>
              <button
                onClick={() => handleSwitchRole('soldier')}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  background: effectiveRole === 'soldier' ? '#F1F5F9' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'block',
                }}
              >
                <strong style={{ fontSize: '0.82rem', color: '#0B2410' }}>
                  Staff Sgt. Adamu Mohammed
                </strong>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                  Soldier Owner (Flat L1H1A)
                </div>
              </button>
              <button
                onClick={() => handleSwitchRole('tenant')}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  background: effectiveRole === 'tenant' ? '#F1F5F9' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'block',
                }}
              >
                <strong style={{ fontSize: '0.82rem', color: '#0B2410' }}>
                  Emeka Gabriel Okon
                </strong>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                  Tenant Resident (Flat L1H1A)
                </div>
              </button>

              <hr style={{ margin: '0.4rem 0', borderColor: '#E2E8F0' }} />

              <button
                onClick={() => {
                  setShowRoleDropdown(false);
                  setShowOnboardingWizard(true);
                }}
                className="btn btn-primary btn-sm"
                style={{
                  width: '100%',
                  gap: '0.4rem',
                  backgroundColor: '#1B4D21',
                  color: '#FFFFFF',
                  padding: '0.5rem',
                  fontSize: '0.78rem',
                }}
              >
                <Sparkles size={14} />
                Start Tenant Onboarding Flow
              </button>
            </div>
          )}
        </div>

        {/* Prominent Red Sign Out Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="btn btn-sm signout-btn"
            style={{
              gap: '0.35rem',
              backgroundColor: '#FEF2F2',
              borderColor: '#FCA5A5',
              color: '#991B1B',
              fontWeight: 800,
              cursor: 'pointer',
              padding: '0.4rem 0.65rem',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Sign Out to Public Landing Page"
          >
            <LogOut size={14} />
            <span className="signout-text">Sign Out</span>
          </button>
        )}
      </div>

      {showOnboardingWizard && (
        <TenantOnboardingWizard onClose={() => setShowOnboardingWizard(false)} />
      )}
    </header>
  );
};
