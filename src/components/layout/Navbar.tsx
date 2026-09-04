import React, { useState } from 'react';
import { usePhdlStore, NATIONWIDE_18_ESTATES } from '../../data/storage';
import { Role } from '../../types';
import { PhdlLogo } from '../common/PhdlLogo';
import {
  Menu,
  X,
  Building,
  Shield,
  User,
  ChevronDown,
  LogOut,
  Sparkles,
  QrCode,
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  currentRole: Role;
  onSwitchRole: (role: Role) => void;
  onLogout: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  currentRole,
  onSwitchRole,
  onLogout,
  isSidebarOpen = false,
}) => {
  const store = usePhdlStore();
  const activeEstateId = store.getActiveEstateId();
  const currentEstate = store.getEstateById(activeEstateId);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const getRoleLabel = (r: Role) => {
    if (r === 'phdl_admin') return 'SuperAdmin HQ';
    if (r === 'soldier') return 'Soldier Landlord';
    return 'Resident Tenant';
  };

  const getRoleBadgeStyle = (r: Role) => {
    if (r === 'phdl_admin') return { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' };
    if (r === 'soldier') return { bg: '#FEFCE8', text: '#92400E', border: '#FDE68A' };
    return { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' };
  };

  const badge = getRoleBadgeStyle(currentRole);

  return (
    <header
      className="navbar"
      style={{
        height: '64px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
        zIndex: 50,
        flexShrink: 0,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {/* Left: Hamburger & Mobile Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={onToggleSidebar}
          className="btn btn-outline btn-sm"
          style={{
            padding: '0.45rem',
            borderRadius: 6,
            borderColor: '#CBD5E1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Toggle Navigation Menu"
        >
          {isSidebarOpen ? <X size={20} color="#071A0B" /> : <Menu size={20} color="#071A0B" />}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PhdlLogo size={32} />
          <div className="navbar-estate-title">
            <div style={{ fontWeight: 900, fontSize: '0.85rem', color: '#071A0B', lineHeight: 1.2 }}>
              PHDL ESTATE MANAGER
            </div>
            <div style={{ fontSize: '0.68rem', color: '#D97706', fontWeight: 800 }}>
              {currentEstate?.name || 'Unity Estate (Kurudu)'}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Estate Selector & Role Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {/* Estate Picker Dropdown */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <select
            value={activeEstateId}
            onChange={(e) => {
              store.setActiveEstateId(e.target.value);
              window.location.reload();
            }}
            className="form-select"
            style={{
              padding: '0.35rem 0.6rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: '#F8FAFC',
              borderColor: '#CBD5E1',
              maxWidth: 180,
            }}
          >
            {NATIONWIDE_18_ESTATES.map((est) => (
              <option key={est.id} value={est.id}>
                {est.name}
              </option>
            ))}
          </select>
        </div>

        {/* Role Switcher Button */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.65rem',
              borderRadius: 20,
              border: `1px solid ${badge.border}`,
              backgroundColor: badge.bg,
              color: badge.text,
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            <span>{getRoleLabel(currentRole)}</span>
            <ChevronDown size={13} />
          </button>

          {showRoleMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '110%',
                width: 200,
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                border: '1px solid #E2E8F0',
                padding: '0.4rem',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
              }}
            >
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748B', padding: '0.3rem 0.5rem', textTransform: 'uppercase' }}>
                Switch Active Role:
              </div>

              {[
                { r: 'phdl_admin' as Role, label: '🏛️ SuperAdmin HQ' },
                { r: 'soldier' as Role, label: '🪖 Soldier Landlord' },
                { r: 'tenant' as Role, label: '🏠 Resident Tenant' },
              ].map((item) => (
                <button
                  key={item.r}
                  type="button"
                  onClick={() => {
                    onSwitchRole(item.r);
                    setShowRoleMenu(false);
                  }}
                  style={{
                    padding: '0.5rem 0.6rem',
                    textAlign: 'left',
                    borderRadius: 6,
                    border: 'none',
                    backgroundColor: currentRole === item.r ? '#F0FDF4' : 'transparent',
                    color: currentRole === item.r ? '#15803D' : '#1E293B',
                    fontWeight: currentRole === item.r ? 800 : 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  {item.label}
                </button>
              ))}

              <div style={{ borderTop: '1px solid #E2E8F0', marginTop: '0.3rem', paddingTop: '0.3rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowRoleMenu(false);
                    onLogout();
                  }}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.6rem',
                    textAlign: 'left',
                    borderRadius: 6,
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#EF4444',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer',
                  }}
                >
                  <LogOut size={13} /> Sign Out to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;