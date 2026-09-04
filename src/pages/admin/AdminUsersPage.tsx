import React from 'react';
import { usePhdlStore } from '../../data/storage';
import { Shield, UserCheck, Download } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const store = usePhdlStore();
  const admins = store.getAdmins ? store.getAdmins() : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline"><span>HQ COMMAND ACCESS</span> • <span>SECURITY CLEARANCE</span></div>
          <h1>Admin User Privileges & Access Control</h1>
          <p>Manage SuperAdmin HQ clearance levels, audit security keys, and govern officer role permissions.</p>
        </div>
        <button onClick={() => window.print()} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
          <Download size={14} /> Export Access Roster (PDF)
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Officer Details</th>
                <th>Clearance Tier</th>
                <th>Email ID</th>
                <th>Permission Matrix</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.id}>
                  <td><strong>{a.name}</strong></td>
                  <td><span className="badge" style={{ backgroundColor: '#991B1B', color: '#FFFFFF' }}>{a.role}</span></td>
                  <td>{a.email}</td>
                  <td><span style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 700 }}>Full Master HQ Control</span></td>
                  <td><span className="badge badge-success">Active Session</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;