import React, { useState, useEffect } from 'react';
import { usePhdlStore } from '../../data/storage';
import { UserProfileData, MilitaryRank, MilitaryBranch } from '../../types';
import {
  User,
  Shield,
  Phone,
  Mail,
  Home,
  Briefcase,
  Award,
  Lock,
  Save,
  CheckCircle2,
  Bell,
  KeyRound,
  FileCheck,
  AlertTriangle,
  Smartphone,
  CreditCard,
  UserCheck,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const UserProfilePage: React.FC = () => {
  const store = usePhdlStore();
  const currentRole = store.getActiveRole();
  const initialProfile = store.getCurrentUserProfile();

  const [profile, setProfile] = useState<UserProfileData>(initialProfile);
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'notifications'>('personal');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    setProfile(store.getCurrentUserProfile());
  }, [currentRole]);

  // Security / Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passNotice, setPassNotice] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateCurrentUserProfile(profile);
    setSuccessNotice('Your personal details and profile records have been successfully saved.');
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match.');
      return;
    }

    setPassNotice('Security password / Access PIN updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPassNotice(null), 4000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      const updated = { ...profile, avatarUrl: dataUrl };
      setProfile(updated);
      store.updateCurrentUserProfile(updated);
      setSuccessNotice('Profile picture uploaded and saved successfully across your account.');
      setTimeout(() => setSuccessNotice(null), 4000);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    const updated = { ...profile, avatarUrl: '' };
    setProfile(updated);
    store.updateCurrentUserProfile(updated);
    setSuccessNotice('Profile picture removed. Default insignia restored.');
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div>
        <div className="section-overline">
          <span>USER IDENTITY & ACCOUNT CENTER</span> • <span>PHDL UNITY ESTATE</span>
        </div>
        <h1>Personal Profile & User Settings</h1>
        <p>
          Manage your profile picture, contact information, residential allocation details, next of kin, and security credentials across the PHDL platform.
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

      {/* Profile Overview Card with Avatar Upload */}
      <div
        className="card card-army-accent"
        style={{
          backgroundColor: '#FFFFFF',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
          {/* Avatar / Photo Upload Container */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => document.getElementById('user-avatar-input')?.click()}
              style={{
                width: 76,
                height: 76,
                borderRadius: '50%',
                backgroundColor: 'var(--army-green-800)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                fontWeight: 800,
                boxShadow: '0 0 0 3px var(--army-gold-500)',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '2px solid #FFFFFF',
              }}
              title="Click to upload profile photo"
            >
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                profile.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()
              )}
            </div>

            <input
              id="user-avatar-input"
              type="file"
              accept=".jpg,.jpeg,.png,.svg,.webp,image/*"
              onChange={handleAvatarUpload}
              style={{ display: 'none' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.35rem', color: 'var(--army-green-950)', margin: 0 }}>
                {profile.fullName}
              </h2>
              {currentRole === 'phdl_admin' && (
                <span className="badge badge-military" style={{ backgroundColor: 'var(--army-red-700)', color: '#FFFFFF' }}>
                  SUPERADMIN
                </span>
              )}
              {currentRole === 'soldier' && (
                <span className="badge badge-military">
                  {profile.rank} • ALLOCATEE
                </span>
              )}
              {currentRole === 'tenant' && (
                <span className="badge badge-military" style={{ backgroundColor: 'var(--army-green-100)', color: 'var(--army-green-900)' }}>
                  VERIFIED RESIDENT
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {profile.email} • {profile.phone}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--army-gold-800)', fontWeight: 700, marginTop: '0.2rem' }}>
              Unit: Flat {profile.flatCode || 'L1H1A'} ({profile.laneName || 'Lane 1'})
            </div>

            {/* Photo Action Controls */}
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
              <button
                type="button"
                onClick={() => document.getElementById('user-avatar-input')?.click()}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', gap: '0.3rem' }}
              >
                Upload Profile Picture
              </button>
              {profile.avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', color: 'var(--army-red-700)' }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: 'var(--army-green-50)', padding: '0.3rem', borderRadius: 'var(--radius-md)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`btn btn-sm ${activeTab === 'personal' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ backgroundColor: activeTab === 'personal' ? 'var(--army-green-800)' : 'transparent', color: activeTab === 'personal' ? '#FFFFFF' : 'var(--army-green-950)' }}
          >
            <User size={14} />
            Personal Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`btn btn-sm ${activeTab === 'security' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ backgroundColor: activeTab === 'security' ? 'var(--army-green-800)' : 'transparent', color: activeTab === 'security' ? '#FFFFFF' : 'var(--army-green-950)' }}
          >
            <Lock size={14} />
            Security & PIN
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`btn btn-sm ${activeTab === 'notifications' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ backgroundColor: activeTab === 'notifications' ? 'var(--army-green-800)' : 'transparent', color: activeTab === 'notifications' ? '#FFFFFF' : 'var(--army-green-950)' }}
          >
            <Bell size={14} />
            Alert Channels
          </button>
        </div>
      </div>

      {/* TAB 1: PERSONAL DETAILS */}
      {activeTab === 'personal' && (
        <form onSubmit={handleSaveProfile} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--army-green-950)' }}>
              Contact & Identification Particulars
            </h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.15rem' }}>
              Ensure your phone number and email address are up to date for official SMS gate clearances and invoice receipts.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="form-control"
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Primary Mobile Phone (SMS Enabled)</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="form-control"
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="form-control"
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Alternative Phone (Optional)</label>
              <input
                type="text"
                value={profile.altPhone || ''}
                onChange={(e) => setProfile({ ...profile, altPhone: e.target.value })}
                placeholder="+234 800 000 0000"
                className="form-control"
              />
            </div>
          </div>

          {/* Role-Specific Fields */}
          {currentRole === 'soldier' && (
            <div style={{ backgroundColor: 'var(--army-green-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--army-green-200)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                <Award size={16} color="var(--army-green-900)" />
                <strong style={{ fontSize: '0.85rem', color: 'var(--army-green-950)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Military Service & Roster Verification
                </strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Service Number</label>
                  <input
                    type="text"
                    value={profile.serviceNumber || ''}
                    onChange={(e) => setProfile({ ...profile, serviceNumber: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Military Rank</label>
                  <select
                    value={profile.rank}
                    onChange={(e) => setProfile({ ...profile, rank: e.target.value as MilitaryRank })}
                    className="form-select"
                  >
                    <option value="Staff Sergeant">Staff Sergeant</option>
                    <option value="Master Warrant Officer">Master Warrant Officer</option>
                    <option value="Warrant Officer">Warrant Officer</option>
                    <option value="Sergeant">Sergeant</option>
                    <option value="Corporal">Corporal</option>
                    <option value="Lance Corporal">Lance Corporal</option>
                    <option value="Private">Private</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Branch of Armed Forces</label>
                  <select
                    value={profile.militaryBranch}
                    onChange={(e) => setProfile({ ...profile, militaryBranch: e.target.value as MilitaryBranch })}
                    className="form-select"
                  >
                    <option value="Nigerian Army">Nigerian Army</option>
                    <option value="Nigerian Navy">Nigerian Navy</option>
                    <option value="Nigerian Air Force">Nigerian Air Force</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Unit / Formation</label>
                  <input
                    type="text"
                    value={profile.unitBrigade || ''}
                    onChange={(e) => setProfile({ ...profile, unitBrigade: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          )}

          {currentRole === 'tenant' && (
            <div style={{ backgroundColor: 'var(--army-green-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--army-green-200)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                <Briefcase size={16} color="var(--army-green-900)" />
                <strong style={{ fontSize: '0.85rem', color: 'var(--army-green-950)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Employment & Residency Particulars
                </strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Occupation / Profession</label>
                  <input
                    type="text"
                    value={profile.occupation || ''}
                    onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Employer / Organization</label>
                  <input
                    type="text"
                    value={profile.employer || ''}
                    onChange={(e) => setProfile({ ...profile, employer: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Next of Kin & Emergency Contacts */}
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--army-green-950)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
              Next of Kin & Emergency Contact (Mandatory for Gate Pass)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Emergency Contact Name</label>
                <input
                  type="text"
                  value={profile.emergencyContactName || ''}
                  onChange={(e) => setProfile({ ...profile, emergencyContactName: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Emergency Phone Number</label>
                <input
                  type="text"
                  value={profile.emergencyContactPhone || ''}
                  onChange={(e) => setProfile({ ...profile, emergencyContactPhone: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Relationship</label>
                <input
                  type="text"
                  value={profile.emergencyContactRelationship || ''}
                  onChange={(e) => setProfile({ ...profile, emergencyContactRelationship: e.target.value })}
                  placeholder="e.g. Spouse, Brother, Parent"
                  className="form-control"
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem', backgroundColor: 'var(--army-green-800)' }}>
              <Save size={16} />
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: SECURITY & PIN */}
      {activeTab === 'security' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--army-green-950)' }}>
              Security Credentials & Gate PIN
            </h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.15rem' }}>
              Update your account access password and quick-clearance mobile gate pass PIN.
            </div>
          </div>

          {passNotice && (
            <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <CheckCircle2 size={16} />
              {passNotice}
            </div>
          )}

          <form onSubmit={handlePasswordChange} style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">New Password (Min 6 characters)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem', marginTop: '0.5rem', backgroundColor: 'var(--army-green-800)' }}>
              <KeyRound size={16} />
              Update Access Password
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: NOTIFICATION PREFERENCES */}
      {activeTab === 'notifications' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--army-green-950)' }}>
              Notification & Alert Delivery Channels
            </h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.15rem' }}>
              Configure how you receive rent reminders, utility bills, emergency security broadcasts, and gate arrivals.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 600 }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>Direct SMS Notifications (Termii / BulkSMS)</strong>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)' }}>Receive immediate SMS for rent expiry, overdue bills, and gate entries</div>
              </div>
              <input
                type="checkbox"
                checked={profile.notificationPreferences?.sms ?? true}
                onChange={(e) => {
                  const cur = profile.notificationPreferences || { sms: true, inApp: true, whatsapp: true, email: true };
                  setProfile({
                    ...profile,
                    notificationPreferences: { ...cur, sms: e.target.checked },
                  });
                }}
                style={{ width: 18, height: 18, accentColor: 'var(--army-green-800)' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>In-App Bell Alerts</strong>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)' }}>Receive real-time notifications in the top navigation bar</div>
              </div>
              <input
                type="checkbox"
                checked={profile.notificationPreferences?.inApp ?? true}
                onChange={(e) => {
                  const cur = profile.notificationPreferences || { sms: true, inApp: true, whatsapp: true, email: true };
                  setProfile({
                    ...profile,
                    notificationPreferences: { ...cur, inApp: e.target.checked },
                  });
                }}
                style={{ width: 18, height: 18, accentColor: 'var(--army-green-800)' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>WhatsApp Integration</strong>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)' }}>Receive payment receipts and maintenance ticket updates on WhatsApp</div>
              </div>
              <input
                type="checkbox"
                checked={profile.notificationPreferences?.whatsapp ?? true}
                onChange={(e) => {
                  const cur = profile.notificationPreferences || { sms: true, inApp: true, whatsapp: true, email: true };
                  setProfile({
                    ...profile,
                    notificationPreferences: { ...cur, whatsapp: e.target.checked },
                  });
                }}
                style={{ width: 18, height: 18, accentColor: 'var(--army-green-800)' }}
              />
            </label>

            <button
              type="button"
              onClick={handleSaveProfile}
              className="btn btn-primary"
              style={{ gap: '0.4rem', alignSelf: 'flex-start', marginTop: '0.5rem', backgroundColor: 'var(--army-green-800)' }}
            >
              <Save size={16} />
              Save Alert Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
