import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { AdminUser, AdminPrivilegeMap } from '../../types';
import {
  Shield,
  Users,
  UserCheck,
  CheckCircle2,
  Lock,
  Filter,
  Search,
  Plus,
  KeyRound,
  Check,
} from 'lucide-react';

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

export const AdminUsersPage: React.FC = () => {
  const store = usePhdlStore();
  const currentRole = store.getActiveRole();
  const isSuperAdmin = currentRole === 'phdl_admin';

  const [admins, setAdmins] = useState<AdminUser[]>(store.getAdminUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedAdminForEdit, setSelectedAdminForEdit] = useState<AdminUser | null>(null);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const [newAdminForm, setNewAdminForm] = useState<Partial<AdminUser>>({
    fullName: '',
    email: '',
    phone: '',
    rank: 'Major',
    roleTitle: 'Estate Manager',
    laneClearance: 'All Lanes',
    status: 'active',
  });

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

  const handleTogglePrivilege = (key: keyof AdminPrivilegeMap) => {
    if (!selectedAdminForEdit) return;
    const current = getAdminPrivilegeMap(selectedAdminForEdit);
    setSelectedAdminForEdit({
      ...selectedAdminForEdit,
      privileges: {
        ...current,
        [key]: !current[key],
      },
    });
  };

  const handleSavePrivileges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      alert('Only SuperAdmin has clearance to modify privileges.');
      return;
    }
    if (!selectedAdminForEdit) return;

    store.updateAdminUser(selectedAdminForEdit);
    setAdmins(store.getAdminUsers());
    setSelectedAdminForEdit(null);
    setSuccessNotice(`Administrative privileges updated for ${selectedAdminForEdit.rank} ${selectedAdminForEdit.fullName}.`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      alert('Only SuperAdmin has clearance to commission new administrative personnel.');
      return;
    }
    if (!newAdminForm.fullName || !newAdminForm.email) return;

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
    setSuccessNotice(`New admin ${newAdmin.rank} ${newAdmin.fullName} commissioned.`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const filteredAdmins = admins.filter((adm) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (
        !adm.fullName.toLowerCase().includes(q) &&
        !adm.email.toLowerCase().includes(q) &&
        !adm.adminId.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (selectedRole !== 'all' && adm.roleTitle !== selectedRole) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline">
            <span>SUPERADMIN ACCESS CONTROL & SECURITY</span> • <span>PERSONNEL CLEARANCE</span>
          </div>
          <h1>Admin Personnel & Privilege Delegation</h1>
          <p>SuperAdmin controls to modify, assign, and audit granular permissions across all administrative personnel.</p>
        </div>

        {isSuperAdmin && (
          <button
            type="button"
            onClick={() => setIsCreatingAdmin(true)}
            className="btn btn-primary"
            style={{ gap: '0.4rem' }}
          >
            <Plus size={15} /> Commission New Admin
          </button>
        )}
      </div>

      {successNotice && (
        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={16} />
          {successNotice}
        </div>
      )}

      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              <Search size={14} style={{ display: 'inline', marginRight: 4 }} /> Search Officer:
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search officer name, email, or Admin ID..."
              className="form-control"
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">
              <Filter size={14} style={{ display: 'inline', marginRight: 4 }} /> Filter Role Clearance:
            </label>
            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="form-select">
              <option value="all">-- All Officer Roles --</option>
              <option value="HQ SuperAdmin">HQ SuperAdmin</option>
              <option value="Estate Manager">Estate Manager</option>
              <option value="Audit & Compliance Officer">Audit & Compliance Officer</option>
              <option value="Security Gate Marshal">Security Gate Marshal</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Officer Particulars</th>
                <th>Role & Admin ID</th>
                <th>Lane Clearance</th>
                <th>Assigned Privileges</th>
                <th>Access Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((adm) => {
                const pMap = getAdminPrivilegeMap(adm);
                const activeCount = Object.values(pMap).filter(Boolean).length;

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
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{adm.email}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{adm.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-military">{adm.roleTitle}</span>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                        {adm.adminId}
                      </div>
                    </td>
                    <td><strong>{adm.laneClearance}</strong></td>
                    <td>
                      <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                        {activeCount} of 10 Privileges Active
                      </span>
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
                          <KeyRound size={13} /> Edit Privileges
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
                  Assign & Modify Officer Privileges
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {selectedAdminForEdit.rank} {selectedAdminForEdit.fullName} ({selectedAdminForEdit.adminId})
                </div>
              </div>
              <button type="button" onClick={() => setSelectedAdminForEdit(null)} className="btn btn-outline btn-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePrivileges} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Role Title</label>
                  <input
                    type="text"
                    value={selectedAdminForEdit.roleTitle}
                    onChange={(e) => setSelectedAdminForEdit({ ...selectedAdminForEdit, roleTitle: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Lane Clearance</label>
                  <select
                    value={selectedAdminForEdit.laneClearance}
                    onChange={(e) => setSelectedAdminForEdit({ ...selectedAdminForEdit, laneClearance: e.target.value })}
                    className="form-select"
                  >
                    <option value="All Lanes">All Lanes (Estate-Wide)</option>
                    <option value="Lanes 1-4">Lanes 1-4 (North Wing)</option>
                    <option value="Lanes 5-8">Lanes 5-8 (South Wing)</option>
                  </select>
                </div>
              </div>

              {/* Matrix */}
              <div>
                <div style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--army-green-950)', marginBottom: '0.5rem' }}>
                  Grant or Revoke Officer Capabilities:
                </div>

                {(() => {
                  const pMap = getAdminPrivilegeMap(selectedAdminForEdit);
                  const list: Array<{ key: keyof AdminPrivilegeMap; label: string; desc: string }> = [
                    { key: 'canModifyFlats', label: 'Create & Modify Flats', desc: 'Add new flats, reassign occupancy, update meters.' },
                    { key: 'canApproveKYC', label: 'Approve Soldier KYC', desc: 'Validate military service & title records.' },
                    { key: 'canModifyTenants', label: 'Manage Civilian Tenants', desc: 'Onboard tenants, approve sublets, edit leases.' },
                    { key: 'canManageTariffs', label: 'Modify Estate Tariffs', desc: 'Create, modify, validate, or cancel levies.' },
                    { key: 'canSendBulkSMS', label: 'Send Bulk SMS', desc: 'Dispatch estate-wide or lane SMS via Termii.' },
                    { key: 'canSendEmailBroadcast', label: 'Send Email Announcements', desc: 'Dispatch formal command directives.' },
                    { key: 'canExportDocuments', label: 'Export PDF/CSV Rosters', desc: 'Generate official directories and reports.' },
                    { key: 'canAssignPrivileges', label: 'Privilege Delegation', desc: 'Grant or revoke permissions of other admins.' },
                    { key: 'canSignDocuments', label: 'Official Signature Stamp', desc: 'Append digital stamp and signature to exports.' },
                    { key: 'canAccessAuditLogs', label: 'Inspect Audit Logs', desc: 'Review comprehensive tamper-proof actor activity.' },
                  ];

                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                      {list.map((item) => {
                        const checked = pMap[item.key];
                        return (
                          <div
                            key={item.key}
                            onClick={() => handleTogglePrivilege(item.key)}
                            style={{
                              padding: '0.65rem 0.8rem',
                              borderRadius: 'var(--radius-md)',
                              border: `1.5px solid ${checked ? 'var(--army-green-600)' : 'var(--border-light)'}`,
                              backgroundColor: checked ? 'var(--army-green-50)' : 'var(--bg-surface-subtle)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '0.5rem',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {}}
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)' }}>
                <button type="button" onClick={() => setSelectedAdminForEdit(null)} className="btn btn-outline btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
                  <Check size={14} /> Save Privileges
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ADMIN MODAL */}
      {isCreatingAdmin && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, color: 'var(--army-green-950)' }}>Commission New Administrative Personnel</h3>
              <button type="button" onClick={() => setIsCreatingAdmin(false)} className="btn btn-outline btn-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem' }}>
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
                  <label className="form-label">Email</label>
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
                  <label className="form-label">Phone</label>
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
  );
};