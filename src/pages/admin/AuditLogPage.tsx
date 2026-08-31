import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { History, Shield, Lock, Search, Filter, Terminal, UserCheck } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export const AuditLogPage: React.FC = () => {
  const store = usePhdlStore();
  const currentEstateId = store.getActiveEstateId();
  const currentEstate = store.getEstateById(currentEstateId);
  const auditLogs = store.getAuditLogs(currentEstateId);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const filteredLogs = auditLogs.filter((log) => {
    if (selectedRole !== 'all' && log.actorRole !== selectedRole) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        log.action.toLowerCase().includes(q) ||
        log.actorName.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        (log.entityAffected || log.targetEntity || '').toLowerCase().includes(q) ||
        (log.ipAddress && log.ipAddress.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-military">MILITARY AUDIT TRAIL</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
            NDPR Compliance & Non-Repudiation Security Protocol
          </span>
        </div>
        <h2>Estate Operations Audit Trail & Security Logs</h2>
        <p style={{ fontSize: '0.875rem' }}>
          Immutable record of ownership validations, subletting actions, ID card issuances, and financial settlements for subsidized housing accountability.
        </p>
      </div>

      {/* Security Info Card */}
      <div className="card" style={{ backgroundColor: '#F8FAFC', borderLeft: '4px solid var(--primary-700)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Lock size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-900)' }}>
              Subsidized Military Housing Confidentiality Protection
            </div>
            <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              Officer service numbers, tenant bio-data, and dependent registries are encrypted and strictly isolated according to NDPR standards.
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="card" style={{ padding: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Search Log Trail</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search action, actor, IP address, details..."
                className="form-control"
                style={{ paddingLeft: '2rem' }}
              />
              <Search size={15} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Filter by Actor Role</label>
            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="form-select">
              <option value="all">All Roles</option>
              <option value="phdl_admin">PHDL Super Admin</option>
              <option value="soldier">Soldier Landlord</option>
              <option value="tenant">Civilian Tenant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Terminal size={18} />
            System Audit Log Stream ({filteredLogs.length} Events)
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action Code</th>
                <th>Actor & Role</th>
                <th>Target Entity</th>
                <th>Details & Metadata</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>
                    {formatDateTime(log.timestamp || log.createdAt || new Date().toISOString())}
                  </td>
                  <td>
                    <span className="badge badge-military" style={{ fontSize: '0.7rem' }}>
                      {log.action}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>{log.actorName}</div>
                    <div style={{ fontSize: '0.675rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                      {log.actorRole.replace('_', ' ')}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-neutral" style={{ fontSize: '0.725rem' }}>
                      {log.entityAffected || log.targetEntity || 'System'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: 360 }}>
                    {log.details}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                    {log.ipAddress || '127.0.0.1'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
