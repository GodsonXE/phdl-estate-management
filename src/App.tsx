import React, { useState, useMemo } from 'react';
import {
  Building2, Users, Shield, ShieldCheck, Home, KeyRound, Wrench,
  CreditCard, Bell, FileText, Settings, LogOut, CheckCircle2,
  AlertTriangle, Clock, Search, Filter, Download, Plus, Trash2,
  Edit3, Eye, Printer, Send, RefreshCw, Smartphone, Zap, MapPin,
  ChevronRight, Lock, Check, X, Sliders, DollarSign, UserCheck
} from 'lucide-react';

// ==========================================
// TYPES & DATA STRUCTURES
// ==========================================
type Role = 'super_admin' | 'soldier_landlord' | 'resident_tenant';

interface Apartment {
  id: string;
  lane: number;
  blockNumber: number;
  flatCode: 'A' | 'B' | 'C' | 'D';
  fullCode: string;
  status: 'occupied' | 'vacant' | 'maintenance';
  tenantName?: string;
  tenantPhone?: string;
  landlordName: string;
  landlordServiceNo: string;
  serviceChargeStatus: 'paid' | 'due' | 'overdue';
  electricityMeterNo: string;
}

interface Tenant {
  id: string;
  name: string;
  phone: string;
  email: string;
  apartmentCode: string;
  lane: number;
  landlordName: string;
  kycStatus: 'Verified' | 'Pending' | 'Expired';
  leaseStart: string;
  leaseEnd: string;
  serviceChargeStatus: 'Paid' | 'Due' | 'Overdue';
  monthlyRent: number;
}

interface Landlord {
  id: string;
  serviceNo: string;
  rank: string;
  name: string;
  assignedApartment: string;
  phone: string;
  email: string;
  allocationDeed: 'Verified & Titled' | 'Verified' | 'Under Review';
  singleUnitCompliant: boolean;
  bankAccount: string;
  bankName: string;
}

// Generate the canonical 400 apartments across 8 lanes (100 blocks x 4 flats)
const generate400Apartments = (): Apartment[] => {
  const lanesConfig = [
    { lane: 1, startBlock: 1, endBlock: 9 },    // 9 blocks = 36 flats
    { lane: 2, startBlock: 10, endBlock: 26 },  // 17 blocks = 68 flats
    { lane: 3, startBlock: 27, endBlock: 44 },  // 18 blocks = 72 flats
    { lane: 4, startBlock: 45, endBlock: 62 },  // 18 blocks = 72 flats
    { lane: 5, startBlock: 63, endBlock: 78 },  // 16 blocks = 64 flats
    { lane: 6, startBlock: 79, endBlock: 86 },  // 8 blocks = 32 flats
    { lane: 7, startBlock: 87, endBlock: 93 },  // 7 blocks = 28 flats
    { lane: 8, startBlock: 94, endBlock: 100 }  // 7 blocks = 28 flats (Total: 100 blocks = 400 flats)
  ];

  const ranks = ['Brig Gen', 'Col', 'Lt Col', 'Maj', 'Capt', 'Lt', 'MWO', 'WO', 'Sgt'];
  const firstNames = ['Ibrahim', 'Chinedu', 'Oluwaseun', 'Musa', 'Emeka', 'Babajide', 'Ahmed', 'Tari', 'Danladi', 'Usman'];
  const lastNames = ['Yusuf', 'Okafor', 'Adeyemi', 'Garba', 'Nwosu', 'Bello', 'Eze', 'Abubakar', 'Danjuma', 'Lawal'];
  const tenantFirstNames = ['David', 'Blessing', 'Emmanuel', 'Grace', 'Chiamaka', 'Femi', 'Kelechi', 'Ngozi', 'Victor', 'Fatima'];
  const tenantLastNames = ['Johnson', 'Okoro', 'Balogun', 'Dan-Ali', 'Ogunleye', 'Ibe', 'Kalu', 'Mohammed', 'Aliyu', 'Williams'];

  const flats: Apartment[] = [];

  lanesConfig.forEach(({ lane, startBlock, endBlock }) => {
    for (let b = startBlock; b <= endBlock; b++) {
      (['A', 'B', 'C', 'D'] as const).forEach((flatCode, fIdx) => {
        const seed = (b * 4 + fIdx);
        const isOccupied = seed % 5 !== 0;
        const isMaintenance = seed % 23 === 0;
        const status = isMaintenance ? 'maintenance' : (isOccupied ? 'occupied' : 'vacant');

        const lRank = ranks[(b + fIdx) % ranks.length];
        const lFirst = firstNames[(b * 3 + fIdx) % firstNames.length];
        const lLast = lastNames[(b * 7 + fIdx) % lastNames.length];
        const lName = `${lRank} ${lFirst} ${lLast}`;
        const lSvcNo = `NA/${10000 + (b * 13 + fIdx)}`;

        const tFirst = tenantFirstNames[(seed * 2) % tenantFirstNames.length];
        const tLast = tenantLastNames[(seed * 5) % tenantLastNames.length];
        const tName = `${tFirst} ${tLast}`;

        flats.push({
          id: `apt-L${lane}-B${b}-${flatCode}`,
          lane,
          blockNumber: b,
          flatCode,
          fullCode: `L${lane}-B${b}-${flatCode}`,
          status,
          tenantName: status === 'occupied' ? tName : undefined,
          tenantPhone: status === 'occupied' ? `0803${(1000000 + seed * 97).toString().slice(0, 7)}` : undefined,
          landlordName: lName,
          landlordServiceNo: lSvcNo,
          serviceChargeStatus: seed % 7 === 0 ? 'overdue' : (seed % 4 === 0 ? 'due' : 'paid'),
          electricityMeterNo: `0418${(20000000 + seed * 331).toString().slice(0, 8)}`
        });
      });
    }
  });

  return flats;
};

