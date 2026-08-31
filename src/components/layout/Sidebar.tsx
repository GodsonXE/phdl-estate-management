import React from 'react';
import { usePhdlStore } from '../../data/storage';
import { PhdlLogo } from '../common/PhdlLogo';
import {
  LayoutDashboard,
  Building,
  Building2,
  Users,
  CreditCard,
  IdCard,
  Settings,
  Shield,
  FileText,
  UserPlus,
  UserCheck,
  Receipt,
  Megaphone,
  Wrench,
} from 'lucide-react';

import { Role } from '../../types';

export type ActivePage =
  | 'admin_dashboard'
  | 'soldier_onboarding'
  | 'admin_soldiers'
  | 'admin_tenants'
  | 'admin_flats'
  | 'admin_billing'
  | 'admin_id_cards'
  | 'admin_admins'
  | 'admin_settings'
  | 'admin_hierarchy'
  | 'admin_verification'
  | 'billing_mgmt'
  | 'gate_scanner'
  | 'notifications_scheduler'
  | 'maintenance'
  | 'soldier_dashboard'
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
  | 'system_settings'
  | 'user_profile'
  | (string & {});

export interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  currentRole?: Role;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, currentRole }) => {
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
          if (typeof onNavigate === 'function') {
            onNavigate(page);
          }
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
          color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
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
    <aside
      className="sidebar"
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
      }}
    >
      {/* 1. BRAND HEADER */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1.25rem 1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          backgroundColor: '#071A0B',
          flexShrink: 0,
        }}
      >
        <PhdlLogo size={38} />
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <div style={{ fontWeight: 900, fontSize: '0.92rem', color: '#FFFFFF', letterSpacing: '0.04em' }}>
            PHDL HOUSING
          </div>
          <div style={{ fontSize: '0.68rem', color: '#FBBF24', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            RC 676563 • {estate?.name || 'Unity Estate'}
          </div>
        </div>
      </div>

      {/* 2. SCROLLABLE NAVIGATION LIST */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.75rem 0.65rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.1rem',
        }}
      >
        {/* ================= PHDL SUPERADMIN ================= */}
        {effectiveRole === 'phdl_admin' && (
          <>
            {sectionHeader('SUPERADMIN HQ')}
            {navItem('admin_dashboard', 'HQ Overview', <LayoutDashboard size={18} />)}
            {navItem('soldier_onboarding', 'Soldier Onboarding', <UserPlus size={18} />)}
            {navItem('admin_tenants', 'Tenant Residents (Modify)', <Users size={18} />)}
            {navItem('admin_admins', 'Admin User Privileges', <UserCheck size={18} />)}
            {navItem('admin_flats', 'Estate Flats', <Building size={18} />)}
            {navItem('admin_hierarchy', 'Estate Hierarchy (404 Flats)', <Building2 size={18} />)}
            {navItem('admin_billing', 'Tariffs & Levies', <CreditCard size={18} />)}
            {navItem('billing_mgmt', 'Billing & Invoices', <Receipt size={18} />)}
            {navItem('admin_id_cards', 'Digital Gate Passes', <IdCard size={18} />)}
            {navItem('notifications_scheduler', 'Broadcast Announcements', <Megaphone size={18} />)}
            {navItem('maintenance', 'Maintenance Requests', <Wrench size={18} />)}
            {navItem('admin_settings', 'System Settings', <Settings size={18} />)}
          </>
        )}

        {/* ================= SOLDIER LANDLORD ================= */}
        {effectiveRole === 'soldier' && (
          <>
            {sectionHeader('SOLDIER LANDLORD')}
            {navItem('soldier_dashboard', 'Overview', <LayoutDashboard size={18} />)}
            {navItem('soldier_properties', 'My Allocated Flats', <Building size={18} />)}
            {navItem('soldier_tenants', 'My Tenants', <Users size={18} />)}
            {navItem('soldier_billing', 'Rent & Revenue', <CreditCard size={18} />)}
            {navItem('soldier_id_card', 'Armed Forces Gate Pass', <IdCard size={18} />)}
            {navItem('soldier_settings', 'System & Account Settings', <Settings size={18} />)}
          </>
        )}

        {/* ================= RESIDENT TENANT ================= */}
        {effectiveRole === 'tenant' && (
          <>
            {sectionHeader('RESIDENT TENANT')}
            {navItem('tenant_dashboard', 'Resident Portal', <LayoutDashboard size={18} />)}
            {navItem('tenant_profile', 'My Tenancy Agreement', <FileText size={18} />)}
            {navItem('tenant_billing', 'Pay Levies (₦10k/mo)', <CreditCard size={18} />)}
            {navItem('tenant_dependents', 'Household Dependents', <Users size={18} />)}
            {navItem('tenant_id_card', 'Smart ID Gate Pass', <IdCard size={18} />)}
            {navItem('tenant_settings', 'System & Account Settings', <Settings size={18} />)}
          </>
        )}
      </div>

      {/* 3. FOOTER BADGE */}
      <div
        style={{
          padding: '0.85rem 1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: '#071A0B',
          fontSize: '0.72rem',
          color: 'rgba(255, 255, 255, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <span>Armed Forces Platform</span>
        <span style={{ color: '#FBBF24', fontWeight: 800 }}>v2.4</span>
      </div>
    </aside>
  );
};

export default Sidebar;
