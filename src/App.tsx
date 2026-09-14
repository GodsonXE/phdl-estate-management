import React, { useState } from 'react';
import { LandingPage } from './pages/landing/LandingPage';
import {
  Shield,
  Home,
  Users,
  CreditCard,
  Zap,
  Activity,
  Award,
  Bell,
  CheckCircle2,
  FileText,
  Key,
  Lock,
  Menu,
  PhoneCall,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Wrench,
  TrendingUp,
  UserCheck,
  X,
  AlertTriangle,
  Clock,
  Compass,
  DollarSign,
  Download,
  Upload,
  Building2,
  ChevronRight,
  LogOut,
  QrCode,
  Check,
  ArrowRight,
  Send,
  Printer,
  Share2,
  Eye,
  Trash2,
  Edit3
} from 'lucide-react';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [currentRole, setCurrentRole] = useState<'soldier' | 'tenant' | 'admin'>('soldier');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Active Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // =========================================================================
  // INTERACTIVE FEATURE STATES
  // =========================================================================
  
  // 1. Tenant: Payment Gateway State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer' | 'ussd'>('card');
  const [paymentSuccessReceipt, setPaymentSuccessReceipt] = useState<any | null>(null);

  // 2. Tenant: Prepaid Electricity Token State
  const [meterAmount, setMeterAmount] = useState<number>(5000);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  // 3. Tenant: Visitor Pass Generator State
  const [visitorName, setVisitorName] = useState('');
  const [visitorPlate, setVisitorPlate] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [activePassCode, setActivePassCode] = useState<string | null>('GEN-9824-QR');

  // 4. Tenant: Maintenance Ticket State
  const [ticketCategory, setTicketCategory] = useState('Plumbing & Borehole');
  const [ticketPriority, setTicketPriority] = useState('High');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketsList, setTicketsList] = useState<any[]>([
    { id: 'TKT-104', category: 'Plumbing', desc: 'Borehole water pressure valve in Flat B', priority: 'High', status: 'In Progress', date: '14 Sep 2026' },
    { id: 'TKT-089', category: 'Electrical', desc: 'Street light lamp near House 14, Lane 3', priority: 'Medium', status: 'Resolved', date: '02 Sep 2026' }
  ]);

  // 5. Soldier Landlord: EOI Application Form State
  const [eoiFormOpen, setEoiFormOpen] = useState(false);
  const [eoiScheme, setEoiScheme] = useState('Unity Estate (Kurudu, Abuja)');
  const [eoiRank, setEoiRank] = useState('Major');
  const [eoiServiceNo, setEoiServiceNo] = useState('N/12849');

  // 6. SuperAdmin: Broadcast SMS / Notification State
  const [broadcastRecipient, setBroadcastRecipient] = useState('All 400 Flats (Lanes 1 to 8)');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // 7. SuperAdmin: 400 Flats Search & Allocation State
  const [flatSearchQuery, setFlatSearchQuery] = useState('');
  const [allocateModalOpen, setAllocateModalOpen] = useState(false);
  const [selectedLane, setSelectedLane] = useState('Lane 3 (Command Avenue)');
  const [selectedHouse, setSelectedHouse] = useState('House 14');
  const [selectedFlatUnit, setSelectedFlatUnit] = useState('Flat B');
  const [assigneeName, setAssigneeName] = useState('');
  const [assigneeServiceNo, setAssigneeServiceNo] = useState('');

  // 8. SuperAdmin: Defaulters Restriction List
  const [defaulters, setDefaulters] = useState<any[]>([
    { id: 1, flat: 'House 5, Flat C (Lane 1)', occupant: 'Capt. A. Mohammed', amountDue: '₦20,000', months: '2 Months', restricted: true },
    { id: 2, flat: 'House 22, Flat A (Lane 2)', occupant: 'Mr. Jude Obi', amountDue: '₦10,000', months: '1 Month', restricted: false },
    { id: 3, flat: 'House 48, Flat D (Lane 4)', occupant: 'Lt. Cdr. T. Alabi', amountDue: '₦30,000', months: '3 Months', restricted: true },
    { id: 4, flat: 'House 65, Flat B (Lane 5)', occupant: 'Alh. S. Danbaba', amountDue: '₦10,000', months: '1 Month', restricted: false }
  ]);

  // Toggle Defaulter Gate Restriction
  const toggleDefaulterRestriction = (id: number) => {
    setDefaulters(defaulters.map(d => d.id === id ? { ...d, restricted: !d.restricted } : d));
    showToast('RFID Gate Pass restriction updated in Sentinel database.');
  };

  // Role Configurations
  const roleData = {
    soldier: {
      name: 'Major Ibrahim Danjuma',
      serviceNo: 'N/12849',
      roleTitle: 'Soldier Landlord',
      rank: 'Major (Nigerian Army)',
      flat: 'House 14, Flat B',
      lane: 'Lane 3 (Command Avenue)',
      equity: '100% Amortized',
      tenant: 'Dr. Emeka Okafor (Active Lease)',
      tabs: [
        { id: 'overview', label: 'Command Overview', icon: Activity },
        { id: 'equity', label: 'Housing Equity & Deed', icon: Award },
        { id: 'eoi', label: 'Apply for EOI Scheme', icon: FileText },
        { id: 'tenants', label: 'Tenant & Lease Directory', icon: Users },
        { id: 'remittance', label: 'Rent & Pension Sync', icon: CreditCard },
        { id: 'maintenance', label: 'Levies & Upkeep', icon: Wrench },
        { id: 'idcard', label: 'Digital Landlord ID', icon: Key },
        { id: 'settings', label: 'Officer Profile', icon: Settings }
      ]
    },
    tenant: {
      name: 'Dr. Emeka Okafor',
      serviceNo: 'PHDL/CIV/092',
      roleTitle: 'Resident Tenant',
      rank: 'Civilian Resident',
      flat: 'House 14, Flat B',
      lane: 'Lane 3 (Command Avenue)',
      equity: 'Annual Verified Lease',
      tenant: 'Primary Occupant',
      tabs: [
        { id: 'overview', label: 'Resident Home', icon: Activity },
        { id: 'service-charge', label: 'Pay ₦10k Service Charge', icon: CreditCard },
        { id: 'electricity', label: 'Prepaid Metering Token', icon: Zap },
        { id: 'visitor-pass', label: 'Visitor QR Gate Pass', icon: QrCode },
        { id: 'maintenance', label: 'Maintenance Helpdesk', icon: Wrench },
        { id: 'broadcasts', label: 'Estate Notice Board', icon: Bell },
        { id: 'idcard', label: 'Digital Resident Pass', icon: Key },
        { id: 'settings', label: 'Resident Profile', icon: Settings }
      ]
    },
    admin: {
      name: 'Col. M. Bello',
      serviceNo: 'HQ/DIR/001',
      roleTitle: 'SuperAdmin HQ',
      rank: 'Director, PHDL Real Estate',
      flat: 'PHDL Command Headquarters',
      lane: '18 Nationwide Portfolio Schemes',
      equity: 'Executive Authority',
      tenant: '400 Flats Registry',
      tabs: [
        { id: 'overview', label: 'Executive HQ Master', icon: Activity },
        { id: 'allocation-control', label: '400 Flats Allocation Engine', icon: Award },
        { id: 'financial-ledger', label: '₦4.0M Monthly Pool Ledger', icon: DollarSign },
        { id: 'broadcast-sms', label: 'SMS & Broadcast Gateway', icon: Send },
        { id: 'security-barrier', label: 'RFID Sentry & Defaulters', icon: Shield },
        { id: 'utilities', label: 'Power & Water Telemetry', icon: Zap },
        { id: 'nationwide', label: '18 Nationwide Schemes', icon: Building2 },
        { id: 'settings', label: 'System Configuration', icon: Settings }
      ]
    }
  };

  const handleSwitchRole = (role: 'soldier' | 'tenant' | 'admin') => {
    setCurrentRole(role);
    setActiveTab('overview');
    setCurrentView('dashboard');
  };

  const handleLogin = (role: 'soldier' | 'tenant' | 'admin' | 'security') => {
    const targetRole = role === 'security' ? 'admin' : role;
    handleSwitchRole(targetRole as any);
  };

  // CSV Export Utility Simulation
  const handleExportCSV = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filename}.csv successfully!`);
  };

  const currentConfig = roleData[currentRole];
  const currentTabs = currentConfig.tabs;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#07120a', color: '#0f172a', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#0f291e',
          color: '#fef08a',
          border: '1px solid rgba(251, 191, 36, 0.5)',
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          fontSize: '0.88rem',
          fontWeight: 700
        }}>
          <CheckCircle2 size={18} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      {currentView === 'landing' ? (
        /* Redesigned Modern Landing Page */
        <LandingPage onLogin={handleLogin} />
      ) : (
        /* White Dashboard Layout with Dark Sidebar */
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          
          {/* ========================================================================= */}
          {/* 1. TOP HEADER                                                             */}
          {/* ========================================================================= */}
          <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: '#071a0b',
            borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
            padding: '0.65rem clamp(1rem, 3vw, 2rem)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#ffffff'
          }}>
            {/* Brand Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div onClick={() => setCurrentView('landing')} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'linear-gradient(135deg, #15803d 0%, #047857 50%, #b45309 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                  <Shield size={22} color="#fef08a" />
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#ffffff', lineHeight: 1.1 }}>
                    PHDL <span style={{ color: '#f59e0b' }}>ESTATES</span>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#86efac', fontWeight: 700 }}>
                    UNITY ESTATE (KURUDU, ABUJA)
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Role Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '0.25rem 0.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, paddingRight: '0.25rem' }}>ACTIVE ROLE:</span>
              <button type="button" onClick={() => handleSwitchRole('soldier')} style={{ padding: '0.25rem 0.65rem', borderRadius: '5px', backgroundColor: currentRole === 'soldier' ? '#15803d' : 'transparent', color: currentRole === 'soldier' ? '#fff' : '#94a3b8', fontWeight: 800, fontSize: '0.76rem', border: 'none', cursor: 'pointer' }}>🎖️ Landlord</button>
              <button type="button" onClick={() => handleSwitchRole('tenant')} style={{ padding: '0.25rem 0.65rem', borderRadius: '5px', backgroundColor: currentRole === 'tenant' ? '#0284c7' : 'transparent', color: currentRole === 'tenant' ? '#fff' : '#94a3b8', fontWeight: 800, fontSize: '0.76rem', border: 'none', cursor: 'pointer' }}>🏡 Tenant</button>
              <button type="button" onClick={() => handleSwitchRole('admin')} style={{ padding: '0.25rem 0.65rem', borderRadius: '5px', backgroundColor: currentRole === 'admin' ? '#ca8a04' : 'transparent', color: currentRole === 'admin' ? '#fff' : '#94a3b8', fontWeight: 800, fontSize: '0.76rem', border: 'none', cursor: 'pointer' }}>🏢 SuperAdmin</button>
            </div>

            {/* Exit & Landing Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => setCurrentView('landing')}
                style={{ padding: '0.45rem 0.85rem', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#e2e8f0', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Landing Page
              </button>
              <button
                type="button"
                onClick={() => setCurrentView('landing')}
                style={{ padding: '0.45rem 0.85rem', borderRadius: '6px', backgroundColor: '#be123c', border: 'none', color: '#ffffff', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <LogOut size={14} /> Exit
              </button>
            </div>
          </header>

          {/* ========================================================================= */}
          {/* 2. BODY LAYOUT (DARK SIDEBAR + CLEAN WHITE DASHBOARD)                     */}
          {/* ========================================================================= */}
          <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 60px)' }}>
            
            {/* DARK SIDEBAR */}
            <aside style={{
              width: '260px',
              backgroundColor: '#05140b',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '1.25rem 0.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: '#ffffff',
              flexShrink: 0
            }}>
              <div>
                {/* Active User Card in Sidebar */}
                <div style={{
                  backgroundColor: 'rgba(21, 128, 61, 0.18)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: '10px',
                  padding: '0.85rem',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ fontSize: '0.68rem', color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase' }}>
                    {currentConfig.roleTitle}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff', marginTop: '0.2rem' }}>
                    {currentConfig.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                    {currentConfig.serviceNo} • {currentConfig.flat}
                  </div>
                </div>

                {/* Sidebar Navigation Links */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {currentTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        type="button"
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setMobileSidebarOpen(false); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.7rem 0.85rem',
                          borderRadius: '8px',
                          backgroundColor: isActive ? '#15803d' : 'transparent',
                          border: isActive ? '1px solid rgba(251, 191, 36, 0.4)' : '1px solid transparent',
                          color: isActive ? '#ffffff' : '#94a3b8',
                          fontWeight: isActive ? 800 : 600,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s'
                        }}
                      >
                        <Icon size={18} color={isActive ? '#fef08a' : '#94a3b8'} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar Footer Indicator */}
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.75rem',
                color: '#94a3b8'
              }}>
                <div style={{ color: '#4ade80', fontWeight: 800 }}>● 400 FLATS • 8 LANES</div>
                <div>Unity Estate, Kurudu</div>
              </div>
            </aside>

            {/* ======================================================================= */}
            {/* 3. CLEAN WHITE DASHBOARD MAIN CONTENT AREA                              */}
            {/* ======================================================================= */}
            <main style={{
              flex: 1,
              backgroundColor: '#f8fafc',
              padding: 'clamp(1.25rem, 3vw, 2.5rem)',
              overflowY: 'auto',
              color: '#0f172a'
            }}>
              
              {/* Clean White Top Overview Banner */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.25rem 1.5rem',
                marginBottom: '1.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}>
                <div>
                  <div style={{ color: '#15803d', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {currentConfig.rank} • {currentConfig.lane}
                  </div>
                  <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', margin: '0.2rem 0' }}>
                    {currentTabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
                  </h1>
                  <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>
                    Unity Estate, Kurudu, Abuja — Overseeing 400 Flats (100 Houses across 8 Zoned Lanes).
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.35rem 0.75rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.78rem', border: '1px solid #bbf7d0' }}>
                    ● 2026 ESTATE PORTAL ACTIVE
                  </span>
                </div>
              </div>

              {/* ===================================================================== */}
              {/* ROLE 1: SOLDIER LANDLORD SCREENS                                      */}
              {/* ===================================================================== */}
              {currentRole === 'soldier' && (
                <div>
                  {activeTab === 'overview' && (
                    <div>
                      {/* Metric Cards */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Statutory Allocation Equity</div>
                          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#15803d', margin: '0.25rem 0' }}>1 Flat</div>
                          <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 700 }}>100% Amortized (Statutory Limit)</div>
                        </div>

                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Annual Rental Inflow</div>
                          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', margin: '0.25rem 0' }}>₦1,800,000</div>
                          <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700 }}>Next Remittance: 1st Oct 2026</div>
                        </div>

                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Active Tenant</div>
                          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '0.25rem 0' }}>Dr. Emeka Okafor</div>
                          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>Verified Lease Agreement</div>
                        </div>

                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Pension Deduction Sync</div>
                          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#15803d', margin: '0.25rem 0' }}>N/12849</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Armed Forces Bank Verified</div>
                        </div>
                      </div>

                      {/* Quick Actions Bar */}
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                        <button type="button" onClick={() => setActiveTab('eoi')} style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', backgroundColor: '#15803d', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Plus size={16} /> Apply for New EOI Housing Allocation
                        </button>
                        <button type="button" onClick={() => handleExportCSV('Officer_Remittance_Ledger', 'Date,Tenant,Unit,Gross,Levy,Net\n2026-09-01,Dr. Emeka Okafor,Lane 3 H14-B,150000,10000,140000\n2026-08-01,Dr. Emeka Okafor,Lane 3 H14-B,150000,10000,140000')} style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', backgroundColor: '#ffffff', color: '#0f172a', fontWeight: 700, border: '1px solid #cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Download size={16} /> Export Remittance Statement (CSV)
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'equity' && (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.35rem' }}>Statutory Housing Deed of Allocation</h3>
                          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Certificate issued by Post-Housing Development Limited under the Armed Forces Welfare Scheme.</p>
                        </div>
                        <button type="button" onClick={() => window.print()} style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', backgroundColor: '#15803d', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Printer size={16} /> Print Official Certificate
                        </button>
                      </div>
                      
                      <div style={{ border: '2px solid #cbd5e1', borderRadius: '12px', padding: '2rem', backgroundColor: '#fafaf9', position: 'relative' }}>
                        <div style={{ textAlign: 'center', borderBottom: '2px solid #15803d', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#b45309', letterSpacing: '0.08em', textTransform: 'uppercase' }}>POST-HOUSING DEVELOPMENT LIMITED (PHDL)</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginTop: '0.25rem' }}>CERTIFICATE OF STATUTORY HOMEOWNERSHIP</div>
                          <div style={{ fontSize: '0.82rem', color: '#64748b' }}>DEED NO: PHDL/2026/KURUDU/L3-H14-B</div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                          <div><strong style={{ color: '#64748b' }}>Beneficiary Officer:</strong><div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>Major Ibrahim Danjuma</div></div>
                          <div><strong style={{ color: '#64748b' }}>Service / Force ID:</strong><div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>N/12849</div></div>
                          <div><strong style={{ color: '#64748b' }}>Allocated Unit:</strong><div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#15803d' }}>House 14, Flat B (Lane 3)</div></div>
                          <div><strong style={{ color: '#64748b' }}>Scheme & Sector:</strong><div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>Unity Estate (Kurudu, Abuja)</div></div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '48px', height: '48px', backgroundColor: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <QrCode size={36} color="#0f172a" />
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Cryptographically Verified<br />Official Armed Forces Seal</div>
                          </div>
                          <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#15803d', fontWeight: 800 }}>
                            AUTHORIZED BY BOARD OF DIRECTORS
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'eoi' && (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>Expression of Interest (EOI) Housing Application</h3>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Submit an expression of interest for residential apartment equity under the statutory armed forces housing quota.</p>
                      
                      <form onSubmit={(e) => { e.preventDefault(); showToast('EOI Application submitted successfully to PHDL Allocation Board!'); }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Target Scheme:</label>
                          <select value={eoiScheme} onChange={(e) => setEoiScheme(e.target.value)} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}>
                            <option value="Unity Estate (Kurudu, Abuja)">Unity Estate (Kurudu, Abuja) - 400 Flats</option>
                            <option value="Lagos Officers Enclave (Victoria Island)">Lagos Officers Enclave (Victoria Island)</option>
                            <option value="Kaduna Northern Command Enclave">Kaduna Northern Command Enclave</option>
                            <option value="Port Harcourt Palms Scheme">Port Harcourt Palms Scheme</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Preferred Lane / Sector:</label>
                          <select style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}>
                            <option>Lane 1 - General's Boulevard (36 Flats)</option>
                            <option>Lane 2 - Brigade Way (68 Flats)</option>
                            <option>Lane 3 - Command Avenue (72 Flats)</option>
                            <option>Lane 4 - Victory Crescent (72 Flats)</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Military ID / Passport Scan:</label>
                          <input type="file" style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px dashed #cbd5e1', fontSize: '0.85rem' }} />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                          <button type="submit" style={{ padding: '0.85rem 2rem', borderRadius: '8px', backgroundColor: '#15803d', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                            Submit Formal EOI Application &rarr;
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {activeTab === 'idcard' && (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '1rem' }}>Digital Officer Landlord Card</h3>
                      <div style={{ width: '380px', maxWidth: '100%', borderRadius: '16px', background: 'linear-gradient(135deg, #071a0b 0%, #15803d 100%)', color: '#fff', padding: '1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                          <div style={{ fontWeight: 900, color: '#fef08a' }}>PHDL LANDLORD PASS</div>
                          <Shield size={22} color="#fbbf24" />
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>Major Ibrahim Danjuma</div>
                        <div style={{ fontSize: '0.8rem', color: '#86efac' }}>Service No: N/12849</div>
                        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                          <span>House 14, Flat B (Lane 3)</span>
                          <span style={{ color: '#fef08a' }}>VERIFIED ACTIVE</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'tenants' && (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Active Tenant Directory</h3>
                        <button type="button" onClick={() => showToast('Lease Agreement PDF downloaded.')} style={{ padding: '0.5rem 1rem', borderRadius: '6px', backgroundColor: '#15803d', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem' }}>
                          <Download size={14} /> Download Lease Agreement
                        </button>
                      </div>
                      <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>Dr. Emeka Okafor</div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Phone: 0802 111 2233 • Email: emeka.okafor@consultant.ng</div>
                          </div>
                          <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.3rem 0.65rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.75rem' }}>VERIFIED LEASE</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'remittance' && (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>Rent Remittances & Pension Ledger</h3>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Direct synchronization with Military Pension Board and personal Armed Forces Bank accounts.</p>
                      <button type="button" onClick={() => showToast('Remittance withdrawal request queued for settlement.')} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', backgroundColor: '#15803d', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                        Request Instant Remittance Payout (₦150,000) &rarr;
                      </button>
                    </div>
                  )}

                  {activeTab === 'maintenance' && (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>Maintenance Levies Oversight</h3>
                      <p style={{ color: '#64748b', fontSize: '0.9rem' }}>House 14, Flat B monthly maintenance levy (₦10,000) is paid in advance.</p>
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '1rem' }}>Officer Account Profile</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                        <div><strong>Officer:</strong> Major Ibrahim Danjuma</div>
                        <div><strong>Force No:</strong> N/12849</div>
                        <div><strong>Phone:</strong> 0803 456 7890</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ===================================================================== */}
              {/* ROLE 2: RESIDENT TENANT SCREENS                                       */}
              {/* ===================================================================== */}
              {currentRole === 'tenant' && (
                <div>
                  {activeTab === 'overview' && (
                    <div>
                      {/* Metric Cards */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Monthly Service Levy</div>
                          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#15803d', margin: '0.25rem 0' }}>₦10,000</div>
                          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>Status: Settled (Current Month)</div>
                        </div>

                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Prepaid Electricity Units</div>
                          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0284c7', margin: '0.25rem 0' }}>148.5 kWh</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Meter: 4501-9824-0012</div>
                        </div>

                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Active Gate Pass</div>
                          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#b45309', margin: '0.25rem 0' }}>{activePassCode}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Valid for 24 Hours at Main Gate</div>
                        </div>
                      </div>

                      {/* Pay Service Charge Action Banner */}
                      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>
                            Mandatory Estate Maintenance Levy (₦10,000 / Month)
                          </h3>
                          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                            Covers 650 kVA generator diesel, 24/7 armed sentry guards, water pumping, and sanitation.
                          </p>
                        </div>
                        <button type="button" onClick={() => setPaymentModalOpen(true)} style={{ padding: '0.7rem 1.4rem', borderRadius: '8px', backgroundColor: '#15803d', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <CreditCard size={16} /> Pay ₦10,000 Now &rarr;
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'service-charge' && (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.25rem' }}>Service Charge Invoices & Receipts</h3>
                          <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>Statutory estate maintenance levy of ₦10,000 monthly.</p>
                        </div>
                        <button type="button" onClick={() => setPaymentModalOpen(true)} style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', backgroundColor: '#15803d', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                          Pay ₦10,000 Online &rarr;
                        </button>
                      </div>

                      <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>September 2026 Estate Levy</div>
                          <div style={{ fontSize: '0.82rem', color: '#64748b' }}>House 14, Flat B • Reconciled via Paystack</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, color: '#15803d' }}>₦10,000 (PAID)</div>
                          <button type="button" onClick={() => showToast('Receipt downloaded.')} style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}>Download Receipt</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'electricity' && (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>Digital Electricity Meter Recharge</h3>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Meter Number: <strong>4501-9824-0012</strong> • Current Balance: <strong>148.5 kWh</strong></p>
                      
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <input
                          type="number"
                          value={meterAmount}
                          onChange={(e) => setMeterAmount(Number(e.target.value))}
                          style={{ padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1', width: '200px' }}
                          placeholder="Amount in Naira"
                        />
                        <button type="button" onClick={() => { setGeneratedToken('4589-2301-8841-0023-9912'); showToast('20-Digit Electricity Token Generated!'); }} style={{ padding: '0.7rem 1.5rem', borderRadius: '8px', backgroundColor: '#0284c7', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                          Generate 20-Digit STS Token &rarr;
                        </button>
                      </div>

                      {generatedToken && (
                        <div style={{ padding: '1.25rem', borderRadius: '10px', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}>
                          <div style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 800 }}>GENERATED STS TOKEN (UNITS: ~78.4 kWh)</div>
                          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', letterSpacing: '0.05em', margin: '0.35rem 0' }}>{generatedToken}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Key into your smart meter keypad and press Enter.</div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'visitor-pass' && (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>Generate Single-Use Visitor QR Gate Pass</h3>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Create verified gate entry passes for guests, cabs, and delivery drivers at the Main Gate Sentry barrier.</p>
                      
                      <form onSubmit={(e) => { e.preventDefault(); const newCode = `GEN-${Math.floor(1000 + Math.random() * 9000)}-QR`; setActivePassCode(newCode); showToast(`Gate Pass ${newCode} generated & SMS dispatched!`); }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Visitor Full Name:</label>
                          <input type="text" required value={visitorName} onChange={(e) => setVisitorName(e.target.value)} placeholder="e.g. Engr. Kola Alabi" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Vehicle Plate (Optional):</label>
                          <input type="text" value={visitorPlate} onChange={(e) => setVisitorPlate(e.target.value)} placeholder="e.g. ABC-123-XY" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Visitor Phone Number:</label>
                          <input type="tel" required value={visitorPhone} onChange={(e) => setVisitorPhone(e.target.value)} placeholder="0803 000 0000" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', backgroundColor: '#15803d', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                            Generate & Send QR Pass via SMS &rarr;
                          </button>
                        </div>
                      </form>

                      {activePassCode && (
                        <div style={{ border: '2px dashed #15803d', borderRadius: '12px', padding: '1.5rem', backgroundColor: '#f0fdf4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                          <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803d' }}>ACTIVE GATE PASS (24-HR SINGLE ENTRY)</div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: '0.25rem 0' }}>{activePassCode}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Destination: House 14, Flat B (Lane 3)</div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button type="button" onClick={() => showToast('Pass link copied for WhatsApp sharing!')} style={{ padding: '0.55rem 1rem', borderRadius: '6px', backgroundColor: '#15803d', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                              <Share2 size={14} /> Share WhatsApp
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'maintenance' && (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>Resident Maintenance Dispatch Desk</h3>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Submit and track facility repair tickets with on-duty estate artisans.</p>
                      
                      <form onSubmit={(e) => { e.preventDefault(); setTicketsList([{ id: `TKT-${Math.floor(100 + Math.random() * 900)}`, category: ticketCategory, desc: ticketDescription, priority: ticketPriority, status: 'Queued', date: 'Today' }, ...ticketsList]); setTicketDescription(''); showToast('Maintenance ticket dispatched to Duty Engineer!'); }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Fault Category:</label>
                          <select value={ticketCategory} onChange={(e) => setTicketCategory(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                            <option>Plumbing & Borehole</option>
                            <option>Electrical & Metering</option>
                            <option>Carpentry & Roof</option>
                            <option>Sanitation & Drainage</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Urgency Level:</label>
                          <select value={ticketPriority} onChange={(e) => setTicketPriority(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                            <option>High (Immediate Dispatch)</option>
                            <option>Medium (Within 24 Hours)</option>
                            <option>Low (Routine Maintenance)</option>
                          </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Describe Fault Details:</label>
                          <textarea required value={ticketDescription} onChange={(e) => setTicketDescription(e.target.value)} rows={3} placeholder="Provide details of the issue..." style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', backgroundColor: '#15803d', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                            Submit Maintenance Ticket &rarr;
                          </button>
                        </div>
                      </form>

                      {/* Ticket History */}
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Active Tickets</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {ticketsList.map((t, idx) => (
                          <div key={idx} style={{ padding: '0.85rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontWeight: 800, color: '#0f172a' }}>{t.id} • {t.category} ({t.priority} Priority)</div>
                              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{t.desc}</div>
                            </div>
                            <span style={{ backgroundColor: t.status === 'Resolved' ? '#dcfce7' : '#fef3c7', color: t.status === 'Resolved' ? '#15803d' : '#b45309', padding: '0.25rem 0.6rem', borderRadius: '4px', fontWeight: 800, fontSize: '0.72rem' }}>{t.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'broadcasts' && (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '1rem' }}>Estate Community Notice Board</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ borderLeft: '4px solid #15803d', paddingLeft: '1rem' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>⚡ Central Diesel Generator Operational Schedule</div>
                          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>650 kVA Generator will power all 400 flats from 7:00 PM to 6:00 AM daily.</div>
                        </div>
                        <div style={{ borderLeft: '4px solid #0284c7', paddingLeft: '1rem' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>💧 Water Treatment & Pumping Hours</div>
                          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Borehole filtration pumps run 6:00 AM–9:00 AM & 5:00 PM–8:00 PM daily.</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'idcard' && (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '1rem' }}>Digital Resident Identity Card</h3>
                      <div style={{ width: '380px', maxWidth: '100%', borderRadius: '16px', background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)', color: '#fff', padding: '1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                          <div style={{ fontWeight: 900, color: '#fef08a' }}>PHDL RESIDENT PASS</div>
                          <Home size={22} color="#fef08a" />
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>Dr. Emeka Okafor</div>
                        <div style={{ fontSize: '0.8rem', color: '#e0f2fe' }}>Tenant ID: PHDL/CIV/092</div>
                        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                          <span>House 14, Flat B (Lane 3)</span>
                          <span style={{ color: '#fef08a' }}>RFID CLEARED</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '1rem' }}>Resident Profile & Credentials</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                        <div><strong>Resident:</strong> Dr. Emeka Okafor</div>
                        <div><strong>Phone:</strong> 0802 111 2233</div>
                        <div><strong>Apartment:</strong> House 14, Flat B (Lane 3)</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ===================================================================== */}
              {/* ROLE 3: SUPERADMIN HQ SCREENS                                         */}
              {/* ===================================================================== */}
              {currentRole === 'admin' && (
                <div>
                  {activeTab === 'overview' && (
                    <div>
                      {/* Master HQ Metrics */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Total Residential Flats</div>
                          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#15803d', margin: '0.25rem 0' }}>400 Units</div>
                          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>100 Houses across 8 Zoned Lanes</div>
                        </div>

                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Monthly Service Pool</div>
                          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#b45309', margin: '0.25rem 0' }}>₦4,000,000</div>
                          <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 700 }}>98.4% Reconciled (₦3.94M)</div>
                        </div>

                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Main Gate RFID Tags</div>
                          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0284c7', margin: '0.25rem 0' }}>372 Passes</div>
                          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>Zero Security Breaches</div>
                        </div>

                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Nationwide Schemes</div>
                          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#dc2626', margin: '0.25rem 0' }}>18 Schemes</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Kurudu, Abuja Flagship Active</div>
                        </div>
                      </div>

                      {/* Admin Quick Action Engine */}
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
                        <button type="button" onClick={() => setActiveTab('allocation-control')} style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', backgroundColor: '#15803d', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Award size={16} /> 400 Flats Allocation Engine
                        </button>
                        <button type="button" onClick={() => setActiveTab('broadcast-sms')} style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', backgroundColor: '#ca8a04', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Send size={16} /> Dispatch Broadcast SMS
                        </button>
                        <button type="button" onClick={() => handleExportCSV('PHDL_UnityEstate_400Flats_Registry', 'Lane,House,Flat,Occupant,Rank,Status\nLane 1,House 1,Flat A,Col. M. Bello,Director,Occupied\nLane 3,House 14,Flat B,Maj. I. Danjuma,Major,Occupied')} style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', backgroundColor: '#ffffff', color: '#0f172a', fontWeight: 700, border: '1px solid #cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Download size={16} /> Export 400 Flats Master Registry (CSV)
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'allocation-control' && (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.25rem' }}>400 Flats Housing Allocation Control</h3>
                          <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>Oversee soldier applications and enforce 1-apartment statutory limit across 8 Lanes.</p>
                        </div>
                        <button type="button" onClick={() => setAllocateModalOpen(true)} style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', backgroundColor: '#15803d', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Plus size={16} /> Allocate New Apartment
                        </button>
                      </div>

                      {/* Search Bar */}
                      <input
                        type="text"
                        placeholder="Search by Lane, House, Flat, or Soldier Name..."
                        value={flatSearchQuery}
                        onChange={(e) => setFlatSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '1.5rem', boxSizing: 'border-box' }}
                      />

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                        {[
                          { lane: 'Lane 1', name: "General's Blvd", houses: 9, flats: 36, allocated: '36/36' },
                          { lane: 'Lane 2', name: 'Brigade Way', houses: 17, flats: 68, allocated: '68/68' },
                          { lane: 'Lane 3', name: 'Command Ave', houses: 18, flats: 72, allocated: '72/72' },
                          { lane: 'Lane 4', name: 'Victory Cres', houses: 18, flats: 72, allocated: '72/72' },
                          { lane: 'Lane 5', name: 'Courage Drive', houses: 16, flats: 64, allocated: '64/64' },
                          { lane: 'Lane 6', name: 'Harmony Lane', houses: 8, flats: 32, allocated: '32/32' },
                          { lane: 'Lane 7', name: 'Peace Close', houses: 7, flats: 28, allocated: '28/28' },
                          { lane: 'Lane 8', name: 'Unity Heights', houses: 7, flats: 28, allocated: '28/28' }
                        ].map((item, idx) => (
                          <div key={idx} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: '#b45309' }}>
                              <span>{item.lane}</span>
                              <span style={{ color: '#15803d' }}>{item.allocated} Units</span>
                            </div>
                            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem', marginTop: '0.2rem' }}>{item.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.houses} Blocks • {item.flats} Total Units</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'broadcast-sms' && (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>SMS & Emergency Broadcast Gateway</h3>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Send real-time instant SMS notifications to phone numbers across all 400 flats or specific zoned lanes.</p>
                      
                      <form onSubmit={(e) => { e.preventDefault(); showToast(`Broadcast SMS dispatched to ${broadcastRecipient}!`); setBroadcastMessage(''); setBroadcastTitle(''); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Broadcast Target Channel:</label>
                          <select value={broadcastRecipient} onChange={(e) => setBroadcastRecipient(e.target.value)} style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                            <option>All 400 Flats (Lanes 1 to 8)</option>
                            <option>Lane 1 - General's Boulevard (36 Flats)</option>
                            <option>Lane 2 - Brigade Way (68 Flats)</option>
                            <option>Lane 3 - Command Avenue (72 Flats)</option>
                            <option>Lane 4 - Victory Crescent (72 Flats)</option>
                            <option>Lane 5 - Courage Drive (64 Flats)</option>
                            <option>Lane 6 - Harmony Lane (32 Flats)</option>
                            <option>Lane 7 - Peace Close (28 Flats)</option>
                            <option>Lane 8 - Unity Heights (28 Flats)</option>
                            <option>All Soldier Landlords (Officers Registry)</option>
                            <option>Sentry Security Desk Only</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Broadcast Heading:</label>
                          <input type="text" required value={broadcastTitle} onChange={(e) => setBroadcastTitle(e.target.value)} placeholder="e.g. Scheduled Generator Servicing Notice" style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>SMS Message Content (Max 160 chars per SMS unit):</label>
                          <textarea required rows={4} value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)} placeholder="Type SMS message..." style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        </div>

                        <button type="submit" style={{ alignSelf: 'flex-start', padding: '0.85rem 2rem', borderRadius: '8px', backgroundColor: '#ca8a04', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Send size={16} /> Dispatch SMS Broadcast Now
                        </button>
                      </form>
                    </div>
                  )}

                  {activeTab === 'security-barrier' && (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.25rem' }}>RFID Barrier Sentry & Defaulter Enforcement</h3>
                          <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>Automatic gate restriction toggles for service charge defaulters.</p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {defaulters.map((d) => (
                          <div key={d.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: d.restricted ? '#fff1f2' : '#ffffff' }}>
                            <div>
                              <div style={{ fontWeight: 800, color: '#0f172a' }}>{d.flat} • {d.occupant}</div>
                              <div style={{ fontSize: '0.82rem', color: '#dc2626' }}>Amount Outstanding: {d.amountDue} ({d.months})</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: d.restricted ? '#dc2626' : '#15803d' }}>
                                {d.restricted ? '● GATE RESTRICTED' : '● RFID CLEARED'}
                              </span>
                              <button type="button" onClick={() => toggleDefaulterRestriction(d.id)} style={{ padding: '0.4rem 0.85rem', borderRadius: '6px', backgroundColor: d.restricted ? '#15803d' : '#dc2626', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '0.78rem' }}>
                                {d.restricted ? 'Lift Lockout' : 'Enforce Gate Lockout'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'financial-ledger' && (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>₦4.0M Monthly Pool Central Ledger</h3>
                        <button type="button" onClick={() => handleExportCSV('PHDL_Audit_Ledger_September2026', 'Date,Item,Amount,Type,ReconciledBy\n2026-09-14,400 Flats Levy,3940000,Inflow,Paystack Gateway\n2026-09-10,Generator Diesel 10000L,1100000,Outflow,HQ Finance')} style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', backgroundColor: '#15803d', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Download size={16} /> Export Financial Audit Statement (CSV)
                        </button>
                      </div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#15803d' }}>₦3,940,000 / ₦4,000,000 (98.4%)</div>
                    </div>
                  )}

                  {activeTab === 'utilities' && (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>Power Plant & Water Treatment Telemetry</h3>
                      <p style={{ color: '#64748b', fontSize: '0.9rem' }}>650 kVA Standby Diesel Generator (42% load) • 40,000L Filtered Water Reserve.</p>
                    </div>
                  )}

                  {activeTab === 'nationwide' && (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' }}>18 Nationwide Housing Schemes Portfolio</h3>
                      <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Abuja (Kurudu), Lagos (VI & Ikeja), Kaduna, Port Harcourt, Enugu, Ibadan.</p>
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '1rem' }}>System & Gateway Settings</h3>
                      <p style={{ color: '#64748b' }}>Platform Version 2.6 • Active Paystack / Flutterwave Gateways • Twilio SMS Connected</p>
                    </div>
                  )}
                </div>
              )}

            </main>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: LIVE PAYMENT GATEWAY MODAL (TENANT ₦10K SERVICE CHARGE)         */}
      {/* ========================================================================= */}
      {paymentModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '480px', padding: '2rem', boxShadow: '0 25px 50px rgba(0,0,0,0.4)', position: 'relative' }}>
            <button type="button" onClick={() => setPaymentModalOpen(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                <CreditCard size={24} color="#15803d" />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.25rem' }}>Pay Estate Service Charge</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Unity Estate, Kurudu • House 14, Flat B</p>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#15803d', marginTop: '0.5rem' }}>₦10,000.00</div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <button type="button" onClick={() => setPaymentMethod('card')} style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', border: paymentMethod === 'card' ? '2px solid #15803d' : '1px solid #cbd5e1', backgroundColor: paymentMethod === 'card' ? '#f0fdf4' : '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Card</button>
              <button type="button" onClick={() => setPaymentMethod('transfer')} style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', border: paymentMethod === 'transfer' ? '2px solid #15803d' : '1px solid #cbd5e1', backgroundColor: paymentMethod === 'transfer' ? '#f0fdf4' : '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Bank Transfer</button>
              <button type="button" onClick={() => setPaymentMethod('ussd')} style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', border: paymentMethod === 'ussd' ? '2px solid #15803d' : '1px solid #cbd5e1', backgroundColor: paymentMethod === 'ussd' ? '#f0fdf4' : '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>USSD</button>
            </div>

            <button type="button" onClick={() => { setPaymentModalOpen(false); showToast('₦10,000 Service Charge Paid Successfully via Paystack!'); }} style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', backgroundColor: '#15803d', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}>
              Confirm & Pay ₦10,000.00 &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: SUPERADMIN APARTMENT ALLOCATION MODAL                           */}
      {/* ========================================================================= */}
      {allocateModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '520px', padding: '2rem', boxShadow: '0 25px 50px rgba(0,0,0,0.4)', position: 'relative' }}>
            <button type="button" onClick={() => setAllocateModalOpen(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.25rem' }}>Allocate Residential Flat</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>Assign flat under the statutory 1-apartment quota.</p>

            <form onSubmit={(e) => { e.preventDefault(); setAllocateModalOpen(false); showToast(`Allocated ${selectedHouse}, ${selectedFlatUnit} (${selectedLane}) to ${assigneeName}!`); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Assignee Soldier Name & Rank:</label>
                <input type="text" required value={assigneeName} onChange={(e) => setAssigneeName(e.target.value)} placeholder="e.g. Captain Usman Garba" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Military Service Number:</label>
                <input type="text" required value={assigneeServiceNo} onChange={(e) => setAssigneeServiceNo(e.target.value)} placeholder="e.g. N/14992" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Lane:</label>
                  <select value={selectedLane} onChange={(e) => setSelectedLane(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <option>Lane 1 - General's Blvd</option>
                    <option>Lane 2 - Brigade Way</option>
                    <option>Lane 3 - Command Ave</option>
                    <option>Lane 4 - Victory Cres</option>
                    <option>Lane 5 - Courage Drive</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>House:</label>
                  <input type="text" value={selectedHouse} onChange={(e) => setSelectedHouse(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Unit:</label>
                  <select value={selectedFlatUnit} onChange={(e) => setSelectedFlatUnit(e.target.value)} style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <option>Flat A</option>
                    <option>Flat B</option>
                    <option>Flat C</option>
                    <option>Flat D</option>
                  </select>
                </div>
              </div>

              <button type="submit" style={{ marginTop: '0.5rem', padding: '0.85rem', borderRadius: '8px', backgroundColor: '#15803d', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                Confirm Statutory Flat Allocation &rarr;
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;