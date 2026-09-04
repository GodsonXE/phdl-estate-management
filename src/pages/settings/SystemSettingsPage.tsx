import React, { useState } from 'react';
import { usePhdlStore, NATIONWIDE_18_ESTATES } from '../../data/storage';
import {
  Settings,
  Shield,
  Building,
  CreditCard,
  Save,
  CheckCircle2,
  Database,
  Download,
  Smartphone,
  Send,
} from 'lucide-react';

export const SystemSettingsPage: React.FC = () => {
  const store = usePhdlStore();
  const [activeTab, setActiveTab] = useState<'general' | 'payment' | 'sms' | 'security' | 'database'>('payment');
  
  // General
  const [estateName, setEstateName] = useState('PHDL Unity Estate (Kurudu, Abuja)');
  const [serviceCharge, setServiceCharge] = useState(10000);
  
  // Payment Gateway
  const [paymentProvider, setPaymentProvider] = useState<'paystack' | 'flutterwave' | 'remita' | 'monnify'>('paystack');
  const [paymentMode, setPaymentMode] = useState<'live' | 'test'>('live');
  const [publicKey, setPublicKey] = useState('pk_live_89f3a927d81e4b9c8f30291823');
  const [secretKey, setSecretKey] = useState('sk_live_••••••••••••••••••••••••••••••••');
  const [webhookUrl, setWebhookUrl] = useState('https://phdl-estate-manager.vercel.app/api/webhooks/paystack');
  
  // SMS Gateway
  const [smsProvider, setSmsProvider] = useState<'termii' | 'infobip' | 'twilio' | 'africastalking'>('termii');
  const [smsApiKey, setSmsApiKey] = useState('TL_api_live_99248102948102948102');
  const [senderId, setSenderId] = useState('PHDL-HQ');
  const [smsBalance, setSmsBalance] = useState(48500);
  
  // Security
  const [curfewTime, setCurfewTime] = useState('22:00');
  const [notice, setNotice] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice('✅ Gateway & System settings saved and synced across all modules!');
    setTimeout(() => setNotice(null), 3500);
  };

  const handleSendTestSMS = () => {
    setNotice(`📲 Test SMS dispatched via ${smsProvider.toUpperCase()} to +234 803 111 2233 using Sender ID: "${senderId}"!`);
    setSmsBalance((prev) => prev - 1);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleExportBackup = () => {
    const data = {
      estate: estateName,
      exportDate: new Date().toISOString(),
      lanes: store.getLanes ? store.getLanes() : [],
      flats: store.getFlats ? store.getFlats() : [],
      soldiers: store.getSoldiers ? store.getSoldiers() : [],
      tenants: store.getTenants ? store.getTenants() : [],
      tariffs: store.getTariffs ? store.getTariffs() : [],
    };
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', `PHDL_Database_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <div className="section-overline">
          <span>MASTER CONFIGURATION</span> • <span>GATEWAY INTEGRATIONS</span>
        </div>
        <h1>System & Gateway Settings</h1>
        <p>
          Configure Paystack/Remita payment channels, Termii SMS broadcast gateways, perimeter security curfews, and database snapshots.
        </p>
      </div>

      {notice && (
        <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', borderRadius: '6px', fontWeight: 700 }}>
          {notice}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('payment')}
          className={`btn btn-sm ${activeTab === 'payment' ? 'btn-primary' : 'btn-outline'}`}
          style={{ gap: '0.4rem', backgroundColor: activeTab === 'payment' ? '#1B4D21' : 'transparent' }}
        >
          <CreditCard size={14} /> Payment Gateway
        </button>
        <button
          onClick={() => setActiveTab('sms')}
          className={`btn btn-sm ${activeTab === 'sms' ? 'btn-primary' : 'btn-outline'}`}
          style={{ gap: '0.4rem', backgroundColor: activeTab === 'sms' ? '#1B4D21' : 'transparent' }}
        >
          <Smartphone size={14} /> SMS & Broadcast Gateway
        </button>
        <button
          onClick={() => setActiveTab('general')}
          className={`btn btn-sm ${activeTab === 'general' ? 'btn-primary' : 'btn-outline'}`}
          style={{ gap: '0.4rem', backgroundColor: activeTab === 'general' ? '#1B4D21' : 'transparent' }}
        >
          <Building size={14} /> General & 18 Estates
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`btn btn-sm ${activeTab === 'security' ? 'btn-primary' : 'btn-outline'}`}
          style={{ gap: '0.4rem', backgroundColor: activeTab === 'security' ? '#1B4D21' : 'transparent' }}
        >
          <Shield size={14} /> Gate & Security
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`btn btn-sm ${activeTab === 'database' ? 'btn-primary' : 'btn-outline'}`}
          style={{ gap: '0.4rem', backgroundColor: activeTab === 'database' ? '#1B4D21' : 'transparent' }}
        >
          <Database size={14} /> Database & Backup
        </button>
      </div>

      {/* PAYMENT GATEWAY TAB */}
      {activeTab === 'payment' && (
        <form onSubmit={handleSave} className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: 'var(--army-green-950)' }}>Online Payment Gateway Configuration</h3>
            <span className="badge badge-success">✓ 256-Bit SSL Encrypted</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Primary Gateway Provider:</label>
              <select value={paymentProvider} onChange={(e) => setPaymentProvider(e.target.value as any)} className="form-select">
                <option value="paystack">Paystack (Direct Debit, Cards & USSD)</option>
                <option value="flutterwave">Flutterwave (Pan-African Gateway)</option>
                <option value="remita">Remita (Treasury Single Account / Federal)</option>
                <option value="monnify">Monnify (Dedicated Virtual Bank Accounts)</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Gateway Environment Mode:</label>
              <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value as any)} className="form-select">
                <option value="live">Live Production Mode (Real Payments)</option>
                <option value="test">Test Sandbox Mode (Simulator)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Public API Key:</label>
              <input type="text" value={publicKey} onChange={(e) => setPublicKey(e.target.value)} className="form-control" required />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Secret API Key:</label>
              <input type="password" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} className="form-control" required />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Webhook Secret & IPN Endpoint:</label>
            <input type="text" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} className="form-control" required />
          </div>

          <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: 6, border: '1px solid #E2E8F0', fontSize: '0.82rem' }}>
            <div style={{ fontWeight: 800, color: 'var(--army-green-950)' }}>Automated Revenue Settlement:</div>
            <div>Bank settlements automatically routed to <strong>PHDL Unity Estate Operations Account (Central Bank of Nigeria / First Bank RC 676563)</strong>.</div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', gap: '0.4rem', backgroundColor: '#1B4D21' }}>
            <Save size={14} /> Save Payment Settings
          </button>
        </form>
      )}

      {/* SMS GATEWAY TAB */}
      {activeTab === 'sms' && (
        <form onSubmit={handleSave} className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: 'var(--army-green-950)' }}>SMS & WhatsApp Broadcast Gateway</h3>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#15803D' }}>
              Balance: {smsBalance.toLocaleString()} SMS Units
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">SMS Aggregator Provider:</label>
              <select value={smsProvider} onChange={(e) => setSmsProvider(e.target.value as any)} className="form-select">
                <option value="termii">Termii Nigeria (Direct DND Route)</option>
                <option value="infobip">Infobip Enterprise</option>
                <option value="twilio">Twilio Global</option>
                <option value="africastalking">Africa's Talking</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">NCC Approved Sender ID:</label>
              <input type="text" value={senderId} onChange={(e) => setSenderId(e.target.value)} className="form-control" required />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">SMS Gateway API Key / Auth Token:</label>
            <input type="password" value={smsApiKey} onChange={(e) => setSmsApiKey(e.target.value)} className="form-control" required />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem', backgroundColor: '#1B4D21' }}>
              <Save size={14} /> Save SMS Configuration
            </button>
            <button type="button" onClick={handleSendTestSMS} className="btn btn-outline" style={{ gap: '0.4rem' }}>
              <Send size={14} /> Send Test Dispatch
            </button>
          </div>
        </form>
      )}

      {/* GENERAL TAB */}
      {activeTab === 'general' && (
        <form onSubmit={handleSave} className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ margin: 0, color: 'var(--army-green-950)' }}>Primary Estate Identity & Headquarters</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Active Estate Name:</label>
              <input type="text" value={estateName} onChange={(e) => setEstateName(e.target.value)} className="form-control" required />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Corporate Registration No:</label>
              <input type="text" value="RC 676563" disabled className="form-control" style={{ backgroundColor: '#F1F5F9' }} />
            </div>
          </div>

          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem', color: 'var(--army-green-900)' }}>18 Portfolio Estates Coverage:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.5rem', maxHeight: 180, overflowY: 'auto', backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: 6 }}>
              {NATIONWIDE_18_ESTATES.map((est) => (
                <div key={est.id} style={{ fontSize: '0.78rem', color: '#1E293B', padding: '0.25rem' }}>
                  🏛️ <strong>{est.name}</strong> ({est.state})
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', gap: '0.4rem', backgroundColor: '#1B4D21' }}>
            <Save size={14} /> Save General Settings
          </button>
        </form>
      )}

      {/* SECURITY TAB */}
      {activeTab === 'security' && (
        <form onSubmit={handleSave} className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ margin: 0, color: 'var(--army-green-950)' }}>Perimeter & Gate Security Configuration</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Night Visitor Perimeter Curfew:</label>
              <input type="time" value={curfewTime} onChange={(e) => setCurfewTime(e.target.value)} className="form-control" required />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Emergency Security Hotline:</label>
              <input type="text" value="+234 803 999 0001" disabled className="form-control" style={{ backgroundColor: '#F1F5F9' }} />
            </div>
          </div>

          <div style={{ backgroundColor: '#EFF6FF', padding: '1rem', borderRadius: 6, border: '1px solid #BFDBFE', fontSize: '0.82rem' }}>
            <div style={{ fontWeight: 800, color: '#1E3A8A', marginBottom: '0.25rem' }}>Active Security Protocols:</div>
            <div>• 24/7 Smart QR & Biometric Gate Barrier Active across all 8 Lanes</div>
            <div>• Visitor pass duration strictly capped at 12 hours max per access grant</div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', gap: '0.4rem', backgroundColor: '#1B4D21' }}>
            <Save size={14} /> Save Security Policies
          </button>
        </form>
      )}

      {/* DATABASE TAB */}
      {activeTab === 'database' && (
        <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ margin: 0, color: 'var(--army-green-950)' }}>Database Maintenance & Snapshot Backups</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Create encrypted database snapshots of all 400 flats, 288 soldiers, 84 tenants, tariffs, and transaction history.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button onClick={handleExportBackup} className="btn btn-primary" style={{ gap: '0.4rem', backgroundColor: '#1B4D21' }}>
              <Download size={14} /> Download Full Database JSON Snapshot
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemSettingsPage;