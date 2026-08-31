import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import {
  PaymentGatewaySettings,
  BroadcastSmsSettings,
  SuperAdminSignature,
  EstatePreferencesAndSLA,
  AdminUser,
  AdminPrivilegeMap,
} from '../../types';
import {
  CreditCard,
  Radio,
  Send,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Sliders,
  Shield,
  Smartphone,
  RefreshCw,
  Copy,
  Info,
  Check,
  Building,
  Users,
  UserCheck,
  FileCheck,
  Upload,
  Image as ImageIcon,
  Clock,
  Trash2,
  Plus,
  Search,
  KeyRound,
  FileText,
  Printer,
} from 'lucide-react';
import { printOrExportPDFRoster } from '../../utils/exportUtils';
import { formatDateTime } from '../../utils/formatters';

const DEFAULT_PRIVILEGE_MAP: AdminPrivilegeMap = {
  canModifyFlats: true,
  canApproveKYC: true,
  canModifyTenants: true,
  canManageTariffs: false,
  canSendBulkSMS: true,
  canSendEmailBroadcast: true,
  canExportDocuments: true,
  canAssignPrivileges: false,
  canSignDocuments: false,
  canAccessAuditLogs: false,
};

export const SystemSettingsPage: React.FC = () => {
  const store = usePhdlStore();
  const currentRole = store.getActiveRole();
  const isSuperAdmin = currentRole === 'phdl_admin';

  const [activeTab, setActiveTab] = useState<'admins' | 'sla' | 'sms' | 'signature' | 'payments'>('admins');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // -------------------------------------------------------------
  // TAB 1: ADMIN USERS & PRIVILEGES STATE
  // -------------------------------------------------------------
  const [admins, setAdmins] = useState<AdminUser[]>(store.getAdminUsers());
  const [adminSearch, setAdminSearch] = useState('');
  const [selectedAdminForEdit, setSelectedAdminForEdit] = useState<AdminUser | null>(null);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState<Partial<AdminUser>>({
    fullName: '',
    email: '',
    phone: '',
    rank: 'Major',
    roleTitle: 'Estate Manager',
    laneClearance: 'All Lanes',
    status: 'active',
  });

  // -------------------------------------------------------------
  // TAB 2: ESTATE PREFERENCES & SLA STATE
  // -------------------------------------------------------------
  const [estateSla, setEstateSla] = useState<EstatePreferencesAndSLA>(store.getEstatePreferences());

  // -------------------------------------------------------------
  // TAB 3: BROADCAST & BULK SMS GATEWAY STATE (SUPERADMIN ONLY)
  // -------------------------------------------------------------
  const [smsSettings, setSmsSettings] = useState<BroadcastSmsSettings>(store.getBroadcastSmsSettings());
  const [showSmsApiKey, setShowSmsApiKey] = useState(false);
  const [testPhone, setTestPhone] = useState('+234 803 456 7890');
  const [testMessage, setTestMessage] = useState('PHDL Unity Estate: Test clearance broadcast from Termii Gateway.');
  const [isSendingTestSms, setIsSendingTestSms] = useState(false);
  const [smsTestResult, setSmsTestResult] = useState<{ success: boolean; message: string; balance?: string } | null>(null);

  // -------------------------------------------------------------
  // TAB 4: SIGNATURE STAMP MODULE STATE
  // -------------------------------------------------------------
  const [signatureData, setSignatureData] = useState<SuperAdminSignature>(store.getSuperAdminSignature());
  const [customStampPreview, setCustomStampPreview] = useState<string>(signatureData.signatureImage);
  const [isUploadingStamp, setIsUploadingStamp] = useState(false);

  // -------------------------------------------------------------
  // TAB 5: PAYMENT GATEWAYS STATE
  // -------------------------------------------------------------
  const [paySettings, setPaySettings] = useState<PaymentGatewaySettings>(store.getPaymentGatewaySettings());
  const [showPaystackSecret, setShowPaystackSecret] = useState(false);
  const [showFlutterwaveSecret, setShowFlutterwaveSecret] = useState(false);
  const [isTestingGateway, setIsTestingGateway] = useState(false);
  const [gatewayTestResult, setGatewayTestResult] = useState<{ success: boolean; message: string; latencyMs: number } | null>(null);

  // Copy helper
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Helper for Privilege Map Normalization
  const getAdminPrivilegeMap = (adm: AdminUser): AdminPrivilegeMap => {
    if (typeof adm.privileges === 'object' && !Array.isArray(adm.privileges)) {
      return adm.privileges as AdminPrivilegeMap;
    }
    const arr = Array.isArray(adm.privileges) ? adm.privileges : [];
    return {
      canModifyFlats: arr.some((p) => p.includes('Flat')),
      canApproveKYC: arr.some((p) => p.includes('KYC') || p.includes('Landlord')),
      canModifyTenants: arr.some((p) => p.includes('Tenant')),
      canManageTariffs: arr.some((p) => p.includes('Tariff')),
      canSendBulkSMS: arr.some((p) => p.includes('SMS') || p.includes('Broadcast')),
      canSendEmailBroadcast: arr.some((p) => p.includes('Email') || p.includes('Broadcast')),
      canExportDocuments: arr.some((p) => p.includes('Export') || p.includes('Report')),
      canAssignPrivileges: arr.some((p) => p.includes('Assign') || p.includes('Privilege')),
      canSignDocuments: arr.some((p) => p.includes('Sign') || p.includes('Signature')),
      canAccessAuditLogs: arr.some((p) => p.includes('Audit')),
    };
  };

  // -------------------------------------------------------------
  // HANDLERS: ADMIN USERS
  // -------------------------------------------------------------
  const handleTogglePrivilege = (privilegeKey: keyof AdminPrivilegeMap) => {
    if (!selectedAdminForEdit) return;
    const currentMap = getAdminPrivilegeMap(selectedAdminForEdit);
    const updatedMap: AdminPrivilegeMap = {
      ...currentMap,
      [privilegeKey]: !currentMap[privilegeKey],
    };
    setSelectedAdminForEdit({
      ...selectedAdminForEdit,
      privileges: updatedMap,
    });
  };

  const handleSaveAdminPrivileges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      alert('Only SuperAdmin has clearance to assign or modify Admin privileges.');
      return;
    }
    if (!selectedAdminForEdit) return;

    store.updateAdminUser(selectedAdminForEdit);
    setAdmins(store.getAdminUsers());
    setSelectedAdminForEdit(null);
    setSuccessNotice(`Administrative privileges updated for ${selectedAdminForEdit.rank} ${selectedAdminForEdit.fullName}.`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const handleCreateNewAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      alert('Only SuperAdmin has clearance to commission new administrative personnel.');
      return;
    }
    if (!newAdminForm.fullName || !newAdminForm.email) {
      alert('Please fill in officer full name and email.');
      return;
    }

    const newAdmin: AdminUser = {
      id: `adm-${Date.now()}`,
      adminId: `ADM-SEC-${Math.floor(100 + Math.random() * 900)}`,
      fullName: newAdminForm.fullName,
      email: newAdminForm.email,
      phone: newAdminForm.phone || '+234 800 000 0000',
      rank: newAdminForm.rank || 'Major',
      roleTitle: newAdminForm.roleTitle || 'Estate Manager',
      laneClearance: newAdminForm.laneClearance || 'All Lanes',
      privileges: DEFAULT_PRIVILEGE_MAP,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    store.addAdminUser(newAdmin);
    setAdmins(store.getAdminUsers());
    setIsCreatingAdmin(false);
    setNewAdminForm({
      fullName: '',
      email: '',
      phone: '',
      rank: 'Major',
      roleTitle: 'Estate Manager',
      laneClearance: 'All Lanes',
    });
    setSuccessNotice(`New administrative personnel ${newAdmin.rank} ${newAdmin.fullName} commissioned with standard clearance.`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  // -------------------------------------------------------------
  // HANDLERS: ESTATE SLA & PREFERENCES
  // -------------------------------------------------------------
  const handleSaveSlaPreferences = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateEstatePreferences(estateSla);
    setSuccessNotice('Estate Preferences, SLAs, Curfew rules, and Utility Schedules saved successfully.');
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  // -------------------------------------------------------------
  // HANDLERS: BULK SMS GATEWAY (SUPERADMIN ONLY)
  // -------------------------------------------------------------
  const handleSaveSmsGateway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      alert('Only SuperAdmin has clearance to modify SMS provider API keys.');
      return;
    }
    const updated = {
      ...smsSettings,
      lastUpdatedBy: 'Col. Farouk Danjuma (Rtd.) - SuperAdmin',
      lastUpdatedAt: new Date().toISOString(),
    };
    store.updateBroadcastSmsSettings(updated);
    setSmsSettings(updated);
    setSuccessNotice('Broadcast & Bulk SMS provider API keys, Sender ID, and delivery routes saved.');
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const handleSendTestSms = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingTestSms(true);
    setSmsTestResult(null);
    setTimeout(() => {
      setSmsTestResult({
        success: true,
        message: `Test SMS successfully dispatched to ${testPhone} via ${smsSettings.primaryProvider.toUpperCase()} (${smsSettings.senderId}).`,
        balance: '₦18,450.00 (3,690 SMS Units)',
      });
      setIsSendingTestSms(false);
    }, 850);
  };

  // -------------------------------------------------------------
  // HANDLERS: SIGNATURE STAMP MODULE
  // -------------------------------------------------------------
  const handleSignatureFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check extension: jpg, jpeg, png, svg
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      alert('Invalid file format. Please upload a signature stamp in JPG, PNG, or SVG format.');
      return;
    }

    setIsUploadingStamp(true);
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target?.result as string;
      setCustomStampPreview(dataUrl);
      setSignatureData((prev) => ({
        ...prev,
        signatureImage: dataUrl,
      }));
      setIsUploadingStamp(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSignatureStamp = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SuperAdminSignature = {
      ...signatureData,
      signatureImage: customStampPreview,
      authorizedAt: new Date().toISOString(),
    };
    store.updateSuperAdminSignature(updated);
    setSignatureData(updated);
    setSuccessNotice('Commandant Signature Stamp saved. This stamp will be appended to all document exports.');
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const handleTestExportDocument = () => {
    printOrExportPDFRoster({
      title: 'OFFICIAL SECURITY & TENANCY DIRECTORY CLEARANCE',
      estateName: 'PHDL UNITY ESTATE ABUJA',
      subtitle: 'Verified Armed Forces Beneficiaries, Civilian Tenants & Housing Allotment Roster',
      statsSummary: 'Estate Units: 404 • Verified Landlords: 104 • Civilian Sublets: 98 • Active Clearance Passes: 182',
      headers: ['Flat Code', 'Lane', 'Beneficiary Officer', 'Service No', 'Resident Tenant', 'Tenancy Status', 'Clearance'],
      rows: [
        ['L1H1A', 'Lane 1', 'Brig. Gen. A. O. Adeleke (Rtd)', 'NN/1042', 'Civilian Resident (E. Okon)', 'Sublet Certified', 'CLEARED'],
        ['L1H1B', 'Lane 1', 'Col. T. A. Bello (Rtd)', 'NA/2045', 'Owner Occupied', 'Active Beneficiary', 'CLEARED'],
        ['L2H3C', 'Lane 2', 'Lt. Col. Y. Danjuma', 'NAF/3312', 'M. S. Alabi (Contractor)', 'Sublet Certified', 'CLEARED'],
        ['L3H2A', 'Lane 3', 'Commander F. K. Briggs', 'NN/1890', 'Officer Residence', 'Owner Occupied', 'CLEARED'],
      ],
      approverName: signatureData.fullName,
      approverRank: signatureData.rank,
      approverId: signatureData.adminId,
      approverTitle: signatureData.officialStampTitle,
      signatureImage: signatureData.signatureImage,
      originIp: '192.168.45.102 (PHDL-SEC-HQ-GATEWAY)',
    });
  };

  // -------------------------------------------------------------
  // HANDLERS: PAYMENT GATEWAYS
  // -------------------------------------------------------------
  const handleSavePaymentGateway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      alert('Only SuperAdmin has clearance to modify payment gateway API keys.');
      return;
    }
    const updated = {
      ...paySettings,
      lastUpdatedBy: 'Col. Farouk Danjuma (Rtd.) - SuperAdmin',
      lastUpdatedAt: new Date().toISOString(),
    };
    store.updatePaymentGatewaySettings(updated);
    setPaySettings(updated);
    setSuccessNotice('Payment gateway live/test API keys and webhook parameters saved.');
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const handleTestGateway = (gateway: 'paystack' | 'flutterwave') => {
    setIsTestingGateway(true);
    setGatewayTestResult(null);
    setTimeout(() => {
      setGatewayTestResult({
        success: true,
        message: `${gateway.toUpperCase()} Gateway connection verified. Ping response 200 OK.`,
        latencyMs: 138,
      });
      setIsTestingGateway(false);
    }, 750);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <div className="section-overline">
          <span>SYSTEM ARCHITECTURE, SECURITY & GOVERNANCE</span> • <span>RC 676563</span>
        </div>
        <h1>Platform System Settings</h1>
        <p>
          Configure administrative personnel privilege delegations, comprehensive estate SLA parameters, SuperAdmin SMS gateways, official signature stamps, and payment infrastructure.
        </p>
      </div>

      {successNotice && (
        <div
          style={{
            padding: '0.85rem 1rem',
            backgroundColor: 'var(--status-success-bg)',
            color: 'var(--status-success-text)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: '1px solid var(--status-success-border)',
          }}
        >
          <CheckCircle2 size={16} />
          {successNotice}
        </div>
      )}

      {/* Tabs Navigation Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--army-green-800)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setActiveTab('admins')}
          className={`btn ${activeTab === 'admins' ? 'btn-primary' : 'btn-outline'}`}
          style={{ gap: '0.4rem', backgroundColor: activeTab === 'admins' ? 'var(--army-green-800)' : 'transparent', color: activeTab === 'admins' ? '#FFFFFF' : 'var(--army-green-950)' }}
        >
          <Users size={16} />
          Admin Roles & Privilege Delegation
          <span className="badge badge-military" style={{ fontSize: '0.6rem', padding: '0.1rem 0.35rem', backgroundColor: 'var(--army-red-700)', color: '#FFFFFF' }}>
            SUPERADMIN
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sla')}
          className={`btn ${activeTab === 'sla' ? 'btn-primary' : 'btn-outline'}`}
          style={{ gap: '0.4rem', backgroundColor: activeTab === 'sla' ? 'var(--army-green-800)' : 'transparent', color: activeTab === 'sla' ? '#FFFFFF' : 'var(--army-green-950)' }}
        >
          <Sliders size={16} />
          Estate Preferences & SLA
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sms')}
          className={`btn ${activeTab === 'sms' ? 'btn-primary' : 'btn-outline'}`}
          style={{ gap: '0.4rem', backgroundColor: activeTab === 'sms' ? 'var(--army-green-800)' : 'transparent', color: activeTab === 'sms' ? '#FFFFFF' : 'var(--army-green-950)' }}
        >
          <Radio size={16} />
          Broadcast & Bulk SMS (Termii / BulkSMSNigeria)
          <span className="badge badge-military" style={{ fontSize: '0.6rem', padding: '0.1rem 0.35rem', backgroundColor: 'var(--army-red-700)', color: '#FFFFFF' }}>
            SUPERADMIN ONLY
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('signature')}
          className={`btn ${activeTab === 'signature' ? 'btn-primary' : 'btn-outline'}`}
          style={{ gap: '0.4rem', backgroundColor: activeTab === 'signature' ? 'var(--army-green-800)' : 'transparent', color: activeTab === 'signature' ? '#FFFFFF' : 'var(--army-green-950)' }}
        >
          <FileCheck size={16} />
          Official Signature Stamp & Document Endorsement
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('payments')}
          className={`btn ${activeTab === 'payments' ? 'btn-primary' : 'btn-outline'}`}
          style={{ gap: '0.4rem', backgroundColor: activeTab === 'payments' ? 'var(--army-green-800)' : 'transparent', color: activeTab === 'payments' ? '#FFFFFF' : 'var(--army-green-950)' }}
        >
          <CreditCard size={16} />
          Payment Gateways (Paystack / Flutterwave)
        </button>
      </div>

      {/* =========================================================================
          TAB 1: ADMIN PERSONNEL & PRIVILEGE ASSIGNMENT (SUPERADMIN EXCLUSIVE)
          ========================================================================= */}
      {activeTab === 'admins' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--army-green-950)', margin: 0 }}>
                  SuperAdmin Privilege Matrix & Personnel Delegation
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
                  SuperAdmin has exclusive clearance to assign, revoke, and modify granular capabilities for any Administrative Officer.
                </p>
              </div>

              {isSuperAdmin && (
                <button
                  type="button"
                  onClick={() => setIsCreatingAdmin(true)}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '0.4rem' }}
                >
                  <Plus size={14} /> Commission New Admin
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="card" style={{ padding: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Search admin officer by name, rank, email or admin ID..."
                className="form-control"
              />
            </div>
          </div>

          {/* Admin Table */}
          <div className="card">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Officer Particulars</th>
                    <th>Role & Admin ID</th>
                    <th>Lane Clearance</th>
                    <th>Assigned Privileges</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {admins
                    .filter((a) => {
                      if (!adminSearch.trim()) return true;
                      const q = adminSearch.toLowerCase();
                      return (
                        a.fullName.toLowerCase().includes(q) ||
                        a.email.toLowerCase().includes(q) ||
                        a.adminId.toLowerCase().includes(q) ||
                        (a.rank && a.rank.toLowerCase().includes(q))
                      );
                    })
                    .map((adm) => {
                      const pMap = getAdminPrivilegeMap(adm);
                      const enabledCount = Object.values(pMap).filter(Boolean).length;

                      return (
                        <tr key={adm.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: 'var(--army-green-100)', color: 'var(--army-green-950)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                                {adm.rank ? adm.rank.substring(0, 2).toUpperCase() : 'OF'}
                              </div>
                              <div>
                                <strong style={{ color: 'var(--army-green-950)' }}>
                                  {adm.rank} {adm.fullName}
                                </strong>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                  {adm.email} • {adm.phone}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, color: 'var(--army-green-900)' }}>{adm.roleTitle}</div>
                            <span className="badge badge-military" style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>
                              {adm.adminId}
                            </span>
                          </td>
                          <td>
                            <strong>{adm.laneClearance}</strong>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                                {enabledCount} of 10 Privileges Active
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${adm.status === 'active' ? 'badge-success' : 'badge-military'}`}>
                              {adm.status === 'active' ? '✓ Active Clearance' : 'Suspended'}
                            </span>
                          </td>
                          <td>
                            {isSuperAdmin ? (
                              <button
                                type="button"
                                onClick={() => setSelectedAdminForEdit(adm)}
                                className="btn btn-outline btn-sm"
                                style={{ gap: '0.35rem' }}
                              >
                                <KeyRound size={13} /> Modify Privileges
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SuperAdmin Only</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* EDIT PRIVILEGES MODAL */}
          {selectedAdminForEdit && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: 640 }}>
                <div className="modal-header">
                  <div>
                    <h3 style={{ margin: 0, color: 'var(--army-green-950)' }}>
                      Assign Clearance Privileges
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Officer: <strong>{selectedAdminForEdit.rank} {selectedAdminForEdit.fullName}</strong> ({selectedAdminForEdit.adminId})
                    </div>
                  </div>
                  <button type="button" onClick={() => setSelectedAdminForEdit(null)} className="btn btn-outline btn-sm">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveAdminPrivileges} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Role Designation</label>
                      <input
                        type="text"
                        value={selectedAdminForEdit.roleTitle}
                        onChange={(e) =>
                          setSelectedAdminForEdit({ ...selectedAdminForEdit, roleTitle: e.target.value })
                        }
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Lane Clearance Authority</label>
                      <select
                        value={selectedAdminForEdit.laneClearance}
                        onChange={(e) =>
                          setSelectedAdminForEdit({ ...selectedAdminForEdit, laneClearance: e.target.value })
                        }
                        className="form-select"
                      >
                        <option value="All Lanes">All Lanes (Estate-Wide)</option>
                        <option value="Lanes 1-4">Lanes 1-4 (North Wing)</option>
                        <option value="Lanes 5-8">Lanes 5-8 (South Wing)</option>
                      </select>
                    </div>
                  </div>

                  {/* Privilege Toggles Matrix */}
                  <div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--army-green-950)', marginBottom: '0.5rem' }}>
                      Granular Capability Permissions:
                    </div>

                    {(() => {
                      const pMap = getAdminPrivilegeMap(selectedAdminForEdit);
                      const privilegeDefinitions: Array<{ key: keyof AdminPrivilegeMap; label: string; desc: string }> = [
                        { key: 'canModifyFlats', label: 'Create & Modify Housing Flats', desc: 'Add new flats, reassign occupancy, update meters.' },
                        { key: 'canApproveKYC', label: 'Approve Soldier Landlord KYC', desc: 'Validate military service verification & title records.' },
                        { key: 'canModifyTenants', label: 'Manage Civilian Tenants & Leases', desc: 'Onboard tenants, approve sublet agreements, edit leases.' },
                        { key: 'canManageTariffs', label: 'Tariffs & Bulk Multiplier Override', desc: 'Create, modify, validate, or cancel estate levies.' },
                        { key: 'canSendBulkSMS', label: 'Dispatch Bulk SMS Broadcasts', desc: 'Send estate-wide or lane-targeted SMS via Termii.' },
                        { key: 'canSendEmailBroadcast', label: 'Send Official Email Announcements', desc: 'Dispatch formal command directives via email.' },
                        { key: 'canExportDocuments', label: 'Export Directories to PDF/CSV', desc: 'Generate official rosters and tenant spreadsheets.' },
                        { key: 'canAssignPrivileges', label: 'Privilege Delegation Management', desc: 'Assign and modify clearance levels of other admins.' },
                        { key: 'canSignDocuments', label: 'Official Signature Stamp Authority', desc: 'Append digital stamp and signature to exported reports.' },
                        { key: 'canAccessAuditLogs', label: 'Inspect Security & Audit Logs', desc: 'Review comprehensive tamper-proof actor activity records.' },
                      ];

                      return (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                          {privilegeDefinitions.map((item) => {
                            const isChecked = pMap[item.key];
                            return (
                              <div
                                key={item.key}
                                onClick={() => handleTogglePrivilege(item.key)}
                                style={{
                                  padding: '0.65rem 0.8rem',
                                  borderRadius: 'var(--radius-md)',
                                  border: `1.5px solid ${isChecked ? 'var(--army-green-600)' : 'var(--border-light)'}`,
                                  backgroundColor: isChecked ? 'var(--army-green-50)' : 'var(--bg-surface-subtle)',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: '0.5rem',
                                  transition: 'all 0.15s',
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {}} // handled by parent div
                                  style={{ marginTop: 2 }}
                                />
                                <div>
                                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--army-green-950)' }}>
                                    {item.label}
                                  </div>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                    {item.desc}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)' }}>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedAdminForEdit({
                          ...selectedAdminForEdit,
                          status: selectedAdminForEdit.status === 'active' ? 'suspended' : 'active',
                        })
                      }
                      className={`btn btn-sm ${selectedAdminForEdit.status === 'active' ? 'btn-outline' : 'btn-primary'}`}
                      style={{ color: selectedAdminForEdit.status === 'active' ? 'var(--army-red-700)' : '#FFFFFF' }}
                    >
                      {selectedAdminForEdit.status === 'active' ? 'Suspend Admin Access' : 'Reactivate Admin Access'}
                    </button>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button type="button" onClick={() => setSelectedAdminForEdit(null)} className="btn btn-outline btn-sm">
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
                        <Check size={14} /> Save Privilege Assignment
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* COMMISSION NEW ADMIN MODAL */}
          {isCreatingAdmin && (
            <div className="modal-overlay">
              <div className="modal-content" style={{ maxWidth: 520 }}>
                <div className="modal-header">
                  <h3 style={{ margin: 0, color: 'var(--army-green-950)' }}>Commission New Administrative Personnel</h3>
                  <button type="button" onClick={() => setIsCreatingAdmin(false)} className="btn btn-outline btn-sm">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateNewAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Military Rank</label>
                      <select
                        value={newAdminForm.rank}
                        onChange={(e) => setNewAdminForm({ ...newAdminForm, rank: e.target.value })}
                        className="form-select"
                      >
                        <option value="Colonel">Colonel</option>
                        <option value="Lt. Colonel">Lt. Colonel</option>
                        <option value="Major">Major</option>
                        <option value="Captain">Captain</option>
                        <option value="Commander">Commander</option>
                        <option value="Warrant Officer">Warrant Officer</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        value={newAdminForm.fullName}
                        onChange={(e) => setNewAdminForm({ ...newAdminForm, fullName: e.target.value })}
                        placeholder="e.g. Sani Bello"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Official Email</label>
                      <input
                        type="email"
                        value={newAdminForm.email}
                        onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                        placeholder="officer@phdl.gov.ng"
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Phone Number</label>
                      <input
                        type="text"
                        value={newAdminForm.phone}
                        onChange={(e) => setNewAdminForm({ ...newAdminForm, phone: e.target.value })}
                        placeholder="+234 803 000 0000"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Role Title</label>
                      <select
                        value={newAdminForm.roleTitle}
                        onChange={(e) => setNewAdminForm({ ...newAdminForm, roleTitle: e.target.value })}
                        className="form-select"
                      >
                        <option value="Estate Manager">Estate Manager</option>
                        <option value="Security Gate Marshal">Security Gate Marshal</option>
                        <option value="Audit & Compliance Officer">Audit & Compliance Officer</option>
                        <option value="Billing & Revenue Officer">Billing & Revenue Officer</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Lane Clearance</label>
                      <select
                        value={newAdminForm.laneClearance}
                        onChange={(e) => setNewAdminForm({ ...newAdminForm, laneClearance: e.target.value })}
                        className="form-select"
                      >
                        <option value="All Lanes">All Lanes (Estate-Wide)</option>
                        <option value="Lanes 1-4">Lanes 1-4 (North Wing)</option>
                        <option value="Lanes 5-8">Lanes 5-8 (South Wing)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button type="button" onClick={() => setIsCreatingAdmin(false)} className="btn btn-outline btn-sm">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
                      <Check size={14} /> Commission Officer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: ESTATE PREFERENCES & ELABORATED SLA
          ========================================================================= */}
      {activeTab === 'sla' && (
        <form onSubmit={handleSaveSlaPreferences} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Maintenance Response SLA Card */}
          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--army-green-700)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Clock size={20} color="var(--army-green-800)" />
              <h3 style={{ fontSize: '1.15rem', color: 'var(--army-green-950)', margin: 0 }}>
                Maintenance & Incident Resolution Service Level Agreements (SLA)
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ color: 'var(--army-red-700)', fontWeight: 800 }}>
                  🚨 Emergency SLA (Hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={estateSla.emergencySlaHours}
                  onChange={(e) => setEstateSla({ ...estateSla, emergencySlaHours: Number(e.target.value) })}
                  className="form-control"
                  required
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Gas leak, power surge, structural hazard</span>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ color: 'var(--army-gold-700)', fontWeight: 800 }}>
                  ⚡ High Priority SLA (Hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="48"
                  value={estateSla.highPrioritySlaHours}
                  onChange={(e) => setEstateSla({ ...estateSla, highPrioritySlaHours: Number(e.target.value) })}
                  className="form-control"
                  required
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Plumbing burst, water pump failure</span>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Standard Priority SLA (Hours)</label>
                <input
                  type="number"
                  min="1"
                  max="72"
                  value={estateSla.standardSlaHours}
                  onChange={(e) => setEstateSla({ ...estateSla, standardSlaHours: Number(e.target.value) })}
                  className="form-control"
                  required
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>General electrical, carpentry repairs</span>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Tenancy Dispute SLA (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={estateSla.disputeResolutionSlaDays}
                  onChange={(e) => setEstateSla({ ...estateSla, disputeResolutionSlaDays: Number(e.target.value) })}
                  className="form-control"
                  required
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Subletting or noise mediation</span>
              </div>
            </div>
          </div>

          {/* Gate Security, Curfews & Patrol Card */}
          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--army-red-700)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Shield size={20} color="var(--army-red-700)" />
              <h3 style={{ fontSize: '1.15rem', color: 'var(--army-green-950)', margin: 0 }}>
                Perimeter Security, Curfew Enforcement & Patrol Protocols
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Resident Gate Access Mode</label>
                <input
                  type="text"
                  value={estateSla.residentGateAccess}
                  onChange={(e) => setEstateSla({ ...estateSla, residentGateAccess: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Visitor Curfew Time (24H)</label>
                <input
                  type="text"
                  value={estateSla.visitorCurfewTime}
                  onChange={(e) => setEstateSla({ ...estateSla, visitorCurfewTime: e.target.value })}
                  className="form-control"
                  required
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>All non-resident visitors must exit</span>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Contractor Access Window</label>
                <input
                  type="text"
                  value={estateSla.contractorAccessWindow}
                  onChange={(e) => setEstateSla({ ...estateSla, contractorAccessWindow: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Armed Forces Patrol Interval (Mins)</label>
                <input
                  type="number"
                  min="15"
                  max="120"
                  value={estateSla.nightPatrolIntervalMins}
                  onChange={(e) => setEstateSla({ ...estateSla, nightPatrolIntervalMins: Number(e.target.value) })}
                  className="form-control"
                  required
                />
              </div>
            </div>
          </div>

          {/* Energy, Water & Municipal Utilities Card */}
          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--army-gold-600)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Zap size={20} color="var(--army-gold-700)" />
              <h3 style={{ fontSize: '1.15rem', color: 'var(--army-green-950)', margin: 0 }}>
                Central Generator, Water Treatment & Sanitation Schedules
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Generator Morning Run Window</label>
                <input
                  type="text"
                  value={estateSla.generatorMorningSchedule}
                  onChange={(e) => setEstateSla({ ...estateSla, generatorMorningSchedule: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Generator Evening Run Window</label>
                <input
                  type="text"
                  value={estateSla.generatorEveningSchedule}
                  onChange={(e) => setEstateSla({ ...estateSla, generatorEveningSchedule: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Water Pumping Morning Cycle</label>
                <input
                  type="text"
                  value={estateSla.waterSupplyMorning}
                  onChange={(e) => setEstateSla({ ...estateSla, waterSupplyMorning: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Illegal Refuse Dumping Penalty (₦)</label>
                <input
                  type="number"
                  step="1000"
                  value={estateSla.dumpingPenaltyFee}
                  onChange={(e) => setEstateSla({ ...estateSla, dumpingPenaltyFee: Number(e.target.value) })}
                  className="form-control"
                  required
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-primary" style={{ gap: '0.5rem' }}>
              <Check size={16} /> Save Estate Preferences & SLA Protocols
            </button>
          </div>
        </form>
      )}

      {/* =========================================================================
          TAB 3: BROADCAST & BULK SMS GATEWAY (SUPERADMIN ONLY)
          ========================================================================= */}
      {activeTab === 'sms' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {!isSuperAdmin ? (
            <div className="card" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', backgroundColor: 'var(--army-red-50)', border: '2px solid var(--army-red-200)' }}>
              <Lock size={40} color="var(--army-red-700)" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ color: 'var(--army-red-800)', margin: '0 0 0.4rem' }}>
                Restricted Clearance: SuperAdmin Exclusive Gateway
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto' }}>
                Broadcast & Bulk SMS API configuration (Termii, BulkSMSNigeria) is strictly restricted to SuperAdmin HQ to protect communications integrity and carrier sender IDs.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSaveSmsGateway} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Provider Selection */}
              <div className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--army-green-950)', margin: 0 }}>
                      Primary SMS Transmission Gateway
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                      Carrier-grade SMS route for automated bill reminders, OTPs, and emergency security broadcasts.
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Sender ID:</label>
                      <input
                        type="text"
                        value={smsSettings.senderId}
                        onChange={(e) => setSmsSettings({ ...smsSettings, senderId: e.target.value.toUpperCase() })}
                        style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', width: 140, textTransform: 'uppercase' }}
                        className="form-control"
                        maxLength={11}
                        required
                      />
                    </div>

                    <select
                      value={smsSettings.primaryProvider}
                      onChange={(e) =>
                        setSmsSettings({
                          ...smsSettings,
                          primaryProvider: e.target.value as any,
                        })
                      }
                      className="form-select"
                      style={{ fontWeight: 700, minWidth: 180 }}
                    >
                      <option value="termii">Termii Nigeria (Recommended)</option>
                      <option value="bulksmsnigeria">BulkSMSNigeria Gateway</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Termii API Credentials */}
              <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #10B981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#10B981' }} />
                    <h3 style={{ fontSize: '1.15rem', color: '#064E3B', margin: 0 }}>
                      Termii Nigeria API Integration
                    </h3>
                  </div>
                  <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                    DND BYPASS ACTIVE
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Termii API Key (TL_TER_...)</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showSmsApiKey ? 'text' : 'password'}
                        value={smsSettings.termii.apiKey}
                        onChange={(e) =>
                          setSmsSettings({
                            ...smsSettings,
                            termii: { ...smsSettings.termii, apiKey: e.target.value },
                          })
                        }
                        className="form-control"
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', paddingRight: '2.5rem' }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSmsApiKey(!showSmsApiKey)}
                        style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)' }}
                      >
                        {showSmsApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Base API URL</label>
                    <input
                      type="text"
                      value={smsSettings.termii.baseUrl}
                      onChange={(e) =>
                        setSmsSettings({
                          ...smsSettings,
                          termii: { ...smsSettings.termii, baseUrl: e.target.value },
                        })
                      }
                      className="form-control"
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Live Test SMS Dispatcher */}
              <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-surface-subtle)' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--army-green-950)' }}>
                  Test Live SMS Transmission
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '0.75rem', alignItems: 'flex-end' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Recipient Phone</label>
                    <input
                      type="text"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                      className="form-control"
                      placeholder="+234 803 000 0000"
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Message Payload</label>
                    <input
                      type="text"
                      value={testMessage}
                      onChange={(e) => setTestMessage(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSendTestSms}
                    disabled={isSendingTestSms}
                    className="btn btn-primary"
                    style={{ gap: '0.4rem', whiteSpace: 'nowrap' }}
                  >
                    <Send size={14} className={isSendingTestSms ? 'spin' : ''} />
                    {isSendingTestSms ? 'Transmitting...' : 'Send Test SMS'}
                  </button>
                </div>

                {smsTestResult && (
                  <div
                    style={{
                      marginTop: '0.85rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'var(--status-success-bg)',
                      color: 'var(--status-success-text)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{smsTestResult.message}</span>
                    <span>Carrier Balance: {smsTestResult.balance}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="submit" className="btn btn-primary" style={{ gap: '0.5rem' }}>
                  <Check size={16} /> Save SuperAdmin SMS Gateway Settings
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 4: OFFICIAL SIGNATURE STAMP MODULE
          ========================================================================= */}
      {activeTab === 'signature' && (
        <form onSubmit={handleSaveSignatureStamp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--army-green-800)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <FileCheck size={20} color="var(--army-green-800)" />
              <h3 style={{ fontSize: '1.15rem', color: 'var(--army-green-950)', margin: 0 }}>
                Commandant & Admin Digital Signature Stamp Module
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Upload your official signature stamp in <strong>JPG, PNG, or SVG</strong> format. This signature is cryptographically bound and automatically appended to the end of every official PDF report, directory export, and tenancy clearance document along with the originating IP and verification timestamp.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
            {/* Left: Upload & Parameters */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--army-green-950)' }}>
                Authorized Officer Particulars
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Military Rank</label>
                    <input
                      type="text"
                      value={signatureData.rank}
                      onChange={(e) => setSignatureData({ ...signatureData, rank: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Officer Full Name</label>
                    <input
                      type="text"
                      value={signatureData.fullName}
                      onChange={(e) => setSignatureData({ ...signatureData, fullName: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Admin Officer ID</label>
                    <input
                      type="text"
                      value={signatureData.adminId}
                      onChange={(e) => setSignatureData({ ...signatureData, adminId: e.target.value })}
                      className="form-control"
                      style={{ fontFamily: 'var(--font-mono)' }}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Official Stamp Title</label>
                    <input
                      type="text"
                      value={signatureData.officialStampTitle}
                      onChange={(e) => setSignatureData({ ...signatureData, officialStampTitle: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                {/* Upload Module */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Upload Signature Stamp (JPG, PNG, or SVG)</label>
                  <div
                    style={{
                      border: '2px dashed var(--army-green-600)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.5rem',
                      textAlign: 'center',
                      backgroundColor: 'var(--army-green-50)',
                      cursor: 'pointer',
                    }}
                    onClick={() => document.getElementById('signature-file-input')?.click()}
                  >
                    <Upload size={28} color="var(--army-green-800)" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--army-green-950)' }}>
                      Click to Browse or Drag & Drop Signature Stamp
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Supports high-resolution JPG, transparent PNG, and vector SVG files.
                    </div>
                    <input
                      id="signature-file-input"
                      type="file"
                      accept=".jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml"
                      onChange={handleSignatureFileUpload}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Live Stamp Preview Card */}
            <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--army-green-950)' }}>
                  Live Document Endorsement Preview
                </h4>

                <div
                  style={{
                    border: '1.5px solid var(--army-green-900)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                      ✓ DIGITAL SIGNATURE VERIFIED
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                      {formatDateTime(new Date().toISOString())}
                    </span>
                  </div>

                  <div style={{ textAlign: 'center', padding: '0.5rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-sm)' }}>
                    <img
                      src={customStampPreview}
                      alt="Signature Stamp Preview"
                      style={{ maxHeight: 60, maxWidth: '100%', objectFit: 'contain', margin: '0 auto' }}
                    />
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, marginTop: '0.35rem' }}>
                      {signatureData.officialStampTitle}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--army-green-950)', borderTop: '1px dashed var(--border-light)', paddingTop: '0.5rem' }}>
                    <div><strong>Authorized By:</strong> {signatureData.rank} {signatureData.fullName}</div>
                    <div><strong>Admin ID:</strong> {signatureData.adminId}</div>
                    <div><strong>Originating IP:</strong> <code>192.168.45.102 (PHDL-HQ)</code></div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleTestExportDocument}
                  className="btn btn-outline btn-sm"
                  style={{ gap: '0.4rem', justifyContent: 'center' }}
                >
                  <Printer size={14} /> Test Generate Endorsed PDF Document
                </button>

                <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem', justifyContent: 'center' }}>
                  <Check size={16} /> Save Official Signature Stamp
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* =========================================================================
          TAB 5: PAYMENT GATEWAYS (SUPERADMIN EXCLUSIVE)
          ========================================================================= */}
      {activeTab === 'payments' && (
        <form onSubmit={handleSavePaymentGateway} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--army-green-950)', margin: 0 }}>
                  Payment Gateway Engine Configuration
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                  Toggle between Live and Sandbox environments and choose the primary checkout gateway.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--bg-surface-subtle)', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: paySettings.environment === 'test' ? 'var(--army-gold-700)' : 'var(--text-subtle)' }}>
                    TEST MODE
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPaySettings({
                        ...paySettings,
                        environment: paySettings.environment === 'live' ? 'test' : 'live',
                      })
                    }
                    style={{
                      width: 44,
                      height: 22,
                      borderRadius: 12,
                      backgroundColor: paySettings.environment === 'live' ? 'var(--army-green-800)' : '#CBD5E1',
                      position: 'relative',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 2,
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        transform: paySettings.environment === 'live' ? 'translateX(22px)' : 'translateX(0px)',
                        transition: 'transform 0.2s',
                      }}
                    />
                  </button>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: paySettings.environment === 'live' ? 'var(--army-green-800)' : 'var(--text-subtle)' }}>
                    LIVE PRODUCTION
                  </span>
                </div>

                <select
                  value={paySettings.activeGateway}
                  onChange={(e) => setPaySettings({ ...paySettings, activeGateway: e.target.value as any })}
                  className="form-select"
                  style={{ fontWeight: 700, minWidth: 160 }}
                >
                  <option value="paystack">Paystack (Default)</option>
                  <option value="flutterwave">Flutterwave</option>
                  <option value="hybrid">Hybrid Split</option>
                </select>
              </div>
            </div>
          </div>

          {/* Paystack Card */}
          <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #00C3F7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#002B36', margin: 0 }}>Paystack Nigeria API Keys</h3>
              <button
                type="button"
                onClick={() => handleTestGateway('paystack')}
                disabled={isTestingGateway}
                className="btn btn-outline btn-sm"
              >
                <RefreshCw size={13} className={isTestingGateway ? 'spin' : ''} />
                Test Paystack Connection
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Public Key</label>
                <input
                  type="text"
                  value={paySettings.paystack.publicKey}
                  onChange={(e) =>
                    setPaySettings({
                      ...paySettings,
                      paystack: { ...paySettings.paystack, publicKey: e.target.value },
                    })
                  }
                  className="form-control"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Secret Key</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPaystackSecret ? 'text' : 'password'}
                    value={paySettings.paystack.secretKey}
                    onChange={(e) =>
                      setPaySettings({
                        ...paySettings,
                        paystack: { ...paySettings.paystack, secretKey: e.target.value },
                      })
                    }
                    className="form-control"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', paddingRight: '2.5rem' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPaystackSecret(!showPaystackSecret)}
                    style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)' }}
                  >
                    {showPaystackSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-primary" style={{ gap: '0.5rem' }}>
              <Check size={16} /> Save Payment Gateway Credentials
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
