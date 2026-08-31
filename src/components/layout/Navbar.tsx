import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { Role } from '../../types';
import { PhdlLogo } from '../common/PhdlLogo';
import {
  Menu,
  Shield,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { TenantOnboardingWizard } from '../onboarding/TenantOnboardingWizard';

export interface NavbarProps {
  onToggleSidebar?: () => void;
  currentRole?: Role;
  onSwitchRole?: (role: Role) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, currentRole, onSwitchRole }) => {
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

  return (
    <header
      className="navbar"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-light, #E2E8F0)',
        minHeight: '64px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Brand Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="btn btn-ghost btn-sm mobile-toggle"
            style={{ display: 'none' }}
          >
            <Menu size={20} />
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <PhdlLogo size={36} />
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: '0.88rem',
                color: 'var(--army-green-950, #0B2410)',
                lineHeight: 1.2,
              }}
            >
              POST-SERVICE HOUSING DEVELOPMENT LIMITED
            </div>
            <div
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-subtle, #64748B)',
                fontWeight: 600,
              }}
            >
              FEDERAL REPUBLIC OF NIGERIA • RC 676563
            </div>
          </div>
        </div>
      </div>

      {/* Role Persona Switcher & Onboarding Trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="btn btn-outline btn-sm"
            style={{
              gap: '0.4rem',
              borderColor: 'var(--army-green-800, #1B4D21)',
              fontWeight: 700,
              backgroundColor: '#FFFFFF',
              color: 'var(--army-green-950, #0B2410)',
            }}
          >
            <Shield size={14} color="var(--army-green-800, #1B4D21)" />
            <span>
              Role:{' '}
              {effectiveRole === 'phdl_admin'
                ? 'SuperAdmin HQ'
                : effectiveRole === 'soldier'
                  ? 'Soldier Landlord'
                  : 'Civilian Resident'}
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
                minWidth: '260px',
                zIndex: 1000,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                padding: '0.5rem',
                backgroundColor: '#FFFFFF',
                borderRadius: '6px',
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
                  background: currentRole === 'phdl_admin' ? '#F1F5F9' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'block',
                }}
              >
                <strong style={{ fontSize: '0.85rem', color: '#0B2410' }}>
                  Col. Farouk Danjuma (Rtd.)
                </strong>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
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
                  background: currentRole === 'soldier' ? '#F1F5F9' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'block',
                }}
              >
                <strong style={{ fontSize: '0.85rem', color: '#0B2410' }}>
                  Staff Sgt. Adamu Mohammed
                </strong>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
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
                  background: currentRole === 'tenant' ? '#F1F5F9' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'block',
                }}
              >
                <strong style={{ fontSize: '0.85rem', color: '#0B2410' }}>
                  Emeka Gabriel Okon
                </strong>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
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
                }}
              >
                <Sparkles size={14} />
                Start Tenant Onboarding Flow
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Non-Dismissable 2-Step Onboarding Wizard Modal */}
      {showOnboardingWizard && (
        <TenantOnboardingWizard onComplete={() => setShowOnboardingWizard(false)} />
      )}
    </header>
  );
};

export default Navbar;