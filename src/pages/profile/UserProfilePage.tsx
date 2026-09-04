import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { User, Save, CheckCircle2, Lock, Shield, Phone, Mail } from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const store = usePhdlStore();
  const [name, setName] = useState('Engr. Emeka Gabriel Okon');
  const [phone, setPhone] = useState('+234 803 456 7890');
  const [email, setEmail] = useState('emeka.okon@gmail.com');
  const [notice, setNotice] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice('Profile and account details updated successfully!');
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div className="section-overline"><span>USER ACCOUNT</span> • <span>PROFILE & CREDENTIALS</span></div>
        <h1>Account Settings & Security</h1>
        <p>Update your contact phone, notifications email, and change portal login credentials.</p>
      </div>

      {notice && (
        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', borderRadius: 6, fontWeight: 700 }}>
          {notice}
        </div>
      )}

      <form onSubmit={handleSave} className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ margin: 0, color: 'var(--army-green-950)' }}>Contact & Notification Settings</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Full Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" required />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Phone Number (For SMS Alerts):</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" required />
          </div>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">Email Address (For Invoices):</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
        </div>

        <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', backgroundColor: '#15803D', gap: '0.4rem' }}>
          <Save size={14} /> Save Profile Settings
        </button>
      </form>
    </div>
  );
};

export default UserProfilePage;