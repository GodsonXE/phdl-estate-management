import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { Bill, BillPayerRole, BillType, ServiceChargeConfig } from '../../types';
import {
  Receipt,
  CreditCard,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  DollarSign,
  Zap,
  Shield,
  Layers,
  X,
  History,
  MessageSquare,
  Lock,
  Calendar,
  Send,
  Building2,
  FileSpreadsheet,
} from 'lucide-react';
import {
  formatNaira,
  formatDate,
  getStatusBadgeClass,
  getStatusLabel,
  getBillTypeLabel,
} from '../../utils/formatters';
import { exportGenericToCSV } from '../../utils/exportUtils';

export const BillingManagementPage: React.FC = () => {
  const store = usePhdlStore();
  const currentEstateId = store.getActiveEstateId();
  const currentEstate = store.getEstateById(currentEstateId);
  const lanes = store.getLanes(currentEstateId);
  const flats = store.getFlats(currentEstateId);
  const bills = store.getBills(currentEstateId);
  const serviceConfig = store.getServiceChargeConfig();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLaneId, setSelectedLaneId] = useState<string>('all');
  const [selectedPayerRole, setSelectedPayerRole] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Service Charge Tariff State (SuperAdmin Only)
  const [monthlyChargeRate, setMonthlyChargeRate] = useState<number>(serviceConfig.standardMonthlyRate || serviceConfig.monthlyRate || 10000);
  const [tariffRemarks, setTariffRemarks] = useState<string>(serviceConfig.remarks || '');
  const [isSavingTariff, setIsSavingTariff] = useState(false);

  // Batch Service Charge Form
  const [batchPeriod, setBatchPeriod] = useState<3 | 6 | 12>(3);
  const [batchDueDate, setBatchDueDate] = useState<string>('2026-09-30');
  const [batchCustomTitle, setBatchCustomTitle] = useState<string>('');

  // New Generic Bill Form State
  const [newBillType, setNewBillType] = useState<BillType>('service_charge');
  const [newBillTitle, setNewBillTitle] = useState('Estate Service Charge (Q3 Bulk Payment)');
  const [newBillDesc, setNewBillDesc] = useState('Central generator diesel, perimeter security detachment, waste disposal.');
  const [newBillAmount, setNewBillAmount] = useState<number>(30000);
  const [newBillPayerRole, setNewBillPayerRole] = useState<BillPayerRole>('tenant');
  const [newBillOwnerPercent, setNewBillOwnerPercent] = useState<number>(0);
  const [newBillDueDate, setNewBillDueDate] = useState('2026-09-30');
  const [newBillTargetScope, setNewBillTargetScope] = useState<'all_flats' | 'single_flat'>('all_flats');
  const [newBillFlatId, setNewBillFlatId] = useState<string>(flats[0]?.id || 'flat-1');

  // Calculations
  const totalBilled = bills.reduce((acc, b) => acc + (b.totalAmount || b.amount || 0), 0);
  const totalCollected = bills.reduce((acc, b) => acc + (b.paidAmount || (b.ownerPaidAmount || 0) + (b.tenantPaidAmount || 0)), 0);
  const totalArrears = Math.max(0, totalBilled - totalCollected);
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  // Filtered Bills
  const filteredBills = bills.filter((bill) => {
    if (selectedType !== 'all' && bill.billType !== selectedType) return false;
    if (selectedStatus !== 'all' && bill.status !== selectedStatus) return false;
    if (selectedLaneId !== 'all' && bill.laneId !== selectedLaneId) return false;
    if (selectedPayerRole !== 'all' && (bill.payerRole || 'tenant') !== selectedPayerRole) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        (bill.invoiceNumber || bill.id).toLowerCase().includes(q) ||
        bill.title.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = [
      'Invoice Number',
      'Flat Code',
      'Lane',
      'Bill Type',
      'Title',
      'Total Amount (₦)',
      'Tenant Portion (₦)',
      'Owner Portion (₦)',
      'Due Date',
      'Status',
      'Issued Date',
    ];

    const rows = filteredBills.map((b) => {
      const f = flats.find((flat) => flat.id === b.flatId);
      const l = lanes.find((lane) => lane.id === b.laneId);
      return [
        b.invoiceNumber || b.id,
        f?.fullFlatCode || 'N/A',
        l?.name || 'N/A',
        b.billType,
        b.title,
        (b.totalAmount || b.amount || 0).toString(),
        (b.tenantPortion || 0).toString(),
        (b.ownerPortion || 0).toString(),
        formatDate(b.dueDate),
        getStatusLabel(b.status),
        formatDate(b.createdAt),
      ];
    });

    exportGenericToCSV(headers, rows, `PHDL_Invoices_Levies_${Date.now()}.csv`);
    setNoticeMessage(`Exported ${rows.length} invoices to CSV.`);
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  // Save Service Charge Tariff (SuperAdmin)
  const handleSaveServiceCharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tariffRemarks.trim()) {
      alert('Please provide remarks/justification for residents regarding the service charge rate.');
      return;
    }

    setIsSavingTariff(true);
    store.updateServiceChargeConfig({
      estateId: currentEstateId,
      standardMonthlyRate: monthlyChargeRate,
      monthlyRate: monthlyChargeRate,
      permittedBulkMultipliers: [3, 6, 12],
      activeBulkCharges: {
        threeMonths: monthlyChargeRate * 3,
        sixMonths: monthlyChargeRate * 6,
        annual: monthlyChargeRate * 12,
      },
      lastUpdatedDate: new Date().toISOString(),
      lastUpdatedBy: 'Col. Farouk Danjuma (Rtd.)',
      remarks: tariffRemarks.trim(),
    }, tariffRemarks.trim());

    setTimeout(() => {
      setIsSavingTariff(false);
      setNoticeMessage(
        `Service charge tariff updated to ₦${monthlyChargeRate.toLocaleString()}/month. Bulk payment tiers (3M: ₦${(
          monthlyChargeRate * 3
        ).toLocaleString()} | 6M: ₦${(monthlyChargeRate * 6).toLocaleString()} | 12M: ₦${(
          monthlyChargeRate * 12
        ).toLocaleString()}) broadcasted to all residents.`
      );
      setTimeout(() => setNoticeMessage(null), 6000);
    }, 400);
  };

  // Batch Generate Bulk Invoices
  const handleBatchGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const count = store.generateBulkServiceChargeInvoices({
      estateId: currentEstateId,
      periodMonths: batchPeriod,
      dueDate: batchDueDate,
      title: batchCustomTitle.trim() || undefined,
    });

    setShowBatchModal(false);
    setNoticeMessage(
      `Successfully generated and dispatched ${count} bulk service charge invoices (${batchPeriod} Months @ ₦${(
        monthlyChargeRate * batchPeriod
      ).toLocaleString()}) across active estate units.`
    );
    setTimeout(() => setNoticeMessage(null), 5000);
  };

  // Create single/custom bill
  const handleCreateBills = (e: React.FormEvent) => {
    e.preventDefault();
    const ownerShare = Math.round((newBillAmount * newBillOwnerPercent) / 100);
    const tenantShare = newBillAmount - ownerShare;

    if (newBillTargetScope === 'single_flat') {
      const targetFlat = flats.find((f) => f.id === newBillFlatId) || flats[0];
      const invNum = `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

      store.addBill({
        id: `bill-${Date.now()}`,
        invoiceNumber: invNum,
        flatId: targetFlat.id,
        estateId: currentEstateId,
        laneId: targetFlat.laneId,
        billType: newBillType as any,
        title: newBillTitle,
        description: newBillDesc,
        totalAmount: newBillAmount,
        ownerPortion: newBillPayerRole === 'tenant' ? 0 : newBillPayerRole === 'owner' ? newBillAmount : ownerShare,
        tenantPortion: newBillPayerRole === 'owner' ? 0 : newBillPayerRole === 'tenant' ? newBillAmount : tenantShare,
        payerRole: newBillPayerRole,
        billingPeriod: 'September 2026',
        dueDate: newBillDueDate,
        status: 'unpaid',
        ownerPaidAmount: 0,
        tenantPaidAmount: 0,
        createdAt: new Date().toISOString(),
      });

      setNoticeMessage(`Generated invoice ${invNum} for Flat ${targetFlat.fullFlatCode}.`);
    } else {
      const sampleBatch = flats.slice(0, 20);
      sampleBatch.forEach((f, idx) => {
        const invNum = `INV-SEP-${Math.floor(10000 + idx)}`;
        store.addBill({
          id: `bill-batch-${Date.now()}-${idx}`,
          invoiceNumber: invNum,
          flatId: f.id,
          estateId: currentEstateId,
          laneId: f.laneId,
          billType: newBillType as any,
          title: newBillTitle,
          description: newBillDesc,
          totalAmount: newBillAmount,
          ownerPortion: newBillPayerRole === 'tenant' ? 0 : newBillPayerRole === 'owner' ? newBillAmount : ownerShare,
          tenantPortion: newBillPayerRole === 'owner' ? 0 : newBillPayerRole === 'tenant' ? newBillAmount : tenantShare,
          payerRole: newBillPayerRole,
          billingPeriod: 'September 2026',
          dueDate: newBillDueDate,
          status: 'unpaid',
          ownerPaidAmount: 0,
          tenantPaidAmount: 0,
          createdAt: new Date().toISOString(),
        });
      });

      setNoticeMessage(`Dispatched ${newBillTitle} across estate housing units.`);
    }

    setShowCreateModal(false);
    setTimeout(() => setNoticeMessage(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline">
            <span>ESTATE TREASURY & LEVIES</span> • <span>RC 676563</span>
          </div>
          <h1>{currentEstate?.name} Billing & Service Levies</h1>
          <p>
            SuperAdmin-controlled monthly service charge tariff, bulk payment rules (3M, 6M, 12M), resident justification remarks, and invoice dispatch.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button onClick={handleExportCSV} className="btn btn-outline" style={{ gap: '0.4rem' }}>
            <FileSpreadsheet size={16} />
            Export Invoices CSV ({filteredBills.length})
          </button>
          <button
            onClick={() => setShowBatchModal(true)}
            className="btn btn-primary"
            style={{ gap: '0.4rem', backgroundColor: 'var(--army-green-800)' }}
          >
            <Send size={16} />
            Batch Issue Bulk Service Charge
          </button>
          <button onClick={() => setShowCreateModal(true)} className="btn btn-outline" style={{ gap: '0.4rem' }}>
            <PlusCircle size={16} />
            Custom Bill
          </button>
        </div>
      </div>

      {noticeMessage && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--status-success-border)' }}>
          <CheckCircle2 size={16} />
          {noticeMessage}
        </div>
      )}

      {/* =========================================================================
          SUPERADMIN SERVICE CHARGE & BULK LEVY MANAGER (CRITICAL FEATURE)
          ========================================================================= */}
      <div className="card card-army-accent" style={{ backgroundColor: '#FFFFFF', border: '2px solid var(--army-green-800)' }}>
        <div className="card-header" style={{ borderBottom: '1px solid var(--army-green-100)', paddingBottom: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--army-green-800)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={16} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--army-green-950)', margin: 0 }}>
                SuperAdmin Service Charge Tariff & Bulk Payment Policy
              </h3>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
              Mandatory estate levy of ₦10,000/mo. Tenants pay strictly in bulk bundles (3 Mos: ₦30k | 6 Mos: ₦60k | Annual: ₦120k).
            </div>
          </div>

          <button
            onClick={() => setShowHistoryModal(true)}
            className="btn btn-ghost btn-sm"
            style={{ gap: '0.35rem', color: 'var(--army-green-800)', fontWeight: 700 }}
          >
            <History size={14} />
            Tariff Change History ({serviceConfig.history?.length || 0})
          </button>
        </div>

        <form onSubmit={handleSaveServiceCharge}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', alignItems: 'flex-start' }}>
            {/* Monthly Rate & Calculated Tiers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Standard Monthly Service Charge (₦)</span>
                  <span className="badge badge-military" style={{ fontSize: '0.65rem' }}>
                    <Lock size={10} style={{ marginRight: '0.2rem' }} /> SuperAdmin Exclusive
                  </span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    value={monthlyChargeRate}
                    onChange={(e) => setMonthlyChargeRate(Math.max(1000, Number(e.target.value)))}
                    className="form-control"
                    style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--army-green-950)', paddingLeft: '2.2rem' }}
                    step={1000}
                    min={1000}
                    required
                  />
                  <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: 'var(--army-green-800)' }}>
                    ₦
                  </span>
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)', marginTop: '0.3rem' }}>
                  Base rate applicable to every tenant unit across {currentEstate?.name}.
                </div>
              </div>

              {/* Live Bulk Payment Calculation Tiers */}
              <div style={{ backgroundColor: 'var(--army-green-50)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--army-green-200)' }}>
                <div style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--army-green-900)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
                  Approved Bulk Payment Tiers (Tenants Pay Directly to Estate)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                  <div style={{ backgroundColor: '#FFFFFF', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--army-green-200)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.675rem', color: 'var(--text-subtle)', fontWeight: 700 }}>3 MONTHS</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--army-green-950)' }}>
                      {formatNaira(monthlyChargeRate * 3)}
                    </div>
                    <div style={{ fontSize: '0.625rem', color: 'var(--army-green-700)', fontWeight: 600 }}>Quarterly</div>
                  </div>

                  <div style={{ backgroundColor: '#FFFFFF', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--army-green-200)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.675rem', color: 'var(--text-subtle)', fontWeight: 700 }}>6 MONTHS</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--army-green-950)' }}>
                      {formatNaira(monthlyChargeRate * 6)}
                    </div>
                    <div style={{ fontSize: '0.625rem', color: 'var(--army-green-700)', fontWeight: 600 }}>Bi-Annual</div>
                  </div>

                  <div style={{ backgroundColor: '#FFFFFF', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--army-gold-500)', textAlign: 'center', position: 'relative' }}>
                    <div style={{ fontSize: '0.675rem', color: 'var(--army-gold-800)', fontWeight: 800 }}>12 MONTHS</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--army-green-950)' }}>
                      {formatNaira(monthlyChargeRate * 12)}
                    </div>
                    <div style={{ fontSize: '0.625rem', color: 'var(--army-gold-700)', fontWeight: 700 }}>Full Year</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Remarks / Justification Textbox */}
            <div className="form-group" style={{ margin: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MessageSquare size={14} color="var(--army-red-700)" />
                <span>SuperAdmin Remarks & Justification for Residents</span>
              </label>
              <textarea
                value={tariffRemarks}
                onChange={(e) => setTariffRemarks(e.target.value)}
                className="form-control"
                rows={5}
                placeholder="State the official rationale for this levy (e.g. Approved by PHDL Board: Adjusted to sustain 24/7 military gate security, borehole filtration, solar street lighting, and waste evacuation)."
                style={{ resize: 'vertical', fontSize: '0.825rem', lineHeight: 1.45, flex: 1 }}
                required
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                  This statement will be visible on all tenant invoices and payment portals.
                </span>
                <button
                  type="submit"
                  disabled={isSavingTariff}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '0.35rem', backgroundColor: 'var(--army-green-800)' }}
                >
                  <CheckCircle2 size={14} />
                  {isSavingTariff ? 'Updating...' : 'Save & Publish Tariff'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* KPI Stats Bar */}
      <div className="stat-grid">
        <div className="stat-card">
          <div>
            <div className="stat-label">Total Invoiced (Billed)</div>
            <div className="stat-value">{formatNaira(totalBilled)}</div>
            <div className="stat-subtext">{bills.length} Total Estate Invoices</div>
          </div>
          <div className="stat-icon-wrapper">
            <Receipt size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Revenue Collected</div>
            <div className="stat-value" style={{ color: 'var(--army-green-800)' }}>{formatNaira(totalCollected)}</div>
            <div className="stat-subtext">Collection compliance rate: {collectionRate}%</div>
          </div>
          <div className="stat-icon-wrapper">
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Pending Arrears</div>
            <div className="stat-value" style={{ color: 'var(--army-red-700)' }}>{formatNaira(totalArrears)}</div>
            <div className="stat-subtext">{bills.filter((b) => b.status === 'overdue').length} Overdue Invoices</div>
          </div>
          <div className="stat-icon-wrapper stat-icon-wrapper-red">
            <AlertTriangle size={22} />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
          <Filter size={16} color="var(--army-green-800)" />
          <strong style={{ fontSize: '0.85rem', color: 'var(--army-green-950)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Filter Invoices ({filteredBills.length} Matching)
          </strong>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.85rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Search Invoices</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Invoice, flat code, title..."
                className="form-control"
                style={{ paddingLeft: '2rem' }}
              />
              <Search size={15} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Bill Type</label>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="form-select">
              <option value="all">All Bill Types</option>
              <option value="service_charge">Service Charge</option>
              <option value="power_electricity">Power / Electricity</option>
              <option value="security_levy">Security Levy</option>
              <option value="infrastructure_levy">Infrastructure Levy</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Payment Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="form-select">
              <option value="all">All Statuses</option>
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid (Settled)</option>
              <option value="overdue">Overdue</option>
              <option value="partially_paid">Partially Paid</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Lane</label>
            <select value={selectedLaneId} onChange={(e) => setSelectedLaneId(e.target.value)} className="form-select">
              <option value="all">All 8 Lanes</option>
              {lanes.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Payer Assignment</label>
            <select value={selectedPayerRole} onChange={(e) => setSelectedPayerRole(e.target.value)} className="form-select">
              <option value="all">All Payers</option>
              <option value="tenant">Tenant (100%)</option>
              <option value="owner">Soldier Landlord (100%)</option>
              <option value="split">Shared Split (Owner + Tenant)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Data Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Receipt size={18} />
            Estate Invoices & Levies Ledger ({filteredBills.length})
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Flat & Lane</th>
                <th>Bill Type / Title</th>
                <th>Total (₦)</th>
                <th>Tenant Share</th>
                <th>Owner Share</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.slice(0, 100).map((bill) => {
                const flat = flats.find((f) => f.id === bill.flatId);
                const lane = lanes.find((l) => l.id === bill.laneId);

                return (
                  <tr key={bill.id}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--army-green-950)', fontFamily: 'var(--font-mono)' }}>
                        {bill.invoiceNumber}
                      </div>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-subtle)' }}>
                        {formatDate(bill.createdAt)}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>Flat {flat?.fullFlatCode || 'N/A'}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)' }}>{lane?.name}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{bill.title}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)' }}>
                        {bill.billingPeriod} • {getBillTypeLabel(bill.billType)}
                      </div>
                    </td>
                    <td>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--army-green-950)' }}>
                        {formatNaira(bill.totalAmount || bill.amount || 0)}
                      </strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0369A1' }}>
                        {formatNaira(bill.tenantPortion || 0)}
                      </div>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-subtle)' }}>
                        Paid: {formatNaira(bill.tenantPaidAmount || 0)}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--army-green-800)' }}>
                        {formatNaira(bill.ownerPortion || 0)}
                      </div>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-subtle)' }}>
                        Paid: {formatNaira(bill.ownerPaidAmount || bill.paidAmount || 0)}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{formatDate(bill.dueDate)}</div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(bill.status)}`}>
                        {getStatusLabel(bill.status)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Batch Issue Bulk Service Charge Invoices Modal */}
      {showBatchModal && (
        <div className="modal-backdrop" onClick={() => setShowBatchModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <form onSubmit={handleBatchGenerate}>
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Send size={18} />
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Batch Issue Bulk Service Charge Invoices</h3>
                </div>
                <button type="button" onClick={() => setShowBatchModal(false)} className="btn btn-ghost btn-sm" style={{ color: '#FFFFFF' }}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--army-green-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--army-green-200)', fontSize: '0.8rem', color: 'var(--army-green-900)' }}>
                  This will generate service charge invoices for all occupied flats in {currentEstate?.name} under the active <strong>₦{monthlyChargeRate.toLocaleString()}/mo</strong> tariff.
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Select Bulk Period Cycle</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setBatchPeriod(3)}
                      className={`btn ${batchPeriod === 3 ? 'btn-primary' : 'btn-outline'}`}
                      style={{ flexDirection: 'column', padding: '0.65rem 0.4rem', fontSize: '0.8rem' }}
                    >
                      <strong>3 Months</strong>
                      <span style={{ fontSize: '0.75rem' }}>{formatNaira(monthlyChargeRate * 3)}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBatchPeriod(6)}
                      className={`btn ${batchPeriod === 6 ? 'btn-primary' : 'btn-outline'}`}
                      style={{ flexDirection: 'column', padding: '0.65rem 0.4rem', fontSize: '0.8rem' }}
                    >
                      <strong>6 Months</strong>
                      <span style={{ fontSize: '0.75rem' }}>{formatNaira(monthlyChargeRate * 6)}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBatchPeriod(12)}
                      className={`btn ${batchPeriod === 12 ? 'btn-primary' : 'btn-outline'}`}
                      style={{ flexDirection: 'column', padding: '0.65rem 0.4rem', fontSize: '0.8rem' }}
                    >
                      <strong>12 Months</strong>
                      <span style={{ fontSize: '0.75rem' }}>{formatNaira(monthlyChargeRate * 12)}</span>
                    </button>
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Invoice Due Date</label>
                  <input
                    type="date"
                    value={batchDueDate}
                    onChange={(e) => setBatchDueDate(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Custom Invoice Title (Optional)</label>
                  <input
                    type="text"
                    value={batchCustomTitle}
                    onChange={(e) => setBatchCustomTitle(e.target.value)}
                    placeholder={`e.g. Estate Service Charge (${batchPeriod === 3 ? 'Quarterly' : batchPeriod === 6 ? 'Bi-Annual' : 'Annual'})`}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowBatchModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem' }}>
                  <Send size={15} />
                  Dispatch Invoices ({formatNaira(monthlyChargeRate * batchPeriod)} / Unit)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tariff Change History Modal */}
      {showHistoryModal && (
        <div className="modal-backdrop" onClick={() => setShowHistoryModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 580 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <History size={18} />
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Service Charge Tariff Audit Trail</h3>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="btn btn-ghost btn-sm" style={{ color: '#FFFFFF' }}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: 400, overflowY: 'auto' }}>
              {!serviceConfig.history || serviceConfig.history.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
                  Initial baseline tariff (₦10,000/mo) established by PHDL Board. No revisions logged yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {serviceConfig.history.map((log: any) => (
                    <div key={log.id} style={{ padding: '0.85rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--army-green-950)' }}>
                          Tariff: {formatNaira(log.previousMonthlyRate)} → {formatNaira(log.newMonthlyRate)} / mo
                        </strong>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                          {formatDate(log.date)}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.2rem' }}>
                        "{log.remarks}"
                      </div>
                      <div style={{ fontSize: '0.675rem', color: 'var(--army-green-800)', marginTop: '0.3rem', fontWeight: 600 }}>
                        Modified by: {log.changedBy}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={() => setShowHistoryModal(false)} className="btn btn-primary">
                Close Audit Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Custom Bill Modal */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 580 }}>
            <form onSubmit={handleCreateBills}>
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <PlusCircle size={18} />
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Create Custom Invoice</h3>
                </div>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-ghost btn-sm" style={{ color: '#FFFFFF' }}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Bill Type</label>
                  <select value={newBillType} onChange={(e) => setNewBillType(e.target.value as BillType)} className="form-select">
                    <option value="service_charge">Service Charge</option>
                    <option value="power_electricity">Power / Electricity Supply</option>
                    <option value="security_levy">Security Levy</option>
                    <option value="infrastructure_levy">Infrastructure / Road Levy</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Bill Title</label>
                  <input type="text" value={newBillTitle} onChange={(e) => setNewBillTitle(e.target.value)} className="form-control" required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Total Amount (₦)</label>
                    <input type="number" value={newBillAmount} onChange={(e) => setNewBillAmount(Number(e.target.value))} className="form-control" step={1000} min={1000} required />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Due Date</label>
                    <input type="date" value={newBillDueDate} onChange={(e) => setNewBillDueDate(e.target.value)} className="form-control" required />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Payer Assignment</label>
                  <select value={newBillPayerRole} onChange={(e) => setNewBillPayerRole(e.target.value as BillPayerRole)} className="form-select">
                    <option value="tenant">Tenant (100%)</option>
                    <option value="owner">Soldier Landlord (100%)</option>
                    <option value="split">Shared Split Ratio</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