// ==========================================
// MAIN ROOT COMPONENT
// ==========================================
export const App: React.FC = () => {
  // Navigation & Role State
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentRole, setCurrentRole] = useState<Role>('super_admin');
  const [activeTab, setActiveTab] = useState<string>('apartments');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Master Data State
  const [apartments, setApartments] = useState<Apartment[]>(() => generate400Apartments());
  const [selectedLane, setSelectedLane] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // BulkSMSNigeria State
  const [smsApiKey, setSmsApiKey] = useState('bksms_live_948a274df810bc826e792');
  const [smsSenderId, setSmsSenderId] = useState('PHDL-ESTATE');
  const [smsBalance, setSmsBalance] = useState(48500);
  const [testSmsRecipient, setTestSmsRecipient] = useState('');
  const [testSmsText, setTestSmsText] = useState('PHDL Estate Notice: Routine water supply maintenance scheduled for tomorrow 0900hrs.');

  // Payment Gateway Settings State
  const [paystackConfig, setPaystackConfig] = useState({
    publicKey: 'pk_live_89324792348aef09c',
    secretKey: 'sk_live_9384729384bcda832',
    webhookUrl: 'https://api.phdl-estate.mil.ng/webhooks/paystack',
    isLive: true
  });
  const [flutterwaveConfig, setFlutterwaveConfig] = useState({
    publicKey: 'FLWPUBK_LIVE-847294872934-X',
    secretKey: 'FLWSECK_LIVE-398472983749-X',
    webhookUrl: 'https://api.phdl-estate.mil.ng/webhooks/flutterwave',
    isLive: true
  });

  // Service Charge Tariff Allocation State (₦10,000 base)
  const [tariffs, setTariffs] = useState({
    baseLevy: 10000,
    dieselGenerator: 4500,
    militarySentry: 2500,
    sanitationWaste: 1500,
    waterPumping: 1000,
    streetlightingReserve: 500,
    latePenaltyPercent: 5,
    dueDateDay: 10
  });

  // Tenancy Agreement Form State
  const [agreementData, setAgreementData] = useState({
    landlordName: 'Col. Ibrahim Yusuf (NA/18242)',
    tenantName: 'David Johnson',
    propertyDescription: 'Lane 2, Block 14, Flat B (4-Flat Block)',
    annualRent: 1500000,
    legalFee: 150000,
    cautionFee: 150000,
    commenceDate: '2026-01-01',
    expiryDate: '2026-12-31',
    sentryCurfewClause: true,
    sublettingClause: true
  });

  // Notification Composer State
  const [broadcastChannel, setBroadcastChannel] = useState<'all' | 'sms' | 'email' | 'in_app'>('all');
  const [broadcastTarget, setBroadcastTarget] = useState<string>('all_residents');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');

  // Selected Item Modals
  const [inspectApt, setInspectApt] = useState<Apartment | null>(null);
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [newTenantData, setNewTenantData] = useState({ name: '', phone: '', email: '', flatCode: 'L1-B1-A', rent: 1500000 });

  // Quick Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered Apartments
  const filteredFlats = useMemo(() => {
    return apartments.filter(apt => {
      const matchLane = selectedLane === 'all' || apt.lane === selectedLane;
      const matchStatus = statusFilter === 'all' || apt.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q ||
        apt.fullCode.toLowerCase().includes(q) ||
        (apt.tenantName && apt.tenantName.toLowerCase().includes(q)) ||
        apt.landlordName.toLowerCase().includes(q) ||
        apt.landlordServiceNo.toLowerCase().includes(q);
      return matchLane && matchStatus && matchSearch;
    });
  }, [apartments, selectedLane, statusFilter, searchQuery]);

  // Derived Tenants list from occupied flats
  const tenantsList: Tenant[] = useMemo(() => {
    return apartments
      .filter(a => a.status === 'occupied' && a.tenantName)
      .map((a, idx) => ({
        id: `t-${a.id}`,
        name: a.tenantName!,
        phone: a.tenantPhone || '08030000000',
        email: `${a.tenantName!.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
        apartmentCode: a.fullCode,
        lane: a.lane,
        landlordName: a.landlordName,
        kycStatus: idx % 6 === 0 ? 'Pending' : 'Verified',
        leaseStart: '2026-01-01',
        leaseEnd: '2026-12-31',
        serviceChargeStatus: a.serviceChargeStatus === 'paid' ? 'Paid' : (a.serviceChargeStatus === 'due' ? 'Due' : 'Overdue'),
        monthlyRent: 1500000
      }));
  }, [apartments]);

  // Derived Landlords list
  const landlordsList: Landlord[] = useMemo(() => {
    const list: Landlord[] = [];
    const seen = new Set<string>();
    apartments.forEach(apt => {
      if (!seen.has(apt.landlordServiceNo)) {
        seen.add(apt.landlordServiceNo);
        const rankParts = apt.landlordName.split(' ');
        const rank = rankParts[0];
        const name = rankParts.slice(1).join(' ');
        list.push({
          id: `lld-${apt.landlordServiceNo}`,
          serviceNo: apt.landlordServiceNo,
          rank,
          name,
          assignedApartment: apt.fullCode,
          phone: `0802${Math.floor(1000000 + Math.random() * 9000000)}`,
          email: `${name.toLowerCase().replace(/\s+/g, '.')}@army.mil.ng`,
          allocationDeed: 'Verified & Titled',
          singleUnitCompliant: true,
          bankAccount: '0123456789',
          bankName: 'Zenith Bank'
        });
      }
    });
    return list;
  }, [apartments]);

  // CSV Exporter
  const exportCsv = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filename}.csv successfully`);
  };

  // Render Role Switcher Header Bar
  const renderRoleBanner = () => (
    <div className="bg-slate-900 text-white px-6 py-2.5 flex flex-wrap items-center justify-between border-b border-slate-800 text-xs">
      <div className="flex items-center space-x-3">
        <span className="flex items-center font-bold tracking-wider text-emerald-400 uppercase">
          <Shield className="w-4 h-4 mr-1.5 text-emerald-400" />
          PHDL HQ Command Portal
        </span>
        <span className="text-slate-400">|</span>
        <span className="text-slate-300">Port Harcourt Post-Housing Military Estate • 100 Blocks / 400 Apartments</span>
      </div>
      <div className="flex items-center space-x-3 mt-2 sm:mt-0">
        <span className="text-slate-400">Simulate User Role:</span>
        <button
          onClick={() => { setCurrentRole('super_admin'); setActiveTab('apartments'); showToast('Switched to Super Admin View'); }}
          className={`px-3 py-1 rounded font-semibold transition ${currentRole === 'super_admin' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
        >
          Super Admin HQ
        </button>
        <button
          onClick={() => { setCurrentRole('soldier_landlord'); setActiveTab('landlord_property'); showToast('Switched to Soldier Landlord View'); }}
          className={`px-3 py-1 rounded font-semibold transition ${currentRole === 'soldier_landlord' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
        >
          Soldier Landlord
        </button>
        <button
          onClick={() => { setCurrentRole('resident_tenant'); setActiveTab('tenant_bills'); showToast('Switched to Resident Tenant View'); }}
          className={`px-3 py-1 rounded font-semibold transition ${currentRole === 'resident_tenant' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
        >
          Resident Tenant
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      {/* Top Telemetry / Role Switch Bar */}
      {renderRoleBanner()}

      {/* Main App Layout */}
      <div className="flex-1 flex flex-row overflow-hidden">
        {/* SIDEBAR - Dark Military Green */}
        <aside className="w-64 bg-[#05140b] text-slate-200 flex flex-col border-r border-emerald-950/60 shadow-xl shrink-0">
          <div className="p-5 border-b border-emerald-900/40">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-800/80 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold text-lg shadow-inner">
                <Building2 className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <h1 className="font-bold text-base text-white tracking-wide leading-tight">PHDL ESTATE</h1>
                <p className="text-xs text-emerald-400/90 font-medium">Command & Facility Hub</p>
              </div>
            </div>
            <div className="mt-3 px-2.5 py-1 rounded bg-emerald-950/90 border border-emerald-800/50 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Current View:</span>
              <span className="font-semibold text-emerald-300 capitalize">
                {currentRole.replace('_', ' ')}
              </span>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto text-sm">
            {currentRole === 'super_admin' && (
              <>
                <div className="px-3 py-1 text-[11px] font-bold text-emerald-500/80 uppercase tracking-wider">
                  Estate Master Registry
                </div>
                <button
                  onClick={() => setActiveTab('apartments')}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left font-medium transition ${activeTab === 'apartments' ? 'bg-emerald-800/90 text-white shadow-md' : 'text-slate-300 hover:bg-emerald-950/80 hover:text-white'}`}
                >
                  <Home className="w-4 h-4 mr-3 text-emerald-400" />
                  All 400 Apartments (8 Lanes)
                </button>
                <button
                  onClick={() => setActiveTab('tenants')}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left font-medium transition ${activeTab === 'tenants' ? 'bg-emerald-800/90 text-white shadow-md' : 'text-slate-300 hover:bg-emerald-950/80 hover:text-white'}`}
                >
                  <Users className="w-4 h-4 mr-3 text-emerald-400" />
                  Estate Residents & Tenants
                </button>
                <button
                  onClick={() => setActiveTab('landlords')}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left font-medium transition ${activeTab === 'landlords' ? 'bg-emerald-800/90 text-white shadow-md' : 'text-slate-300 hover:bg-emerald-950/80 hover:text-white'}`}
                >
                  <ShieldCheck className="w-4 h-4 mr-3 text-emerald-400" />
                  Soldier Landlords Roster
                </button>

                <div className="pt-3 px-3 py-1 text-[11px] font-bold text-emerald-500/80 uppercase tracking-wider">
                  Financials & Operations
                </div>
                <button
                  onClick={() => setActiveTab('service_charges')}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left font-medium transition ${activeTab === 'service_charges' ? 'bg-emerald-800/90 text-white shadow-md' : 'text-slate-300 hover:bg-emerald-950/80 hover:text-white'}`}
                >
                  <DollarSign className="w-4 h-4 mr-3 text-emerald-400" />
                  Service Charge Setup (₦10k)
                </button>
                <button
                  onClick={() => setActiveTab('gateways')}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left font-medium transition ${activeTab === 'gateways' ? 'bg-emerald-800/90 text-white shadow-md' : 'text-slate-300 hover:bg-emerald-950/80 hover:text-white'}`}
                >
                  <CreditCard className="w-4 h-4 mr-3 text-emerald-400" />
                  Payment & SMS Gateways
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left font-medium transition ${activeTab === 'notifications' ? 'bg-emerald-800/90 text-white shadow-md' : 'text-slate-300 hover:bg-emerald-950/80 hover:text-white'}`}
                >
                  <Bell className="w-4 h-4 mr-3 text-emerald-400" />
                  SMS & Broadcast Composer
                </button>
                <button
                  onClick={() => setActiveTab('tenancy_agreement')}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left font-medium transition ${activeTab === 'tenancy_agreement' ? 'bg-emerald-800/90 text-white shadow-md' : 'text-slate-300 hover:bg-emerald-950/80 hover:text-white'}`}
                >
                  <FileText className="w-4 h-4 mr-3 text-emerald-400" />
                  Tenancy Legal Generator
                </button>
              </>
            )}

            {currentRole === 'soldier_landlord' && (
              <>
                <div className="px-3 py-1 text-[11px] font-bold text-emerald-500/80 uppercase tracking-wider">
                  Landlord Controls
                </div>
                <button
                  onClick={() => setActiveTab('landlord_property')}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left font-medium transition ${activeTab === 'landlord_property' ? 'bg-emerald-800/90 text-white shadow-md' : 'text-slate-300 hover:bg-emerald-950/80 hover:text-white'}`}
                >
                  <Home className="w-4 h-4 mr-3 text-emerald-400" />
                  My Allocated Apartment
                </button>
                <button
                  onClick={() => setActiveTab('tenancy_agreement')}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left font-medium transition ${activeTab === 'tenancy_agreement' ? 'bg-emerald-800/90 text-white shadow-md' : 'text-slate-300 hover:bg-emerald-950/80 hover:text-white'}`}
                >
                  <FileText className="w-4 h-4 mr-3 text-emerald-400" />
                  Tenancy Agreement Generator
                </button>
                <button
                  onClick={() => setActiveTab('landlord_remittance')}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left font-medium transition ${activeTab === 'landlord_remittance' ? 'bg-emerald-800/90 text-white shadow-md' : 'text-slate-300 hover:bg-emerald-950/80 hover:text-white'}`}
                >
                  <CreditCard className="w-4 h-4 mr-3 text-emerald-400" />
                  Rent Remittances & Statements
                </button>
              </>
            )}

            {currentRole === 'resident_tenant' && (
              <>
                <div className="px-3 py-1 text-[11px] font-bold text-emerald-500/80 uppercase tracking-wider">
                  Resident Services
                </div>
                <button
                  onClick={() => setActiveTab('tenant_bills')}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left font-medium transition ${activeTab === 'tenant_bills' ? 'bg-emerald-800/90 text-white shadow-md' : 'text-slate-300 hover:bg-emerald-950/80 hover:text-white'}`}
                >
                  <CreditCard className="w-4 h-4 mr-3 text-emerald-400" />
                  Pay Service Charge (₦10,000)
                </button>
                <button
                  onClick={() => setActiveTab('tenant_electricity')}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left font-medium transition ${activeTab === 'tenant_electricity' ? 'bg-emerald-800/90 text-white shadow-md' : 'text-slate-300 hover:bg-emerald-950/80 hover:text-white'}`}
                >
                  <Zap className="w-4 h-4 mr-3 text-emerald-400" />
                  STS Electricity Meter Token
                </button>
                <button
                  onClick={() => setActiveTab('tenant_visitor_pass')}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left font-medium transition ${activeTab === 'tenant_visitor_pass' ? 'bg-emerald-800/90 text-white shadow-md' : 'text-slate-300 hover:bg-emerald-950/80 hover:text-white'}`}
                >
                  <KeyRound className="w-4 h-4 mr-3 text-emerald-400" />
                  Sentry Gate Visitor Pass
                </button>
                <button
                  onClick={() => setActiveTab('tenant_maintenance')}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left font-medium transition ${activeTab === 'tenant_maintenance' ? 'bg-emerald-800/90 text-white shadow-md' : 'text-slate-300 hover:bg-emerald-950/80 hover:text-white'}`}
                >
                  <Wrench className="w-4 h-4 mr-3 text-emerald-400" />
                  Facility Maintenance Request
                </button>
              </>
            )}

            <div className="pt-3 px-3 py-1 text-[11px] font-bold text-emerald-500/80 uppercase tracking-wider">
              Account
            </div>
            <button
              onClick={() => setActiveTab('user_settings')}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg text-left font-medium transition ${activeTab === 'user_settings' ? 'bg-emerald-800/90 text-white shadow-md' : 'text-slate-300 hover:bg-emerald-950/80 hover:text-white'}`}
            >
              <Settings className="w-4 h-4 mr-3 text-emerald-400" />
              User Profile & Settings
            </button>
          </nav>

          <div className="p-4 border-t border-emerald-900/50 bg-[#030d07] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                {currentRole === 'super_admin' ? 'HQ' : (currentRole === 'soldier_landlord' ? 'SL' : 'RT')}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">
                  {currentRole === 'super_admin' ? 'HQ Admin Officer' : (currentRole === 'soldier_landlord' ? 'Col. I. Yusuf' : 'David Johnson')}
                </p>
                <p className="text-[10px] text-emerald-400 truncate">
                  {currentRole === 'super_admin' ? 'Command Level 1' : (currentRole === 'soldier_landlord' ? 'NA/18242' : 'L2-B14-B')}
                </p>
              </div>
            </div>
            <button
              onClick={() => showToast('Session Locked')}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-emerald-900/50 rounded"
              title="Logout / Lock"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA - Crisp White Background & Dark Slate */}
        <main className="flex-1 bg-white flex flex-col overflow-y-auto">
          {toastMessage && (
            <div className="fixed top-12 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl border border-emerald-500/40 flex items-center space-x-3 text-sm animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="font-medium">{toastMessage}</span>
            </div>
          )}

          <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-sm">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {activeTab === 'apartments' && '400 Apartments Directory (8 Zoned Lanes)'}
                {activeTab === 'tenants' && 'Estate Residents & Tenants Master List'}
                {activeTab === 'landlords' && 'Soldier Landlords Master Allocation Roster'}
                {activeTab === 'service_charges' && 'Service Charge Setup & Tariff Breakdown'}
                {activeTab === 'gateways' && 'API Gateways (BulkSMSNigeria, Paystack, Flutterwave)'}
                {activeTab === 'notifications' && 'Broadcast & SMS Notification Composer'}
                {activeTab === 'tenancy_agreement' && 'Official Tenancy Agreement Legal Generator'}
                {activeTab === 'user_settings' && 'User Account & Security Settings'}
                {activeTab === 'landlord_property' && 'Landlord Property Allocation Details'}
                {activeTab === 'landlord_remittance' && 'Rent Remittances & Financial Records'}
                {activeTab === 'tenant_bills' && 'Pay Service Charge (₦10,000 / Month)'}
                {activeTab === 'tenant_electricity' && 'STS Prepaid Electricity Token Recharging'}
                {activeTab === 'tenant_visitor_pass' && 'Single-Use Sentry Gate Visitor QR Pass'}
                {activeTab === 'tenant_maintenance' && 'Facility Maintenance & Work Order Dispatch'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Port Harcourt Post-Housing Development Limited (PHDL) • Operational Management Console
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                Estate Telemetry: Normal
              </div>
            </div>
          </header>

          <div className="p-8 space-y-6 flex-1">
            {/* MODULE 1: ALL 400 APARTMENTS (8 LANES) */}
            {activeTab === 'apartments' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase">Total Inventory</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">400 Flats</p>
                    <p className="text-xs text-slate-500 mt-0.5">100 Blocks across 8 Lanes</p>
                  </div>
                  <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 shadow-sm">
                    <p className="text-xs font-semibold text-emerald-800 uppercase">Occupied Flats</p>
                    <p className="text-2xl font-bold text-emerald-900 mt-1">
                      {apartments.filter(a => a.status === 'occupied').length}
                    </p>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      {Math.round((apartments.filter(a => a.status === 'occupied').length / 400) * 100)}% Occupancy Rate
                    </p>
                  </div>
                  <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 shadow-sm">
                    <p className="text-xs font-semibold text-blue-800 uppercase">Available / Vacant</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">
                      {apartments.filter(a => a.status === 'vacant').length}
                    </p>
                    <p className="text-xs text-blue-700 mt-0.5">Ready for immediate tenancy</p>
                  </div>
                  <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 shadow-sm">
                    <p className="text-xs font-semibold text-amber-800 uppercase">Under Maintenance</p>
                    <p className="text-2xl font-bold text-amber-900 mt-1">
                      {apartments.filter(a => a.status === 'maintenance').length}
                    </p>
                    <p className="text-xs text-amber-700 mt-0.5">Facility renovation active</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative w-64">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search Flat code, Tenant, Landlord..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center space-x-1 bg-white border border-slate-300 p-1 rounded-lg text-xs font-medium">
                      <button
                        onClick={() => setSelectedLane('all')}
                        className={`px-2.5 py-1 rounded ${selectedLane === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                      >
                        All 8 Lanes
                      </button>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(l => (
                        <button
                          key={l}
                          onClick={() => setSelectedLane(l)}
                          className={`px-2 py-1 rounded ${selectedLane === l ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                        >
                          Lane {l}
                        </button>
                      ))}
                    </div>

                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      className="bg-white border border-slate-300 text-slate-700 text-xs rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="occupied">Occupied Only</option>
                      <option value="vacant">Available / Vacant</option>
                      <option value="maintenance">Under Maintenance</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => exportCsv(
                        'PHDL_400_Apartments_Directory',
                        ['Flat Code', 'Lane', 'Block', 'Flat', 'Status', 'Tenant Name', 'Tenant Phone', 'Landlord', 'Landlord Service No', 'Service Charge Status', 'Electricity Meter'],
                        filteredFlats.map(f => [
                          f.fullCode, f.lane, f.blockNumber, f.flatCode, f.status,
                          f.tenantName || 'N/A', f.tenantPhone || 'N/A', f.landlordName, f.landlordServiceNo,
                          f.serviceChargeStatus, f.electricityMeterNo
                        ])
                      )}
                      className="px-3.5 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 flex items-center shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                      Export Directory CSV
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span>Showing {filteredFlats.length} of 400 total apartments</span>
                    <span>100 Blocks Total • 4 Flats Per Block (Flats A, B, C, D)</span>
                  </div>
                  <div className="max-h-[520px] overflow-y-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0 z-10 border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Flat Code</th>
                          <th className="py-3 px-4">Lane / Location</th>
                          <th className="py-3 px-4">Occupancy Status</th>
                          <th className="py-3 px-4">Current Resident Tenant</th>
                          <th className="py-3 px-4">Soldier Landlord (Allocated)</th>
                          <th className="py-3 px-4">Service Charge (₦10k)</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredFlats.slice(0, 100).map(apt => (
                          <tr key={apt.id} className="hover:bg-slate-50 transition">
                            <td className="py-3 px-4 font-mono font-bold text-slate-900">
                              {apt.fullCode}
                            </td>
                            <td className="py-3 px-4 text-slate-600">
                              Lane {apt.lane}, Block {apt.blockNumber}, Flat {apt.flatCode}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                apt.status === 'occupied' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                apt.status === 'vacant' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}>
                                {apt.status === 'occupied' ? 'Occupied' : apt.status === 'vacant' ? 'Vacant / Available' : 'Maintenance'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {apt.tenantName ? (
                                <div>
                                  <p className="font-semibold text-slate-900">{apt.tenantName}</p>
                                  <p className="text-[11px] text-slate-500">{apt.tenantPhone}</p>
                                </div>
                              ) : (
                                <span className="text-slate-400 italic">No Active Tenant</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-medium text-slate-800">{apt.landlordName}</p>
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">
                                {apt.landlordServiceNo}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                apt.serviceChargeStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                                apt.serviceChargeStatus === 'due' ? 'bg-amber-100 text-amber-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {apt.serviceChargeStatus.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setInspectApt(apt)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-[11px] transition"
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredFlats.length > 100 && (
                    <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
                      Showing first 100 matching rows. Use filters above to refine your search across all 400 flats.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MODULE 2: ESTATE RESIDENTS / TENANTS MASTER LIST */}
            {activeTab === 'tenants' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Resident Tenants Registry</h3>
                    <p className="text-xs text-slate-500">Verified civilians and military families residing in PHDL Estate</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowAddTenantModal(true)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center shadow-sm"
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      Onboard New Tenant
                    </button>
                    <button
                      onClick={() => exportCsv(
                        'PHDL_Resident_Tenants_List',
                        ['Tenant Name', 'Phone', 'Email', 'Apartment', 'Lane', 'Landlord', 'KYC Status', 'Lease End', 'Service Charge Status'],
                        tenantsList.map(t => [t.name, t.phone, t.email, t.apartmentCode, t.lane, t.landlordName, t.kycStatus, t.leaseEnd, t.serviceChargeStatus])
                      )}
                      className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center shadow-sm"
                    >
                      <Download className="w-4 h-4 mr-1.5" />
                      Export CSV
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Tenant Name</th>
                        <th className="py-3 px-4">Contact Info</th>
                        <th className="py-3 px-4">Assigned Flat</th>
                        <th className="py-3 px-4">Soldier Landlord</th>
                        <th className="py-3 px-4">KYC Status</th>
                        <th className="py-3 px-4">Lease Expiry</th>
                        <th className="py-3 px-4">Service Charge</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tenantsList.slice(0, 50).map(tenant => (
                        <tr key={tenant.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-4 font-bold text-slate-900 flex items-center">
                            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center mr-2.5 text-xs">
                              {tenant.name.slice(0, 1)}
                            </div>
                            {tenant.name}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            <div>{tenant.phone}</div>
                            <div className="text-[10px] text-slate-400">{tenant.email}</div>
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-emerald-800">
                            {tenant.apartmentCode}
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            {tenant.landlordName}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tenant.kycStatus === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {tenant.kycStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {tenant.leaseEnd}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tenant.serviceChargeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {tenant.serviceChargeStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-1">
                            <button
                              onClick={() => {
                                setTestSmsRecipient(tenant.phone);
                                setActiveTab('notifications');
                                showToast(`Prepared direct SMS broadcast for ${tenant.name}`);
                              }}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded text-[10px]"
                            >
                              Send SMS
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
                    Showing 50 of {tenantsList.length} total active residents
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 3: SOLDIER LANDLORDS MASTER DIRECTORY */}
            {activeTab === 'landlords' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Soldier Landlords Master Allocation Roster</h3>
                    <p className="text-xs text-slate-500">
                      Enforcing strict 1-Apartment Statutory Allocation Limit for Military Personnel
                    </p>
                  </div>
                  <button
                    onClick={() => exportCsv(
                      'PHDL_Soldier_Landlords_Roster',
                      ['Service Number', 'Rank', 'Full Name', 'Assigned Apartment', 'Phone', 'Email', 'Allocation Deed', '1-Unit Limit Compliant', 'Bank Account'],
                      landlordsList.map(l => [l.serviceNo, l.rank, l.name, l.assignedApartment, l.phone, l.email, l.allocationDeed, l.singleUnitCompliant ? 'YES' : 'NO', `${l.bankName} - ${l.bankAccount}`])
                    )}
                    className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center shadow-sm"
                  >
                    <Download className="w-4 h-4 mr-1.5" />
                    Export Landlords CSV
                  </button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Service Number</th>
                        <th className="py-3 px-4">Military Officer</th>
                        <th className="py-3 px-4">Allocated Property</th>
                        <th className="py-3 px-4">Phone & Email</th>
                        <th className="py-3 px-4">Statutory 1-Flat Limit</th>
                        <th className="py-3 px-4">Deed Status</th>
                        <th className="py-3 px-4">Remittance Bank</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {landlordsList.map(lld => (
                        <tr key={lld.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                            {lld.serviceNo}
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-slate-900">{lld.rank} {lld.name}</p>
                            <span className="text-[10px] text-slate-400">Nigerian Armed Forces</span>
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                            {lld.assignedApartment}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            <div>{lld.phone}</div>
                            <div className="text-[10px] text-slate-400">{lld.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px] flex items-center w-fit">
                              <Check className="w-3 h-3 mr-1" />
                              Compliant (1 Unit)
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold text-[10px]">
                              {lld.allocationDeed}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-700 text-[11px]">
                            {lld.bankName} • {lld.bankAccount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MODULE 4: SERVICE CHARGE SETUP & TARIFF CONTROL */}
            {activeTab === 'service_charges' && (
              <div className="space-y-6">
                <div className="bg-emerald-900 text-white p-6 rounded-2xl shadow-md flex flex-wrap items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">Standard Monthly Service Charge: ₦{tariffs.baseLevy.toLocaleString()}</h3>
                    <p className="text-xs text-emerald-200 mt-1">
                      Mandatory statutory maintenance levy billed to all 400 flats on the 1st of every month
                    </p>
                  </div>
                  <button
                    onClick={() => showToast('Tariff Configuration Saved & Broadcasted')}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-lg text-xs transition"
                  >
                    Save & Update All Tariffs
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b pb-2">
                      Levy Component Breakdown (₦{tariffs.baseLevy.toLocaleString()})
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span className="text-slate-700">Central Diesel Generator & Fueling</span>
                          <span className="text-emerald-800">₦{tariffs.dieselGenerator.toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min="1000"
                          max="8000"
                          step="100"
                          value={tariffs.dieselGenerator}
                          onChange={e => setTariffs({ ...tariffs, dieselGenerator: Number(e.target.value) })}
                          className="w-full accent-emerald-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span className="text-slate-700">24/7 Armed Military Sentry & Gate Access</span>
                          <span className="text-emerald-800">₦{tariffs.militarySentry.toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min="1000"
                          max="5000"
                          step="100"
                          value={tariffs.militarySentry}
                          onChange={e => setTariffs({ ...tariffs, militarySentry: Number(e.target.value) })}
                          className="w-full accent-emerald-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span className="text-slate-700">Sanitation, Waste Evacuation & Landscaping</span>
                          <span className="text-emerald-800">₦{tariffs.sanitationWaste.toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min="500"
                          max="3000"
                          step="100"
                          value={tariffs.sanitationWaste}
                          onChange={e => setTariffs({ ...tariffs, sanitationWaste: Number(e.target.value) })}
                          className="w-full accent-emerald-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span className="text-slate-700">Water Treatment & Industrial Pumping Plant</span>
                          <span className="text-emerald-800">₦{tariffs.waterPumping.toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min="500"
                          max="3000"
                          step="100"
                          value={tariffs.waterPumping}
                          onChange={e => setTariffs({ ...tariffs, waterPumping: Number(e.target.value) })}
                          className="w-full accent-emerald-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span className="text-slate-700">Streetlighting & Infrastructure Sinking Fund</span>
                          <span className="text-emerald-800">₦{tariffs.streetlightingReserve.toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min="200"
                          max="2000"
                          step="100"
                          value={tariffs.streetlightingReserve}
                          onChange={e => setTariffs({ ...tariffs, streetlightingReserve: Number(e.target.value) })}
                          className="w-full accent-emerald-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b pb-2">
                      Billing Cycles & Default Penalties
                    </h4>

                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Monthly Billing Cutoff Day</label>
                        <input
                          type="number"
                          value={tariffs.dueDateDay}
                          onChange={e => setTariffs({ ...tariffs, dueDateDay: Number(e.target.value) })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold"
                        />
                        <p className="text-[11px] text-slate-500 mt-1">
                          Invoices are automatically dispatched via SMS on the 1st, overdue by the {tariffs.dueDateDay}th.
                        </p>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Late Payment Surcharge (%)</label>
                        <input
                          type="number"
                          value={tariffs.latePenaltyPercent}
                          onChange={e => setTariffs({ ...tariffs, latePenaltyPercent: Number(e.target.value) })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold"
                        />
                        <p className="text-[11px] text-slate-500 mt-1">
                          A {tariffs.latePenaltyPercent}% surcharge (₦{(tariffs.baseLevy * tariffs.latePenaltyPercent / 100).toLocaleString()}) applies to delinquent accounts.
                        </p>
                      </div>

                      <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                        <p className="font-bold text-emerald-900">Total Monthly Estate Revenue Yield</p>
                        <p className="text-xl font-extrabold text-emerald-800 mt-1">
                          ₦{(400 * tariffs.baseLevy).toLocaleString()} / month
                        </p>
                        <p className="text-[11px] text-emerald-700 mt-0.5">Based on 400 total apartment units in PHDL</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 5: API GATEWAYS */}
            {activeTab === 'gateways' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* BulkSMSNigeria Settings */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center space-x-2 border-b pb-3">
                      <Smartphone className="w-5 h-5 text-emerald-600" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">BulkSMSNigeria Gateway</h4>
                        <p className="text-[11px] text-slate-500">Live SMS Dispatcher & Token Credit</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">API Token Key</label>
                        <input
                          type="password"
                          value={smsApiKey}
                          onChange={e => setSmsApiKey(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Approved Sender ID</label>
                        <input
                          type="text"
                          maxLength={11}
                          value={smsSenderId}
                          onChange={e => setSmsSenderId(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-bold uppercase"
                        />
                        <p className="text-[10px] text-slate-400 mt-0.5">Max 11 alphanumeric characters</p>
                      </div>

                      <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
                        <span className="text-[11px] text-emerald-700 font-semibold">Live Wallet Balance:</span>
                        <p className="text-lg font-bold text-emerald-900 mt-0.5">₦{smsBalance.toLocaleString()} ({Math.floor(smsBalance / 3.4)} SMS)</p>
                      </div>

                      <div className="pt-2 border-t">
                        <label className="block text-slate-700 font-semibold mb-1">Quick Test SMS Dispatch</label>
                        <input
                          type="text"
                          placeholder="0803XXXXXXX"
                          value={testSmsRecipient}
                          onChange={e => setTestSmsRecipient(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded mb-2 text-xs"
                        />
                        <button
                          onClick={() => {
                            if (!testSmsRecipient) {
                              showToast('Please enter a phone number to test');
                              return;
                            }
                            setSmsBalance(prev => prev - 5);
                            showToast(`Test SMS dispatched to ${testSmsRecipient} via BulkSMSNigeria!`);
                          }}
                          className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded text-xs transition"
                        >
                          Send Test SMS (₦3.50)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Paystack Gateway */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center space-x-2 border-b pb-3">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Paystack Gateway</h4>
                        <p className="text-[11px] text-slate-500">Service charge & electricity payments</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Public Key</label>
                        <input
                          type="text"
                          value={paystackConfig.publicKey}
                          onChange={e => setPaystackConfig({ ...paystackConfig, publicKey: e.target.value })}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono text-[11px]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Secret Key</label>
                        <input
                          type="password"
                          value={paystackConfig.secretKey}
                          onChange={e => setPaystackConfig({ ...paystackConfig, secretKey: e.target.value })}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono text-[11px]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Webhook URL</label>
                        <input
                          type="text"
                          value={paystackConfig.webhookUrl}
                          readOnly
                          className="w-full p-2 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] text-slate-600"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="font-semibold text-slate-700">Environment Mode</span>
                        <button
                          onClick={() => {
                            setPaystackConfig({ ...paystackConfig, isLive: !paystackConfig.isLive });
                            showToast(`Paystack switched to ${!paystackConfig.isLive ? 'LIVE' : 'TEST'} mode`);
                          }}
                          className={`px-3 py-1 rounded text-xs font-bold ${paystackConfig.isLive ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'}`}
                        >
                          {paystackConfig.isLive ? 'LIVE PRODUCTION' : 'TEST SANDBOX'}
                        </button>
                      </div>

                      <button
                        onClick={() => showToast('Paystack credentials saved & validated')}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded text-xs transition"
                      >
                        Save Paystack Settings
                      </button>
                    </div>
                  </div>

                  {/* Flutterwave Gateway */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center space-x-2 border-b pb-3">
                      <CreditCard className="w-5 h-5 text-amber-600" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Flutterwave Gateway</h4>
                        <p className="text-[11px] text-slate-500">Secondary / Fallback payment provider</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Public Key</label>
                        <input
                          type="text"
                          value={flutterwaveConfig.publicKey}
                          onChange={e => setFlutterwaveConfig({ ...flutterwaveConfig, publicKey: e.target.value })}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono text-[11px]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Secret Key</label>
                        <input
                          type="password"
                          value={flutterwaveConfig.secretKey}
                          onChange={e => setFlutterwaveConfig({ ...flutterwaveConfig, secretKey: e.target.value })}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono text-[11px]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Webhook URL</label>
                        <input
                          type="text"
                          value={flutterwaveConfig.webhookUrl}
                          readOnly
                          className="w-full p-2 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] text-slate-600"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="font-semibold text-slate-700">Environment Mode</span>
                        <button
                          onClick={() => {
                            setFlutterwaveConfig({ ...flutterwaveConfig, isLive: !flutterwaveConfig.isLive });
                            showToast(`Flutterwave switched to ${!flutterwaveConfig.isLive ? 'LIVE' : 'TEST'} mode`);
                          }}
                          className={`px-3 py-1 rounded text-xs font-bold ${flutterwaveConfig.isLive ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'}`}
                        >
                          {flutterwaveConfig.isLive ? 'LIVE PRODUCTION' : 'TEST SANDBOX'}
                        </button>
                      </div>

                      <button
                        onClick={() => showToast('Flutterwave credentials saved & validated')}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded text-xs transition"
                      >
                        Save Flutterwave Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 6: NOTIFICATIONS & BROADCASTS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-base font-bold text-slate-900 border-b pb-2">Compose Multi-Channel Estate Notice</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Dispatch Channels</label>
                        <select
                          value={broadcastChannel}
                          onChange={e => setBroadcastChannel(e.target.value as any)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold"
                        >
                          <option value="all">All Channels (SMS, Email & In-App Notice)</option>
                          <option value="sms">Bulk SMS Nigeria Only (Phone Texts)</option>
                          <option value="email">Email Broadcast Only</option>
                          <option value="in_app">In-App Notice Board Only</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
                        <select
                          value={broadcastTarget}
                          onChange={e => setBroadcastTarget(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold"
                        >
                          <option value="all_residents">All 400 Apartment Residents</option>
                          <option value="lane_1">Lane 1 Residents Only (36 flats)</option>
                          <option value="lane_2">Lane 2 Residents Only (68 flats)</option>
                          <option value="lane_3">Lane 3 Residents Only (72 flats)</option>
                          <option value="lane_4">Lane 4 Residents Only (72 flats)</option>
                          <option value="landlords_only">Soldier Landlords Only (100 Officers)</option>
                          <option value="service_charge_defaulters">Service Charge Defaulters Only</option>
                        </select>
                      </div>
                    </div>

                    <div className="text-xs space-y-2">
                      <label className="block font-semibold text-slate-700">Notice Headline / Subject</label>
                      <input
                        type="text"
                        placeholder="e.g. Scheduled Generator Power Hours Notice"
                        value={broadcastTitle}
                        onChange={e => setBroadcastTitle(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
                      />
                    </div>

                    <div className="text-xs space-y-2">
                      <div className="flex justify-between font-semibold text-slate-700">
                        <span>Message Body (SMS & Notice Content)</span>
                        <span className="text-slate-500 font-mono">
                          {broadcastBody.length} chars ({Math.ceil(broadcastBody.length / 160) || 1} SMS Page)
                        </span>
                      </div>
                      <textarea
                        rows={5}
                        placeholder="Type the official communication here..."
                        value={broadcastBody}
                        onChange={e => setBroadcastBody(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-xs"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <p className="text-[11px] text-slate-500">Sender ID: <strong className="text-emerald-700">PHDL-ESTATE</strong></p>
                      <button
                        onClick={() => {
                          if (!broadcastBody) {
                            showToast('Please type a message body before sending');
                            return;
                          }
                          showToast(`Broadcast dispatched successfully to ${broadcastTarget.replace('_', ' ')}!`);
                          setBroadcastBody('');
                          setBroadcastTitle('');
                        }}
                        className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs flex items-center shadow-md transition"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Dispatch Notice Now
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wide border-b pb-2">Quick Standard Templates</h4>
                    <div className="space-y-2.5">
                      <button
                        onClick={() => {
                          setBroadcastTitle('Monthly Service Charge Billing Advisory');
                          setBroadcastBody('Dear Resident, your ₦10,000 PHDL Estate monthly service charge for this month is now due. Please settle via the resident portal before the 10th to avoid late fees.');
                        }}
                        className="w-full text-left p-3 bg-white border border-slate-200 rounded-lg hover:border-emerald-500 transition"
                      >
                        <p className="font-bold text-slate-900">Service Charge Reminder</p>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">Monthly ₦10,000 levy reminder with payment deadline.</p>
                      </button>

                      <button
                        onClick={() => {
                          setBroadcastTitle('Sentry Security & 10 PM Curfew Advisory');
                          setBroadcastBody('Security Alert: In line with PHDL estate security protocol, all visitor gate passes must be pre-generated on the resident portal. Pedestrian gate curfew remains 2200hrs.');
                        }}
                        className="w-full text-left p-3 bg-white border border-slate-200 rounded-lg hover:border-emerald-500 transition"
                      >
                        <p className="font-bold text-slate-900">Gate Pass & Curfew Advisory</p>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">Armed sentry check and visitor pass rules.</p>
                      </button>

                      <button
                        onClick={() => {
                          setBroadcastTitle('Water Treatment Plant Maintenance Schedule');
                          setBroadcastBody('Notice: Pumping from the central water treatment facility will be temporarily suspended tomorrow between 1000hrs and 1300hrs for routine filter servicing.');
                        }}
                        className="w-full text-left p-3 bg-white border border-slate-200 rounded-lg hover:border-emerald-500 transition"
                      >
                        <p className="font-bold text-slate-900">Water Plant Maintenance</p>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">Pumping suspension & maintenance notice.</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 7: TENANCY AGREEMENT LEGAL GENERATOR */}
            {activeTab === 'tenancy_agreement' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
                    <h3 className="text-base font-bold text-slate-900 border-b pb-2">Tenancy Contract Parameters</h3>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Landlord (Military Officer)</label>
                      <input
                        type="text"
                        value={agreementData.landlordName}
                        onChange={e => setAgreementData({ ...agreementData, landlordName: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Resident Tenant Full Name</label>
                      <input
                        type="text"
                        value={agreementData.tenantName}
                        onChange={e => setAgreementData({ ...agreementData, tenantName: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Property Description</label>
                      <input
                        type="text"
                        value={agreementData.propertyDescription}
                        onChange={e => setAgreementData({ ...agreementData, propertyDescription: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Annual Rent (₦)</label>
                        <input
                          type="number"
                          value={agreementData.annualRent}
                          onChange={e => setAgreementData({ ...agreementData, annualRent: Number(e.target.value) })}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Caution Deposit (₦)</label>
                        <input
                          type="number"
                          value={agreementData.cautionFee}
                          onChange={e => setAgreementData({ ...agreementData, cautionFee: Number(e.target.value) })}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Commencement Date</label>
                        <input
                          type="date"
                          value={agreementData.commenceDate}
                          onChange={e => setAgreementData({ ...agreementData, commenceDate: e.target.value })}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Expiry Date</label>
                        <input
                          type="date"
                          value={agreementData.expiryDate}
                          onChange={e => setAgreementData({ ...agreementData, expiryDate: e.target.value })}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t">
                      <label className="flex items-center space-x-2 text-slate-700">
                        <input
                          type="checkbox"
                          checked={agreementData.sublettingClause}
                          onChange={e => setAgreementData({ ...agreementData, sublettingClause: e.target.checked })}
                          className="rounded text-emerald-600"
                        />
                        <span>Enforce Strict No-Subletting Clause</span>
                      </label>
                      <label className="flex items-center space-x-2 text-slate-700">
                        <input
                          type="checkbox"
                          checked={agreementData.sentryCurfewClause}
                          onChange={e => setAgreementData({ ...agreementData, sentryCurfewClause: e.target.checked })}
                          className="rounded text-emerald-600"
                        />
                        <span>Enforce Military Sentry & ₦10k Service Charge</span>
                      </label>
                    </div>

                    <button
                      onClick={() => window.print()}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs flex items-center justify-center shadow transition"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print / Save Legal Agreement
                    </button>
                  </div>

                  <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-slate-300 shadow-md text-slate-800 space-y-4 font-serif text-xs leading-relaxed">
                    <div className="text-center border-b-2 border-slate-900 pb-4">
                      <div className="flex justify-center mb-1">
                        <Shield className="w-8 h-8 text-emerald-900" />
                      </div>
                      <h2 className="text-base font-bold text-slate-900 uppercase tracking-widest">
                        PORT HARCOURT POST-HOUSING DEVELOPMENT LIMITED (PHDL)
                      </h2>
                      <p className="text-[11px] font-sans font-semibold text-slate-600">
                        DIRECTORATE OF ARMY POST-HOUSING SCHEME • RESIDENTIAL TENANCY INDENTURE
                      </p>
                    </div>

                    <p>
                      <strong>THIS TENANCY AGREEMENT</strong> is made this <strong>{agreementData.commenceDate}</strong> BETWEEN{' '}
                      <strong>{agreementData.landlordName}</strong> (hereinafter referred to as the <em>"LANDLORD"</em>) of the one part, AND{' '}
                      <strong>{agreementData.tenantName}</strong> (hereinafter referred to as the <em>"TENANT"</em>) of the other part.
                    </p>

                    <div>
                      <p className="font-bold font-sans uppercase text-[11px] text-slate-900">1. DEMISE AND CONSIDERATION:</p>
                      <p className="mt-0.5">
                        The Landlord demises unto the Tenant all that property known as <strong>{agreementData.propertyDescription}</strong> for a term of ONE (1) YEAR commencing on <strong>{agreementData.commenceDate}</strong> and expiring on <strong>{agreementData.expiryDate}</strong> paying therefor the annual rental sum of <strong>₦{agreementData.annualRent.toLocaleString()}</strong>.
                      </p>
                    </div>

                    <div>
                      <p className="font-bold font-sans uppercase text-[11px] text-slate-900">2. COVENANTS OF THE TENANT:</p>
                      <ul className="list-disc pl-5 space-y-1 mt-1">
                        <li>To punctually pay the statutory monthly PHDL Estate Service Charge of <strong>₦10,000</strong> on or before the 10th of every month for generator fueling, security, and sanitation.</li>
                        {agreementData.sublettingClause && (
                          <li><strong>STRICT NO-SUBLETTING:</strong> Not to assign, sublet, or part with possession of the premises or any part thereof without prior written consent of PHDL HQ.</li>
                        )}
                        {agreementData.sentryCurfewClause && (
                          <li>To adhere strictly to military sentry guidelines, registration of domestic staff, and entry protocols for all visitors.</li>
                        )}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-8 font-sans text-xs">
                      <div className="border-t border-slate-900 pt-2 text-center">
                        <p className="font-bold text-slate-900">SIGNED BY THE LANDLORD</p>
                        <p className="text-[10px] text-slate-500 mt-1">{agreementData.landlordName}</p>
                      </div>
                      <div className="border-t border-slate-900 pt-2 text-center">
                        <p className="font-bold text-slate-900">SIGNED BY THE TENANT</p>
                        <p className="text-[10px] text-slate-500 mt-1">{agreementData.tenantName}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 8: USER PROFILE & SETTINGS */}
            {activeTab === 'user_settings' && (
              <div className="space-y-6 max-w-4xl">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center space-x-4 border-b pb-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-800 text-white font-bold text-xl flex items-center justify-center">
                      {currentRole === 'super_admin' ? 'HQ' : 'US'}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Personal & Security Profile</h3>
                      <p className="text-xs text-slate-500">Manage account access, contact telemetry, and two-factor credentials</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        defaultValue={currentRole === 'super_admin' ? 'HQ Command Officer' : 'Col. Ibrahim Yusuf'}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Official Email Address</label>
                      <input
                        type="email"
                        defaultValue="command@phdl-estate.mil.ng"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Phone Number (SMS Alerts)</label>
                      <input
                        type="text"
                        defaultValue="08031234567"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Military Rank / Service Number</label>
                      <input
                        type="text"
                        defaultValue="NA/18242"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Security & Authentication</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••••••"
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Confirm Security PIN (for Gate Pass)</label>
                        <input
                          type="password"
                          placeholder="4-digit PIN"
                          maxLength={4}
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => showToast('User profile & security credentials updated successfully')}
                      className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs shadow transition"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ROLE VIEW: RESIDENT TENANT SPECIFIC SCREENS */}
            {activeTab === 'tenant_bills' && (
              <div className="space-y-6 max-w-3xl">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Monthly Service Charge Payment</h3>
                      <p className="text-xs text-slate-500">Flat L2-B14-B • David Johnson</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                      Bill Due: ₦10,000
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Diesel Generator Fuel Allocation:</span>
                      <span className="font-semibold text-slate-800">₦4,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Military Sentry & Gate Security:</span>
                      <span className="font-semibold text-slate-800">₦2,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Waste Evacuation & Landscaping:</span>
                      <span className="font-semibold text-slate-800">₦1,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Water Treatment Plant:</span>
                      <span className="font-semibold text-slate-800">₦1,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Streetlighting & Reserve:</span>
                      <span className="font-semibold text-slate-800">₦500</span>
                    </div>
                    <div className="pt-2 border-t flex justify-between font-bold text-sm text-slate-900">
                      <span>Total Payable:</span>
                      <span className="text-emerald-700">₦10,000.00</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center space-x-3">
                    <button
                      onClick={() => showToast('Connecting to Paystack Gateway... Payment of ₦10,000 confirmed!')}
                      className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs shadow flex items-center justify-center transition"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay with Paystack
                    </button>
                    <button
                      onClick={() => showToast('Connecting to Flutterwave Gateway... Payment of ₦10,000 confirmed!')}
                      className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs shadow flex items-center justify-center transition"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay with Flutterwave
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tenant_electricity' && (
              <div className="space-y-6 max-w-2xl">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center space-x-2 border-b pb-3">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <h3 className="font-bold text-slate-900 text-base">STS Prepaid Electricity Recharging</h3>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg text-xs space-y-2">
                    <p className="text-slate-500">Assigned Meter Number:</p>
                    <p className="text-xl font-mono font-bold text-slate-900">0418-2049-8392</p>
                    <p className="text-[11px] text-slate-500">Tariff Band A • Dedicated Estate Transformer</p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <label className="block text-slate-700 font-semibold">Recharge Amount (₦)</label>
                    <input
                      type="number"
                      defaultValue={10000}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
                    />
                    <button
                      onClick={() => showToast('STS Token Generated: 4892-0192-3847-1928-3849 (142.8 kWh credited)')}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition"
                    >
                      Purchase STS Units & Generate 20-Digit Token
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tenant_visitor_pass' && (
              <div className="space-y-6 max-w-2xl">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center space-x-2 border-b pb-3">
                    <KeyRound className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-slate-900 text-base">Generate Sentry Gate Visitor QR Pass</h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Visitor Full Name</label>
                      <input type="text" placeholder="e.g. Engr. Paul Okon" className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Visitor Vehicle Plate (Optional)</label>
                      <input type="text" placeholder="e.g. ABJ-492-AA" className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg uppercase" />
                    </div>
                    <button
                      onClick={() => showToast('Single-Use Gate Access Pass Generated: PHDL-PASS-88421 (Sent via SMS)')}
                      className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition"
                    >
                      Generate Single-Use Gate Pass & SMS to Visitor
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tenant_maintenance' && (
              <div className="space-y-6 max-w-2xl">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center space-x-2 border-b pb-3">
                    <Wrench className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-slate-900 text-base">Facility Maintenance Work Order</h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Category</label>
                      <select className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg">
                        <option>Plumbing & Water Supply Issue</option>
                        <option>Electrical Transformer / Feeder Fault</option>
                        <option>Roofing & Structural Repair</option>
                        <option>Generator Switchgear Tripping</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Description of Issue</label>
                      <textarea rows={4} placeholder="Describe the fault..." className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg" />
                    </div>
                    <button
                      onClick={() => showToast('Maintenance ticket logged: #WO-2026-094. Artisan dispatched within 2 hours.')}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition"
                    >
                      Submit Maintenance Dispatch Order
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ROLE VIEW: SOLDIER LANDLORD SPECIFIC SCREENS */}
            {activeTab === 'landlord_property' && (
              <div className="space-y-6 max-w-3xl">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">My Statutory Military Property Allocation</h3>
                      <p className="text-xs text-slate-500">Col. Ibrahim Yusuf (NA/18242)</p>
                    </div>
                    <span className="px-3 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">
                      Title Deed Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-slate-500">Allocated Unit:</p>
                      <p className="font-mono font-bold text-slate-900 text-base mt-0.5">Lane 2, Block 14, Flat B</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-slate-500">Current Tenant:</p>
                      <p className="font-bold text-slate-900 text-base mt-0.5">David Johnson</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-slate-500">Annual Rental Yield:</p>
                      <p className="font-bold text-emerald-700 text-base mt-0.5">₦1,500,000 / year</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-slate-500">Statutory 1-Flat Policy:</p>
                      <p className="font-bold text-emerald-800 text-base mt-0.5">100% Compliant</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'landlord_remittance' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-900 text-base border-b pb-3">Rental Income Remittance History</h3>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold">
                      <tr>
                        <th className="py-2.5 px-4">Period</th>
                        <th className="py-2.5 px-4">Gross Rent</th>
                        <th className="py-2.5 px-4">Net Remittance</th>
                        <th className="py-2.5 px-4">Bank Account</th>
                        <th className="py-2.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-3 px-4 font-medium">2026 Annual Rent</td>
                        <td className="py-3 px-4">₦1,500,000</td>
                        <td className="py-3 px-4 font-bold text-emerald-800">₦1,500,000</td>
                        <td className="py-3 px-4">Zenith Bank • 0123456789</td>
                        <td className="py-3 px-4"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">Settled</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL: APARTMENT DETAILS & OCCUPANCY INSPECTION */}
      {inspectApt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-emerald-600" />
                  Flat Inspection: {inspectApt.fullCode}
                </h3>
                <p className="text-xs text-slate-500">Lane {inspectApt.lane} • Block {inspectApt.blockNumber} • Flat {inspectApt.flatCode}</p>
              </div>
              <button
                onClick={() => setInspectApt(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-slate-500">Occupancy Status:</p>
                  <p className="font-bold text-slate-900 capitalize mt-0.5">{inspectApt.status}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-slate-500">Service Charge (₦10k):</p>
                  <p className="font-bold text-emerald-800 uppercase mt-0.5">{inspectApt.serviceChargeStatus}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <p className="text-slate-500">Soldier Landlord (Owner):</p>
                <p className="font-semibold text-slate-900">{inspectApt.landlordName}</p>
                <p className="text-[10px] text-emerald-700 font-mono">Service No: {inspectApt.landlordServiceNo}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <p className="text-slate-500">Resident Tenant:</p>
                <p className="font-semibold text-slate-900">{inspectApt.tenantName || 'Vacant / No Tenant'}</p>
                {inspectApt.tenantPhone && <p className="text-[11px] text-slate-600">Phone: {inspectApt.tenantPhone}</p>}
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-slate-500">STS Electricity Meter:</p>
                <p className="font-mono font-bold text-slate-900 mt-0.5">{inspectApt.electricityMeterNo}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button
                onClick={() => setInspectApt(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setApartments(prev => prev.map(a => a.id === inspectApt.id ? {
                    ...a,
                    status: a.status === 'occupied' ? 'vacant' : 'occupied',
                    tenantName: a.status === 'occupied' ? undefined : 'New Resident',
                    tenantPhone: a.status === 'occupied' ? undefined : '08031234567'
                  } : a));
                  setInspectApt(null);
                  showToast(`Toggled occupancy status for ${inspectApt.fullCode}`);
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-xs"
              >
                Toggle Occupancy Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ONBOARD NEW TENANT */}
      {showAddTenantModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">Onboard New Resident Tenant</h3>
              <button onClick={() => setShowAddTenantModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Legal Name</label>
                <input
                  type="text"
                  placeholder="e.g. Chukwuma Obi"
                  value={newTenantData.name}
                  onChange={e => setNewTenantData({ ...newTenantData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phone Number (for SMS & Gate)</label>
                <input
                  type="text"
                  placeholder="0803XXXXXXX"
                  value={newTenantData.phone}
                  onChange={e => setNewTenantData({ ...newTenantData, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  value={newTenantData.email}
                  onChange={e => setNewTenantData({ ...newTenantData, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Assign to Available Flat</label>
                <select
                  value={newTenantData.flatCode}
                  onChange={e => setNewTenantData({ ...newTenantData, flatCode: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                >
                  {apartments.filter(a => a.status === 'vacant').slice(0, 20).map(a => (
                    <option key={a.id} value={a.fullCode}>{a.fullCode} (Lane {a.lane}, Block {a.blockNumber})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button
                onClick={() => setShowAddTenantModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newTenantData.name || !newTenantData.phone) {
                    showToast('Please enter tenant name and phone number');
                    return;
                  }
                  setApartments(prev => prev.map(a => a.fullCode === newTenantData.flatCode ? {
                    ...a,
                    status: 'occupied',
                    tenantName: newTenantData.name,
                    tenantPhone: newTenantData.phone
                  } : a));
                  setShowAddTenantModal(false);
                  showToast(`Tenant ${newTenantData.name} successfully assigned to ${newTenantData.flatCode}!`);
                }}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs"
              >
                Complete Onboarding
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;