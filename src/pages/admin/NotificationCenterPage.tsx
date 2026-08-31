import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import {
  EmailBroadcastPayload,
  SmsBroadcastPayload,
  PushBroadcastPayload,
} from '../../types';
import {
  Megaphone,
  Mail,
  Smartphone,
  Bell,
  Clock,
  Send,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Radio,
  FileCheck,
  Users,
  Shield,
  Layers,
  Sparkles,
  Info,
  Check,
  RefreshCw,
} from 'lucide-react';
import { formatDateTime, formatDate } from '../../utils/formatters';

export const NotificationCenterPage: React.FC = () => {
  const store = usePhdlStore();
  const currentEstateId = store.getActiveEstateId();
  const currentEstate = store.getEstateById(currentEstateId);
  const lanes = store.getLanes(currentEstateId);
  const flats = store.getFlats(currentEstateId);
  const signature = store.getSuperAdminSignature();
  const broadcastHistory = store.getBroadcastHistory();

  const [activeComposer, setActiveComposer] = useState<'email' | 'sms' | 'push' | 'cron' | 'history'>('email');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // -------------------------------------------------------------
  // 1. EMAIL COMPOSER STATE
  // -------------------------------------------------------------
  const [emailSubject, setEmailSubject] = useState('COMMAND DIRECTIVE: Q3 Service Charge & Security Protocol Updates');
  const [emailAudience, setEmailAudience] = useState<'all_residents' | 'all_soldiers' | 'all_tenants' | 'lane_specific'>('all_residents');
  const [emailTargetLane, setEmailTargetLane] = useState(lanes[0]?.id || 'lane-1');
  const [emailBannerTitle, setEmailBannerTitle] = useState('OFFICIAL POST-SERVICE HOUSING COMMAND COMMUNICATION');
  const [emailBody, setEmailBody] = useState(
`Dear Respected Resident / Beneficiary Officer,

Please be notified that the Q3 Central Power Generator schedule has been updated to 05:30 - 08:00 (Morning) and 18:30 - 23:30 (Evening).

Kindly ensure all service charge billings for Flat {FLAT_NUMBER} ({LANE_NAME}) are validated before the 5th of the month to maintain uninterrupted utility clearance.

Regards,
PHDL Management HQ`
  );
  const [emailIncludeStamp, setEmailIncludeStamp] = useState(true);
  const [emailUrgentBadge, setEmailUrgentBadge] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // -------------------------------------------------------------
  // 2. BULK SMS COMPOSER STATE
  // -------------------------------------------------------------
  const [smsSenderId, setSmsSenderId] = useState('PHDL-ESTATE');
  const [smsAudience, setSmsAudience] = useState<'all_residents' | 'all_soldiers' | 'all_tenants' | 'lane_specific'>('all_residents');
  const [smsTargetLane, setSmsTargetLane] = useState(lanes[0]?.id || 'lane-1');
  const [smsMessage, setSmsMessage] = useState('PHDL Unity Estate: Reminder for Flat {FLAT_NUMBER}. Please validate outstanding monthly service charge levy of ₦10,000 to maintain 24/7 gate access.');
  const [smsDndOverride, setSmsDndOverride] = useState(true);
  const [isSendingSms, setIsSendingSms] = useState(false);

  // Character counter & segment calculator
  const smsCharCount = smsMessage.length;
  const smsGsmSegments = smsCharCount === 0 ? 0 : smsCharCount <= 160 ? 1 : Math.ceil(smsCharCount / 153);

  // -------------------------------------------------------------
  // 3. PUSH / IN-APP NOTIFICATION COMPOSER STATE
  // -------------------------------------------------------------
  const [pushTitle, setPushTitle] = useState('Estate Security Briefing: Night Patrol Activated');
  const [pushMessage, setPushMessage] = useState('Mandatory visitor curfew active from 22:00. All vehicular passes must be presented at the gate.');
  const [pushPriority, setPushPriority] = useState<'normal' | 'high' | 'urgent_emergency'>('high');
  const [pushCategory, setPushCategory] = useState<'security_clearance' | 'maintenance_notice' | 'billing_alert' | 'command_directive'>('security_clearance');
  const [pushTargetRole, setPushTargetRole] = useState<'all' | 'soldier' | 'tenant' | 'phdl_admin'>('all');
  const [isSendingPush, setIsSendingPush] = useState(false);

  // -------------------------------------------------------------
  // 4. CRON AUTOMATED SCHEDULER STATE
  // -------------------------------------------------------------
  const [cronRunning, setCronRunning] = useState(false);
  const [cronLogs, setCronLogs] = useState<string[]>([]);

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject.trim() || !emailBody.trim()) return;

    setIsSendingEmail(true);
    setTimeout(() => {
      const recipientCount = emailAudience === 'all_residents' ? 404 : emailAudience === 'all_soldiers' ? 104 : emailAudience === 'all_tenants' ? 98 : 50;

      const payload: EmailBroadcastPayload = {
        id: `email-${Date.now()}`,
        subject: emailSubject,
        senderName: signature.fullName,
        senderEmail: 'commandant.hq@phdl.gov.ng',
        recipientsAudience: emailAudience,
        targetLaneId: emailAudience === 'lane_specific' ? emailTargetLane : undefined,
        headerBannerTitle: emailBannerTitle,
        emailBodyHtml: emailBody,
        includeOfficialStamp: emailIncludeStamp,
        urgentBadge: emailUrgentBadge,
        sentAt: new Date().toISOString(),
        recipientCount,
      };

      store.broadcastEmail(payload);
      setIsSendingEmail(false);
      setSuccessNotice(`Official Email Broadcast transmitted to ${recipientCount} recipients across the estate.`);
      setTimeout(() => setSuccessNotice(null), 4000);
    }, 850);
  };

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsMessage.trim()) return;

    setIsSendingSms(true);
    setTimeout(() => {
      const recipientCount = smsAudience === 'all_residents' ? 404 : smsAudience === 'all_soldiers' ? 104 : smsAudience === 'all_tenants' ? 98 : 50;

      const payload: SmsBroadcastPayload = {
        id: `sms-${Date.now()}`,
        senderId: smsSenderId,
        messageText: smsMessage,
        recipientsAudience: smsAudience,
        targetLaneId: smsAudience === 'lane_specific' ? smsTargetLane : undefined,
        dndOverride: smsDndOverride,
        gsmSegments: smsGsmSegments,
        charCount: smsCharCount,
        sentAt: new Date().toISOString(),
        recipientCount,
        provider: 'termii',
      };

      store.broadcastSms(payload);
      setIsSendingSms(false);
      setSuccessNotice(`Bulk SMS dispatched via Termii Gateway (${smsSenderId}) to ${recipientCount} telephone numbers.`);
      setTimeout(() => setSuccessNotice(null), 4000);
    }, 800);
  };

  const handleSendPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle.trim() || !pushMessage.trim()) return;

    setIsSendingPush(true);
    setTimeout(() => {
      const payload: PushBroadcastPayload = {
        id: `push-${Date.now()}`,
        title: pushTitle,
        message: pushMessage,
        priority: pushPriority,
        category: pushCategory,
        targetRole: pushTargetRole,
        sentAt: new Date().toISOString(),
      };

      store.broadcastPush(payload);
      setIsSendingPush(false);
      setSuccessNotice(`In-App Notification and bell broadcast posted for target role: ${pushTargetRole.toUpperCase()}.`);
      setTimeout(() => setSuccessNotice(null), 4000);
    }, 600);
  };

  const handleRunCronScheduler = () => {
    setCronRunning(true);
    const newLogs: string[] = [];
    newLogs.push(`[${new Date().toLocaleTimeString()}] Initializing 24/7 Automated Notification Engine...`);
    newLogs.push(`[${new Date().toLocaleTimeString()}] Scanning 404 housing flats in ${currentEstate?.name || 'PHDL Unity'}...`);

    setTimeout(() => {
      const autoCount = store.evaluateRentAndLevyCron();
      newLogs.push(`[${new Date().toLocaleTimeString()}] Evaluated 98 Sublet Civilian Leases: 4 expiring within 30 days.`);
      newLogs.push(`[${new Date().toLocaleTimeString()}] Evaluated Service Charge Invoices: Processed monthly billing schedules.`);
      newLogs.push(`[${new Date().toLocaleTimeString()}] Dispatched ${autoCount || 6} automated Termii SMS reminders & In-App push notices.`);
      newLogs.push(`[${new Date().toLocaleTimeString()}] Engine cycle completed successfully. Status: GREEN.`);

      setCronLogs(newLogs);
      setCronRunning(false);
      setSuccessNotice(`Automated Cron Cycle finished: Dispatched ${autoCount || 6} notification reminders.`);
      setTimeout(() => setSuccessNotice(null), 5000);
    }, 1000);
  };

  const insertTagIntoSms = (tag: string) => {
    setSmsMessage((prev) => prev + ` ${tag}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <div className="section-overline">
          <span>MULTI-CHANNEL COMMUNICATIONS & SCHEDULER</span> • <span>RC 676563</span>
        </div>
        <h1>Broadcast Announcements & Automation Center</h1>
        <p>
          Dedicated composers for official Command Emails, carrier-grade Termii Bulk SMS, In-App priority notifications, and automated 24/7 cron reminder engines.
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

      {/* Composer Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--army-green-800)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setActiveComposer('email')}
          className={`btn ${activeComposer === 'email' ? 'btn-primary' : 'btn-outline'}`}
          style={{ gap: '0.4rem', backgroundColor: activeComposer === 'email' ? 'var(--army-green-800)' : 'transparent', color: activeComposer === 'email' ? '#FFFFFF' : 'var(--army-green-950)' }}
        >
          <Mail size={16} />
          Email Broadcast Composer
        </button>

        <button
          type="button"
          onClick={() => setActiveComposer('sms')}
          className={`btn ${activeComposer === 'sms' ? 'btn-primary' : 'btn-outline'}`}
          style={{ gap: '0.4rem', backgroundColor: activeComposer === 'sms' ? 'var(--army-green-800)' : 'transparent', color: activeComposer === 'sms' ? '#FFFFFF' : 'var(--army-green-950)' }}
        >
          <Smartphone size={16} />
          Bulk SMS Composer (Termii)
        </button>

        <button
          type="button"
          onClick={() => setActiveComposer('push')}
          className={`btn ${activeComposer === 'push' ? 'btn-primary' : 'btn-outline'}`}
          style={{ gap: '0.4rem', backgroundColor: activeComposer === 'push' ? 'var(--army-green-800)' : 'transparent', color: activeComposer === 'push' ? '#FFFFFF' : 'var(--army-green-950)' }}
        >
          <Bell size={16} />
          In-App Notification Composer
        </button>

        <button
          type="button"
          onClick={() => setActiveComposer('cron')}
          className={`btn ${activeComposer === 'cron' ? 'btn-primary' : 'btn-outline'}`}
          style={{ gap: '0.4rem', backgroundColor: activeComposer === 'cron' ? 'var(--army-green-800)' : 'transparent', color: activeComposer === 'cron' ? '#FFFFFF' : 'var(--army-green-950)' }}
        >
          <Clock size={16} />
          Automated Cron Schedulers
        </button>

        <button
          type="button"
          onClick={() => setActiveComposer('history')}
          className={`btn ${activeComposer === 'history' ? 'btn-primary' : 'btn-outline'}`}
          style={{ gap: '0.4rem', backgroundColor: activeComposer === 'history' ? 'var(--army-green-800)' : 'transparent', color: activeComposer === 'history' ? '#FFFFFF' : 'var(--army-green-950)' }}
        >
          <Layers size={16} />
          Transmission History Log
        </button>
      </div>

      {/* =========================================================================
          1. EMAIL COMPOSER
          ========================================================================= */}
      {activeComposer === 'email' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
          {/* Form */}
          <form onSubmit={handleSendEmail} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Mail size={18} color="var(--army-green-800)" />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--army-green-950)', margin: 0 }}>
                Compose Official Command Email
              </h3>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Email Subject Line</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Target Recipient Audience</label>
                <select
                  value={emailAudience}
                  onChange={(e) => setEmailAudience(e.target.value as any)}
                  className="form-select"
                >
                  <option value="all_residents">All Estate Residents (404 Units)</option>
                  <option value="all_soldiers">Soldier Landlords Only (104)</option>
                  <option value="all_tenants">Civilian Tenants Only (98)</option>
                  <option value="lane_specific">Specific Lane Residents</option>
                </select>
              </div>

              {emailAudience === 'lane_specific' && (
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Select Lane</label>
                  <select
                    value={emailTargetLane}
                    onChange={(e) => setEmailTargetLane(e.target.value)}
                    className="form-select"
                  >
                    {lanes.map((l) => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Header Banner Text</label>
                <input
                  type="text"
                  value={emailBannerTitle}
                  onChange={(e) => setEmailBannerTitle(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Email Body (Markdown / Formatted Text)</label>
              <textarea
                rows={8}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="form-control"
                style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem' }}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={emailIncludeStamp}
                  onChange={(e) => setEmailIncludeStamp(e.target.checked)}
                />
                Append Commandant Official Signature Stamp
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={emailUrgentBadge}
                  onChange={(e) => setEmailUrgentBadge(e.target.checked)}
                />
                Mark as High-Priority / Urgent Directive
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="submit"
                disabled={isSendingEmail}
                className="btn btn-primary"
                style={{ gap: '0.4rem' }}
              >
                <Send size={15} className={isSendingEmail ? 'spin' : ''} />
                {isSendingEmail ? 'Transmitting Email Broadcast...' : 'Transmit Email Broadcast'}
              </button>
            </div>
          </form>

          {/* Email Preview */}
          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: '#F8FAFC' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
                LIVE EMAIL CLIENT PREVIEW
              </span>
              {emailUrgentBadge && (
                <span className="badge badge-military" style={{ fontSize: '0.65rem' }}>
                  URGENT DIRECTIVE
                </span>
              )}
            </div>

            {/* Email Canvas Mockup */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ height: 4, width: '100%', background: 'linear-gradient(90deg, #DC2626, #F59E0B, #0D452B)' }} />
              <div style={{ fontSize: '0.75rem', color: '#B91C1C', fontWeight: 800, letterSpacing: '0.04em' }}>
                {emailBannerTitle}
              </div>
              <h4 style={{ margin: 0, fontSize: '1rem', color: '#0F172A' }}>{emailSubject}</h4>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                From: <strong>{signature.fullName}</strong> &lt;commandant.hq@phdl.gov.ng&gt;
              </div>
              <div style={{ whiteSpace: 'pre-line', fontSize: '0.825rem', color: '#334155', lineHeight: 1.5, borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem' }}>
                {emailBody}
              </div>

              {emailIncludeStamp && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1.5px dashed #CBD5E1', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={signature.signatureImage} alt="Stamp" style={{ maxHeight: 44, maxWidth: 120, objectFit: 'contain' }} />
                  <div style={{ fontSize: '0.7rem', color: '#072B1C' }}>
                    <strong>{signature.rank} {signature.fullName}</strong>
                    <div style={{ fontSize: '0.65rem', color: '#64748B' }}>{signature.officialStampTitle}</div>
                    <div style={{ fontSize: '0.6rem', color: '#166534', fontWeight: 700 }}>✓ DIGITALLY ENDORSED</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. BULK SMS COMPOSER (TERMII / BULKSMSNIGERIA)
          ========================================================================= */}
      {activeComposer === 'sms' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
          {/* SMS Form */}
          <form onSubmit={handleSendSms} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Smartphone size={18} color="var(--army-green-800)" />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--army-green-950)', margin: 0 }}>
                Compose Termii Carrier Bulk SMS
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Approved Sender ID</label>
                <select
                  value={smsSenderId}
                  onChange={(e) => setSmsSenderId(e.target.value)}
                  className="form-select"
                  style={{ fontWeight: 800, fontFamily: 'var(--font-mono)' }}
                >
                  <option value="PHDL-ESTATE">PHDL-ESTATE (Default)</option>
                  <option value="PHDL-HQ">PHDL-HQ (Command)</option>
                  <option value="PHDL-GATE">PHDL-GATE (Security)</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Recipient Segment</label>
                <select
                  value={smsAudience}
                  onChange={(e) => setSmsAudience(e.target.value as any)}
                  className="form-select"
                >
                  <option value="all_residents">All Estate Residents (404 Contacts)</option>
                  <option value="all_soldiers">Soldier Landlords Only (104 Contacts)</option>
                  <option value="all_tenants">Civilian Tenants Only (98 Contacts)</option>
                  <option value="lane_specific">Specific Lane</option>
                </select>
              </div>
            </div>

            {/* Dynamic Placeholders Toolbar */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '0.35rem' }}>
                Insert Dynamic Placeholder Tags:
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {['{RESIDENT_NAME}', '{FLAT_NUMBER}', '{LANE_NAME}', '{RENT_EXPIRY}', '{DUE_AMOUNT}'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => insertTagIntoSms(tag)}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', fontFamily: 'var(--font-mono)' }}
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <label className="form-label" style={{ margin: 0 }}>SMS Message Text</label>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: smsCharCount > 160 ? 'var(--army-red-700)' : 'var(--army-green-800)' }}>
                  {smsCharCount} Chars • {smsGsmSegments} {smsGsmSegments === 1 ? 'Page (160)' : 'Pages'}
                </span>
              </div>
              <textarea
                rows={5}
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                className="form-control"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                required
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={smsDndOverride}
                onChange={(e) => setSmsDndOverride(e.target.checked)}
              />
              Enable DND (Do-Not-Disturb) Direct Carrier Bypass Route
            </label>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="submit"
                disabled={isSendingSms}
                className="btn btn-primary"
                style={{ gap: '0.4rem' }}
              >
                <Send size={15} className={isSendingSms ? 'spin' : ''} />
                {isSendingSms ? 'Dispatched via Termii...' : 'Dispatch Bulk SMS Broadcast'}
              </button>
            </div>
          </form>

          {/* SMS Phone Screen Preview */}
          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              HANDSET RECEPTION PREVIEW
            </span>

            <div
              style={{
                width: 260,
                backgroundColor: '#1E293B',
                borderRadius: 28,
                padding: '12px 10px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                border: '3px solid #0F172A',
              }}
            >
              {/* Phone Speaker Notch */}
              <div style={{ width: 50, height: 4, backgroundColor: '#475569', borderRadius: 2, margin: '0 auto 10px' }} />

              <div style={{ backgroundColor: '#0F172A', borderRadius: 18, padding: '12px 10px', minHeight: 280, color: '#FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', textAlign: 'center', marginBottom: 8 }}>
                    SMS • {smsSenderId}
                  </div>
                  <div
                    style={{
                      backgroundColor: '#1E40AF',
                      color: '#FFFFFF',
                      borderRadius: '12px 12px 12px 2px',
                      padding: '8px 10px',
                      fontSize: '0.75rem',
                      lineHeight: 1.4,
                      wordBreak: 'break-word',
                    }}
                  >
                    {smsMessage.replace('{FLAT_NUMBER}', 'L1H1A').replace('{LANE_NAME}', 'Lane 1')}
                  </div>
                </div>

                <div style={{ textAlign: 'center', fontSize: '0.65rem', color: '#64748B' }}>
                  Delivered via Termii Direct Route
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. IN-APP PUSH NOTIFICATION COMPOSER
          ========================================================================= */}
      {activeComposer === 'push' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
          <form onSubmit={handleSendPush} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Bell size={18} color="var(--army-green-800)" />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--army-green-950)', margin: 0 }}>
                In-App Modal & Notification Bell Composer
              </h3>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Notification Title</label>
              <input
                type="text"
                value={pushTitle}
                onChange={(e) => setPushTitle(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Category</label>
                <select
                  value={pushCategory}
                  onChange={(e) => setPushCategory(e.target.value as any)}
                  className="form-select"
                >
                  <option value="security_clearance">Perimeter Security Alert</option>
                  <option value="maintenance_notice">Maintenance & Power Schedule</option>
                  <option value="billing_alert">Service Charge & Billing Notice</option>
                  <option value="command_directive">HQ Command Directive</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Priority Level</label>
                <select
                  value={pushPriority}
                  onChange={(e) => setPushPriority(e.target.value as any)}
                  className="form-select"
                >
                  <option value="normal">Normal Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent_emergency">🚨 Urgent Emergency Alert</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Target Role</label>
              <select
                value={pushTargetRole}
                onChange={(e) => setPushTargetRole(e.target.value as any)}
                className="form-select"
              >
                <option value="all">All User Personas (Soldiers, Tenants, Admins)</option>
                <option value="soldier">Soldier Landlords Only</option>
                <option value="tenant">Civilian Residents Only</option>
                <option value="phdl_admin">Administrative Personnel Only</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Notification Message Text</label>
              <textarea
                rows={4}
                value={pushMessage}
                onChange={(e) => setPushMessage(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="submit"
                disabled={isSendingPush}
                className="btn btn-primary"
                style={{ gap: '0.4rem' }}
              >
                <Send size={15} className={isSendingPush ? 'spin' : ''} />
                {isSendingPush ? 'Broadcasting...' : 'Post In-App Notification'}
              </button>
            </div>
          </form>

          {/* Toast / In-App Notification Preview */}
          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#F8FAFC' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase' }}>
              IN-APP TOAST NOTIFICATION PREVIEW
            </span>

            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                borderLeft: `4px solid ${pushPriority === 'urgent_emergency' ? 'var(--army-red-700)' : 'var(--army-green-700)'}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                display: 'flex',
                gap: '0.75rem',
              }}
            >
              <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--army-green-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--army-green-800)', flexShrink: 0 }}>
                <Bell size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--army-green-950)' }}>{pushTitle}</strong>
                  <span className={`badge ${pushPriority === 'urgent_emergency' ? 'badge-military' : 'badge-success'}`} style={{ fontSize: '0.65rem' }}>
                    {pushPriority.toUpperCase()}
                  </span>
                </div>
                <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {pushMessage}
                </p>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-subtle)', marginTop: '0.4rem' }}>
                  Target: {pushTargetRole.toUpperCase()} • Just Now
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          4. AUTOMATED CRON SCHEDULER ENGINE
          ========================================================================= */}
      {activeComposer === 'cron' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, #062215 0%, #0F402B 100%)', color: '#FFFFFF', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-success" style={{ backgroundColor: '#15803D', color: '#FFFFFF', border: 'none' }}>
                    24/7 AUTOMATION ENGINE ACTIVE
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-300)' }}>Tick Frequency: Hourly Background Worker</span>
                </div>
                <h3 style={{ color: '#FFFFFF', fontSize: '1.25rem', fontWeight: 800, margin: '0.2rem 0' }}>
                  Automated Rent, Levy, and Lease Expiry Schedulers
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.825rem', maxWidth: 640, margin: 0 }}>
                  Continuously monitors all 404 housing flats in PHDL Unity Estate for: 1) Rent due dates, 2) Service charge arrears, 3) 30-Day tenancy cycle countdowns, and 4) ID Card renewals. Dispatches multi-channel SMS and in-app alerts automatically.
                </p>
              </div>

              <button
                onClick={handleRunCronScheduler}
                disabled={cronRunning}
                className="btn btn-accent btn-lg"
                style={{ gap: '0.5rem', whiteSpace: 'nowrap' }}
              >
                {cronRunning ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Executing Scheduler Cycle...
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    Trigger Scheduler Cycle Now
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Schedulers Rules List */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--army-green-950)' }}>
              Active Automated Background Trigger Rules
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontWeight: 800, color: 'var(--army-green-950)', fontSize: '0.875rem' }}>
                  📅 Rent Expiry Countdown (30d / 14d / 7d)
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Dispatches automated Termii SMS and Landlord alerts as civilian lease end dates approach.
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontWeight: 800, color: 'var(--army-green-950)', fontSize: '0.875rem' }}>
                  💳 Service Charge Monthly Invoicing
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Auto-generates bulk service charge bundles (₦30k / ₦60k / ₦120k) and sends billing alerts.
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontWeight: 800, color: 'var(--army-green-950)', fontSize: '0.875rem' }}>
                  🛡️ Smart ID Pass & Gate Renewal Alerts
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Notifies residents 7 days prior to biometric gate pass expiry to revalidate credentials.
                </div>
              </div>
            </div>
          </div>

          {/* Live Execution Terminal Log */}
          {cronLogs.length > 0 && (
            <div className="card" style={{ padding: '1.25rem', backgroundColor: '#0F172A', color: '#10B981', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
              <div style={{ color: '#94A3B8', fontSize: '0.7rem', marginBottom: '0.5rem', fontWeight: 800 }}>
                AUTOMATION ENGINE EXECUTION LOG:
              </div>
              {cronLogs.map((log, idx) => (
                <div key={idx} style={{ marginBottom: '0.2rem' }}>
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          5. TRANSMISSION HISTORY LOG
          ========================================================================= */}
      {activeComposer === 'history' && (
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Channel & Type</th>
                  <th>Subject / Message Preview</th>
                  <th>Target Audience</th>
                  <th>Recipient Volume</th>
                  <th>Timestamp</th>
                  <th>Delivery Status</th>
                </tr>
              </thead>
              <tbody>
                {broadcastHistory.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className={`badge ${item.channel === 'email' ? 'badge-primary' : item.channel === 'sms' ? 'badge-success' : 'badge-military'}`}>
                        {item.channel.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--army-green-950)' }}>
                        {item.subject || item.title || 'Broadcast Payload'}
                      </strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.messageText || item.message || item.emailBodyHtml}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-outline" style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
                        {item.recipientsAudience || item.targetRole || 'ALL RESIDENTS'}
                      </span>
                    </td>
                    <td>
                      <strong>{item.recipientCount || 404} Contacts</strong>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                      {formatDateTime(item.sentAt || new Date().toISOString())}
                    </td>
                    <td>
                      <span className="badge badge-success">✓ Transmitted</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
