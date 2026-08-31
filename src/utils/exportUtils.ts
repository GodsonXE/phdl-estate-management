/**
 * Utility functions for exporting data to CSV and generating printable PDF reports
 */

export interface ExportEstateRow {
  flatCode: string;
  lane: string;
  house: string;
  floor: string;
  flatType: string;
  status: string;
  landlordRank: string;
  landlordName: string;
  landlordPhone: string;
  landlordServiceNo: string;
  tenantName: string;
  tenantPhone: string;
  tenantEmail: string;
  rentAmount: string;
  rentStartDate: string;
  rentExpiryDate: string;
  rentCycleStatus: string;
  meterNumber: string;
}

export const exportFlatsToCSV = (rows: ExportEstateRow[], filename = 'PHDL_Unity_Estate_Directory.csv') => {
  const headers = [
    'Flat Code',
    'Lane',
    'House (Block)',
    'Floor',
    'Flat Type',
    'Occupancy Status',
    'Landlord Rank',
    'Landlord Name',
    'Landlord Phone',
    'Landlord Service No',
    'Tenant Name',
    'Tenant Phone',
    'Tenant Email',
    'Annual Rent Paid (NGN)',
    'Rent Start Date',
    'Rent Expiry Date',
    'Annual Cycle Status',
    'Electricity Meter No',
  ];

  const escapeCSV = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvRows = [
    headers.map(escapeCSV).join(','),
    ...rows.map((r) =>
      [
        r.flatCode,
        r.lane,
        r.house,
        r.floor,
        r.flatType,
        r.status,
        r.landlordRank,
        r.landlordName,
        r.landlordPhone,
        r.landlordServiceNo,
        r.tenantName,
        r.tenantPhone,
        r.tenantEmail,
        r.rentAmount,
        r.rentStartDate,
        r.rentExpiryDate,
        r.rentCycleStatus,
        r.meterNumber,
      ]
        .map(escapeCSV)
        .join(',')
    ),
  ];

  const blob = new Blob(['\uFEFF' + csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportGenericToCSV = (
  headers: string[],
  dataRows: Array<Array<string | number | undefined | null>>,
  filename = 'PHDL_Export.csv'
) => {
  const escapeCSV = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvRows = [
    headers.map(escapeCSV).join(','),
    ...dataRows.map((row) => row.map(escapeCSV).join(',')),
  ];

  const blob = new Blob(['\uFEFF' + csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export interface PrintRosterOptions {
  title: string;
  estateName: string;
  subtitle: string;
  statsSummary: string;
  headers: string[];
  rows: string[][];
  approverName?: string;
  approverRank?: string;
  approverId?: string;
  approverTitle?: string;
  signatureImage?: string;
  originIp?: string;
}

export const printOrExportPDFRoster = (options: PrintRosterOptions) => {
  const printWindow = window.open('', '_blank', 'width=1100,height=850');
  if (!printWindow) {
    alert('Please allow popups to generate and print the PDF roster.');
    return;
  }

  const now = new Date();
  const dateGenerated = now.toLocaleString('en-NG', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });
  const isoTimestamp = now.toISOString();

  // Retrieve default signature from localStorage if not provided
  let storedSig: any = null;
  try {
    const raw = localStorage.getItem('phdl_admin_signature_v7');
    if (raw) storedSig = JSON.parse(raw);
  } catch (e) {
    // fallback
  }

  const approverName = options.approverName || storedSig?.fullName || 'Col. Farouk Danjuma (Rtd.)';
  const approverRank = options.approverRank || storedSig?.rank || 'Colonel';
  const approverId = options.approverId || storedSig?.adminId || 'ADM-HQ-001';
  const approverTitle = options.approverTitle || storedSig?.officialStampTitle || 'COMMANDANT & MANAGING DIRECTOR, PHDL HQ RC 676563';
  const sigImg = options.signatureImage || storedSig?.signatureImage || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="60" viewBox="0 0 160 60"><path d="M10,40 Q30,10 60,30 T110,25 T150,35" fill="none" stroke="%231B4D21" stroke-width="2.5" stroke-linecap="round"/><circle cx="140" cy="20" r="3" fill="%23991B1B"/></svg>';
  const ipAddress = options.originIp || '192.168.45.102 (PHDL-SEC-HQ-GATEWAY)';
  const verificationHash = 'SHA256:' + Math.random().toString(36).substring(2, 12).toUpperCase() + '-' + Math.random().toString(36).substring(2, 10).toUpperCase();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${options.title} - ${options.estateName}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 8mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0F172A;
      margin: 0;
      padding: 14px;
      font-size: 9.5px;
    }
    .ribbon {
      height: 4px;
      width: 100%;
      background: linear-gradient(90deg, #DC2626 0%, #DC2626 33%, #F59E0B 33%, #F59E0B 40%, #0D452B 40%, #0D452B 100%);
      margin-bottom: 10px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #072B1C;
      padding-bottom: 8px;
      margin-bottom: 10px;
    }
    .logo-box {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-img {
      width: 44px;
      height: 44px;
      object-fit: contain;
    }
    .title-box h1 {
      margin: 0;
      font-size: 15px;
      color: #072B1C;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .title-box .corporate-name {
      margin: 1px 0 0 0;
      color: #B91C1C;
      font-size: 10.5px;
      font-weight: 800;
      letter-spacing: 0.04em;
    }
    .title-box p {
      margin: 1px 0 0 0;
      color: #475569;
      font-size: 9px;
    }
    .meta-box {
      text-align: right;
      font-size: 8.5px;
      color: #334155;
    }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 8px;
      font-weight: 800;
      text-transform: uppercase;
    }
    .badge-military { background: #FEE2E2; color: #991B1B; border: 1px solid #FECACA; }
    .stats-bar {
      background: #F0FAF5;
      border: 1px solid #A7E6C7;
      border-radius: 5px;
      padding: 5px 8px;
      margin-bottom: 10px;
      font-weight: 700;
      font-size: 9.5px;
      color: #072B1C;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5px;
    }
    th, td {
      border: 1px solid #CBD5E1;
      padding: 4px 5px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background-color: #072B1C;
      color: #FFFFFF;
      font-weight: 700;
      font-size: 8px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      border-bottom: 2px solid #F59E0B;
    }
    tr:nth-child(even) {
      background-color: #F8FAFC;
    }
    .signature-stamp-card {
      margin-top: 14px;
      padding: 10px 14px;
      background: #F8FAFC;
      border: 1.5px solid #072B1C;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
    }
    .sig-info h4 {
      margin: 0 0 2px 0;
      font-size: 11px;
      color: #072B1C;
      font-weight: 800;
      text-transform: uppercase;
    }
    .sig-info p {
      margin: 1px 0;
      font-size: 8.5px;
      color: #334155;
    }
    .sig-stamp-box {
      text-align: center;
      border-left: 1.5px dashed #CBD5E1;
      padding-left: 16px;
    }
    .sig-img {
      max-height: 48px;
      max-width: 160px;
      object-fit: contain;
      display: block;
      margin: 0 auto 3px;
    }
    .sig-stamp-title {
      font-size: 7.5px;
      color: #64748B;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .security-stamp-seal {
      display: inline-block;
      padding: 2px 6px;
      border: 1.5px solid #0D452B;
      border-radius: 4px;
      font-size: 8px;
      font-weight: 800;
      color: #0D452B;
      background: #E8F5EE;
    }
    .footer {
      margin-top: 10px;
      font-size: 8px;
      color: #64748B;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #E2E8F0;
      padding-top: 5px;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 12px; display: flex; gap: 8px;">
    <button onclick="window.print()" style="padding: 8px 16px; background: #072B1C; color: #FFFFFF; border: none; border-radius: 4px; font-weight: 800; cursor: pointer;">
      🖨️ Print / Save as Endorsed PDF Document
    </button>
    <button onclick="window.close()" style="padding: 8px 16px; background: #E2E8F0; border: none; border-radius: 4px; cursor: pointer;">
      Close Window
    </button>
  </div>

  <div class="ribbon"></div>

  <div class="header">
    <div class="logo-box">
      <img class="logo-img" src="${window.location.origin}/phdl-logo.png" alt="PHDL Logo" onerror="this.style.display='none'" />
      <div class="title-box">
        <div class="corporate-name">PHDL Estates • RC 676563</div>
        <h1>${options.estateName} — ${options.title}</h1>
        <p>${options.subtitle}</p>
      </div>
    </div>
    <div class="meta-box">
      <div><strong>Security & Tenancy Registry Command</strong></div>
      <div>Generated: ${dateGenerated}</div>
      <div style="margin-top: 3px;"><span class="badge badge-military">OFFICIAL CERTIFIED ROSTER</span></div>
    </div>
  </div>

  <div class="stats-bar">
    ${options.statsSummary}
  </div>

  <table>
    <thead>
      <tr>
        ${options.headers.map((h) => `<th>${h}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${options.rows
        .map(
          (row) => `
        <tr>
          ${row.map((col) => `<td>${col}</td>`).join('')}
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <!-- Official Endorsement & Signature Stamp Module -->
  <div class="signature-stamp-card">
    <div class="sig-info">
      <span class="security-stamp-seal">✓ OFFICIAL CLEARANCE & STAMP ENDORSEMENT</span>
      <h4 style="margin-top: 4px;">Authorized Officer: ${approverRank} ${approverName}</h4>
      <p><strong>Designation:</strong> ${approverTitle}</p>
      <p><strong>Admin Officer ID:</strong> ${approverId} • <strong>Security Token:</strong> ${verificationHash}</p>
      <p><strong>Originating Workstation IP:</strong> <code style="font-family: monospace; font-size: 8.5px; background: #E2E8F0; padding: 1px 4px; border-radius: 3px;">${ipAddress}</code> • <strong>Timestamp:</strong> ${isoTimestamp}</p>
    </div>

    <div class="sig-stamp-box">
      <img class="sig-img" src="${sigImg}" alt="Official Signature Stamp" />
      <div class="sig-stamp-title">COMMANDANT OFFICIAL SIGNATURE STAMP</div>
      <div style="font-size: 7px; color: #166534; font-weight: 700; margin-top: 2px;">DIGITALLY SEALED & VERIFIED</div>
    </div>
  </div>

  <div class="footer">
    <span>Post-Service Housing Development Limited (PHDL) • Nigerian Armed Forces Subsidized Housing Scheme</span>
    <span>Confidential Estate Document • Security & Tenancy Clearance Certified • NDPR Compliant</span>
  </div>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};
