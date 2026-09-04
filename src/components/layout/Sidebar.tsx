import React from 'react';
import { usePhdlStore } from '../../data/storage';
import { PhdlLogo } from '../common/PhdlLogo';
import {
  LayoutDashboard,
  Building,
  Building2,
  Users,
  CreditCard,
  QrCode,
  Settings,
  Shield,
  FileText,
  UserPlus,
  UserCheck,
  Receipt,
  Megaphone,
  Wrench,
  LogOut,
  Sparkles,
  X,
} from 'lucide-react';

import { Role } from '../../types';

export type ActivePage =
  | 'admin_dashboard'
  | 'admin_allocations'
  | 'soldier_onboarding'
  | 'admin_tenants'
  | 'admin_admins'
  | 'admin_flats'
  | 'admin_hierarchy'
  | 'admin_billing'
  | 'billing_mgmt'
  | 'admin_id_cards'
  | 'notifications_scheduler'
  | 'maintenance'
  | 'admin_settings'
  | 'soldier_dashboard'
  | 'soldier_allocations'
  | 'soldier_properties'
  | 'soldier_tenants'
  | 'soldier_billing'
  | 'soldier_id_card'
  | 'soldier_settings'
  | 'tenant_dashboard'
  | 'tenant_profile'
  | 'tenant_billing'
  | 'tenant_dependents'
  | 'tenant_id_card'
  | 'tenant_settings'
  | (string & {});

export interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  currentRole?: Role;
  isOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  currentRole,
  isOpen = false,
  onClose,
  onLogout,
}) => {
  const store = usePhdlStore();
  const effectiveRole = currentRole || store.getActiveRole();
  const currentEstateId = store.getActiveEstateId();
  const estate = store.getEstateById(currentEstateId);

  const navItem = (page: ActivePage, label: string, icon: React.ReactNode) => {
    const isActive = activePage === page;
    return (
      <button
        key={page}
        type="button"
        onClick={() => {
          onNavigate(page);
          if (onClose) onClose();
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          width: '100%',
          padding: '0.65rem 0.85rem',
          borderRadius: '6px',
          border: 'none',
          backgroundColor: isActive ? 'var(--army-green-800, #1B4D21)' : 'transparent',
          color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.78)',
          fontWeight: isActive ? 700 : 500,
          fontSize: '0.85rem',
          textAlign: 'left',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          marginBottom: '0.2rem',
        }}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  const sectionHeader = (title: string) => (
    <div
      style={{
        fontSize: '0.68rem',
        fontWeight: 800,
        color: 'var(--army-gold-400, #FBBF24)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        padding: '0.85rem 0.5rem 0.35rem',
      }}
    >
      {title}
    </div>
  );

  return (
    <>
      {/* MOBILE BACKDROP OVERLAY */}
      {isOpen && (
        <div
          onClick={onClose}
          className="mobile-drawer-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(3px)',
            zIndex: 998,
          }}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside
        className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-desktop'}`}
        style={{
          width: '260px',
          minWidth: '260px',
          maxWidth: '260px',
          height: '100vh',
          backgroundColor: '#0A240F',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          zIndex: 999,
          position: isOpen ? 'fixed' : 'relative',
          top: 0,
          left: 0,
          transition: 'transform 0.25s ease',
        }}
      >
        {/* Header with Logo & Mobile Close Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            backgroundColor: '#071A0B',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <PhdlLogo size={36} />
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <div style={{ fontWeight: 900, fontSize: '0.9rem', color: '#FFFFFF' }}>PHDL HOUSING</div>
              <div style={{ fontSize: '0.66rem', color: '#FBBF24', fontWeight: 700 }}>RC 676563 • Unity Estate</div>
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline btn-sm"
              style={{ padding: '0.3rem', borderRadius: 4, borderColor: 'rgba(255,255,255,0.2)', color: '#FFF' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Scrollable Nav Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 0.65rem' }}>
          {effectiveRole === 'phdl_admin' && (
            <>
              {sectionHeader('SUPERADMIN HQ')}
              {navItem('admin_dashboard', 'HQ Overview', <LayoutDashboard size={18} />)}
              {navItem('admin_allocations', 'Apartment Allocations', <Sparkles size={18} />)}
              {navItem('soldier_onboarding', 'Soldier Onboarding', <UserPlus size={18} />)}
              {navItem('admin_tenants', 'Tenant Residents (Modify)', <Users size={18} />)}
              {navItem('admin_admins', 'Admin User Privileges', <UserCheck size={18} />)}
              {navItem('admin_flats', 'Estate Flats', <Building size={18} />)}
              {navItem('admin_hierarchy', 'Estate Hierarchy (400 Flats)', <Building2 size={18} />)}
              {navItem('admin_billing', 'Tariffs & Levies', <CreditCard size={18} />)}
              {navItem('billing_mgmt', 'Billing & Invoices', <Receipt size={18} />)}
              {navItem('admin_id_cards', 'Digital Gate Passes', <QrCode size={18} />)}
              {navItem('notifications_scheduler', 'Broadcast Announcements', <Megaphone size={18} />)}
              {navItem('maintenance', 'Maintenance Requests', <Wrench size={18} />)}
              {navItem('admin_settings', 'System Settings', <Settings size={18} />)}
            </>
          )}

          {effectiveRole === 'soldier' && (
            <>
              {sectionHeader('SOLDIER LANDLORD')}
              {navItem('soldier_dashboard', 'Overview', <LayoutDashboard size={18} />)}
              {navItem('soldier_allocations', 'My Allocation & Deed Letter', <Sparkles size={18} />)}
              {navItem('soldier_properties', 'My Allocated Flats', <Building size={18} />)}
              {navItem('soldier_tenants', 'My Tenants', <Users size={18} />)}
              {navItem('soldier_billing', 'Rent & Revenue', <CreditCard size={18} />)}
              {navItem('soldier_id_card', 'Armed Forces Gate Pass', <QrCode size={18} />)}
              {navItem('soldier_settings', 'System & Account Settings', <Settings size={18} />)}
            </>
          )}

          {effectiveRole === 'tenant' && (
            <>
              {sectionHeader('RESIDENT TENANT')}
              {navItem('tenant_dashboard', 'Resident Portal', <LayoutDashboard size={18} />)}
              {navItem('tenant_profile', 'My Tenancy Agreement', <FileText size={18} />)}
              {navItem('tenant_billing', 'Pay Levies (₦10k/mo)', <CreditCard size={18} />)}
              {navItem('tenant_dependents', 'Household Dependents', <Users size={18} />)}
              {navItem('tenant_id_card', 'Smart ID Gate Pass', <QrCode size={18} />)}
              {navItem('tenant_settings', 'System & Account Settings', <Settings size={18} />)}
            </>
          )}
        </div>

        {/* Footer with Sign Out */}
        {onLogout && (
          <div style={{ padding: '0.5rem 0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              type="button"
              onClick={onLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                backgroundColor: 'rgba(153, 27, 27, 0.25)',
                color: '#FCA5A5',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              <LogOut size={16} color="#EF4444" />
              <span>Sign Out to Home</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;