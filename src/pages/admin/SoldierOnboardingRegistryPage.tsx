import React, { useState, useRef } from 'react';
import { usePhdlStore } from '../../data/storage';
import { Soldier, MilitaryRank, MilitaryBranch, IDCard } from '../../types';
import {
    UserPlus,
    Shield,
    Search,
    Filter,
    Edit2,
    Trash2,
    Eye,
    CheckCircle2,
    Building,
    Award,
    FileSpreadsheet,
    Printer,
    X,
    Save,
    Upload,
    Download,
    FileCheck,
    FileText,
} from 'lucide-react';
import { exportGenericToCSV } from '../../utils/exportUtils';
import { IDCardBadge } from '../../components/idcards/IDCardBadge';

const PERMITTED_RANKS: MilitaryRank[] = [
    'Staff Sergeant',
    'Master Warrant Officer',
    'Warrant Officer',
    'Sergeant',
    'Corporal',
    'Lance Corporal',
    'Private',
];

const BRANCHES: MilitaryBranch[] = [
    'Nigerian Army',
    'Nigerian Navy',
    'Nigerian Air Force',
];

interface ParsedSoldierRow {
    serviceNumber: string;
    rank: MilitaryRank;
    fullName: string;
    militaryBranch: MilitaryBranch;
    unitBrigade: string;
    flatCode: string;
    phone: string;
    email: string;
    isValid: boolean;
    validationError?: string;
}

export const SoldierOnboardingRegistryPage: React.FC = () => {
    const store = usePhdlStore();
    const currentEstateId = store.getActiveEstateId();
    const currentEstate = store.getEstateById(currentEstateId);
    const soldiers = (store.getSoldiers() || []).filter((s) => s && s.id !== 'soldier-unidentified');
    const flats = store.getFlats(currentEstateId) || [];
    const lanes = store.getLanes(currentEstateId) || [];
    const idCards = store.getIDCards(currentEstateId) || [];

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBranch, setSelectedBranch] = useState<string>('all');
    const [selectedRank, setSelectedRank] = useState<string>('all');
    const [selectedLane, setSelectedLane] = useState<string>('all');

    // Modals State
    const [showOnboardModal, setShowOnboardModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showPdfPreviewModal, setShowPdfPreviewModal] = useState(false);
    const [previewSoldier, setPreviewSoldier] = useState<Soldier | null>(null);
    const [editingSoldier, setEditingSoldier] = useState<Soldier | null>(null);
    const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

    // Single Onboard Form State
    const [formFullName, setFormFullName] = useState('');
    const [formServiceNumber, setFormServiceNumber] = useState('');
    const [formBranch, setFormBranch] = useState<MilitaryBranch>('Nigerian Army');
    const [formRank, setFormRank] = useState<MilitaryRank>('Staff Sergeant');
    const [formPhone, setFormPhone] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formUnitBrigade, setFormUnitBrigade] = useState('Army Headquarters Garrison, Mogadishu Cantonment, Abuja');
    const [formAllocatedFlatId, setFormAllocatedFlatId] = useState('');

    // CSV Import State
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importedRows, setImportedRows] = useState<ParsedSoldierRow[]>([]);
    const [importFileName, setImportFileName] = useState<string>('');
    const [isImporting, setIsImporting] = useState(false);

    const availableFlats = flats.filter((f) => !f.ownerId || f.ownerId === 'soldier-unidentified');

    // Filter logic
    const filteredSoldiers = soldiers.filter((s) => {
        if (!s) return false;
        if (selectedBranch !== 'all' && s.militaryBranch !== selectedBranch) return false;
        if (selectedRank !== 'all' && s.rank !== selectedRank) return false;
        if (selectedLane !== 'all') {
            const soldierFlats = flats.filter((f) => (s.ownedFlatIds || []).includes(f.id));
            if (!soldierFlats.some((f) => f.laneId === selectedLane)) return false;
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            const soldierFlats = flats.filter((f) => (s.ownedFlatIds || []).includes(f.id));
            const flatCodes = soldierFlats.map((f) => f.fullFlatCode.toLowerCase()).join(' ');
            return (
                (s.fullName || '').toLowerCase().includes(q) ||
                (s.serviceNumber || '').toLowerCase().includes(q) ||
                (s.phone || '').toLowerCase().includes(q) ||
                (s.rank || '').toLowerCase().includes(q) ||
                flatCodes.includes(q)
            );
        }
        return true;
    });

    const handleOpenCreate = () => {
        setEditingSoldier(null);
        setFormFullName('');
        setFormServiceNumber(`NA/2014/${Math.floor(1000 + Math.random() * 9000)}`);
        setFormBranch('Nigerian Army');
        setFormRank('Staff Sergeant');
        setFormPhone('+234 803 000 0000');
        setFormEmail('');
        setFormUnitBrigade('Army Headquarters Garrison, Mogadishu Cantonment, Abuja');
        setFormAllocatedFlatId(availableFlats[0]?.id || '');
        setShowOnboardModal(true);
    };

    const handleOpenEdit = (soldier: Soldier) => {
        setEditingSoldier(soldier);
        setFormFullName(soldier.fullName || '');
        setFormServiceNumber(soldier.serviceNumber || '');
        setFormBranch(soldier.militaryBranch || 'Nigerian Army');
        setFormRank(soldier.rank || 'Staff Sergeant');
        setFormPhone(soldier.phone || '');
        setFormEmail(soldier.email || '');
        setFormUnitBrigade(soldier.unitBrigade || '');
        setFormAllocatedFlatId((soldier.ownedFlatIds || [])[0] || '');
        setShowOnboardModal(true);
    };

    const handleSaveSoldier = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingSoldier) {
            const updated: Soldier = {
                ...editingSoldier,
                fullName: formFullName.trim(),
                serviceNumber: formServiceNumber.trim(),
                militaryBranch: formBranch,
                rank: formRank,
                phone: formPhone.trim(),
                email: formEmail.trim() || `${formFullName.toLowerCase().replace(/\s+/g, '.')}.mil@army.mil.ng`,
                unitBrigade: formUnitBrigade.trim(),
            };

            if (formAllocatedFlatId && !(editingSoldier.ownedFlatIds || []).includes(formAllocatedFlatId)) {
                updated.ownedFlatIds = [formAllocatedFlatId];
                const flat = flats.find((f) => f.id === formAllocatedFlatId);
                if (flat) {
                    flat.ownerId = updated.id;
                    store.updateFlat(flat);
                }
            }

            store.updateSoldier(updated);
            setNoticeMessage(`Soldier record for ${updated.rank} ${updated.fullName} updated.`);
        } else {
            const newSoldierId = `soldier-${Date.now()}`;
            const newSoldier: Soldier = {
                id: newSoldierId,
                serviceNumber: formServiceNumber.trim(),
                militaryBranch: formBranch,
                rank: formRank,
                fullName: formFullName.trim(),
                phone: formPhone.trim(),
                email: formEmail.trim() || `${formFullName.toLowerCase().replace(/\s+/g, '.')}.mil@army.mil.ng`,
                unitBrigade: formUnitBrigade.trim(),
                ownedFlatIds: formAllocatedFlatId ? [formAllocatedFlatId] : [],
                verificationStatus: 'verified',
                idCardNumber: `PHDL-UNT-S-2026-${Math.floor(100 + Math.random() * 900)}`,
                createdAt: new Date().toISOString(),
            };

            const allSoldiers = store.getSoldiers() || [];
            const updatedList = [newSoldier, ...allSoldiers];
            localStorage.setItem('phdl_soldiers_v7', JSON.stringify(updatedList));

            if (formAllocatedFlatId) {
                const flat = flats.find((f) => f.id === formAllocatedFlatId);
                if (flat) {
                    flat.ownerId = newSoldierId;
                    flat.status = 'owner_occupied';
                    store.updateFlat(flat);
                }
            }

            const assignedFlat = flats.find((f) => f.id === formAllocatedFlatId);
            const assignedLane = lanes.find((l) => l.id === assignedFlat?.laneId);

            const card: IDCard = {
                id: `idc-${newSoldierId}`,
                estateId: currentEstateId,
                holderType: 'soldier',
                holderId: newSoldierId,
                holderName: newSoldier.fullName,
                holderRoleOrRank: `${newSoldier.rank} (${newSoldier.militaryBranch})`,
                flatCode: assignedFlat?.fullFlatCode || 'N/A',
                laneName: assignedLane?.name || 'Lane 1',
                cardNumber: newSoldier.idCardNumber || `PHDL-UNT-S-2026-001`,
                qrData: `PHDL:UNT:SOLDIER:${newSoldier.serviceNumber}:${newSoldier.fullName.replace(/\s+/g, '-')}:EXP-2030`,
                issueDate: '2026-01-01',
                expiryDate: '2030-12-31',
                status: 'active',
                emergencyContact: newSoldier.phone,
            };

            store.issueIDCard(card);
            setNoticeMessage(`Onboarded ${newSoldier.rank} ${newSoldier.fullName} into PHDL Roster.`);
        }

        setShowOnboardModal(false);
        setTimeout(() => setNoticeMessage(null), 4000);
    };

    const handleDeleteSoldier = (soldier: Soldier) => {
        if (
            window.confirm(
                `Are you sure you want to remove ${soldier.rank} ${soldier.fullName} from the active military roster? Allocated flats will be reverted to UnIdentified Soldier.`
            )
        ) {
            (soldier.ownedFlatIds || []).forEach((fId) => {
                const flat = flats.find((f) => f.id === fId);
                if (flat) {
                    flat.ownerId = 'soldier-unidentified';
                    flat.status = flat.currentTenantId ? 'sublet' : 'unoccupied';
                    store.updateFlat(flat);
                }
            });

            const allSoldiers = (store.getSoldiers() || []).filter((s) => s.id !== soldier.id);
            localStorage.setItem('phdl_soldiers_v7', JSON.stringify(allSoldiers));
            setNoticeMessage(`Removed ${soldier.rank} ${soldier.fullName} from military roster.`);
            setTimeout(() => setNoticeMessage(null), 4000);
        }
    };

    // -------------------------------------------------------------
    // CSV BATCH IMPORT HANDLERS
    // -------------------------------------------------------------
    const handleDownloadTemplate = () => {
        const headers = [
            'Service Number',
            'Rank',
            'Full Name',
            'Military Branch',
            'Unit / Formation',
            'Flat Code',
            'Phone Number',
            'Official Email',
        ];

        const sampleData = [
            [
                'NA/2014/1042',
                'Staff Sergeant',
                'Adamu Mohammed',
                'Nigerian Army',
                'HQ Garrison Mogadishu, Abuja',
                'L1H1A',
                '+234 803 111 2222',
                'a.mohammed@army.mil.ng',
            ],
            [
                'NN/2016/5581',
                'Warrant Officer',
                'Chukwuma Obi',
                'Nigerian Navy',
                'Naval Unit Abuja',
                'L1H1B',
                '+234 802 333 4444',
                'c.obi@navy.mil.ng',
            ],
            [
                'NAF/2018/8890',
                'Sergeant',
                'Babajide Olawale',
                'Nigerian Air Force',
                'NAF Base Abuja',
                'L2H3C',
                '+234 805 777 8888',
                'b.olawale@airforce.mil.ng',
            ],
        ];

        exportGenericToCSV(headers, sampleData, 'PHDL_Soldier_Import_Template.csv');
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImportFileName(file.name);
        const reader = new FileReader();

        reader.onload = (event) => {
            const text = event.target?.result as string;
            if (!text) return;

            const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
            if (lines.length <= 1) {
                alert('The uploaded CSV file is empty or missing data rows.');
                return;
            }

            const dataRows = lines.slice(1);
            const parsed: ParsedSoldierRow[] = [];

            dataRows.forEach((line) => {
                const cols = line.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
                if (cols.length < 3) return;

                const svcNo = cols[0] || '';
                let rankInput = cols[1] || 'Staff Sergeant';
                const fullName = cols[2] || '';
                let branchInput = cols[3] || 'Nigerian Army';
                const unitBrigade = cols[4] || 'Army Headquarters Garrison, Mogadishu Cantonment, Abuja';
                const flatCode = cols[5] ? cols[5].toUpperCase() : '';
                const phone = cols[6] || '+234 800 000 0000';
                const email = cols[7] || `${fullName.toLowerCase().replace(/\s+/g, '.')}.mil@army.mil.ng`;

                let matchedRank: MilitaryRank = 'Staff Sergeant';
                const foundRank = PERMITTED_RANKS.find((r) => r.toLowerCase() === rankInput.toLowerCase());
                if (foundRank) matchedRank = foundRank;

                let matchedBranch: MilitaryBranch = 'Nigerian Army';
                const foundBranch = BRANCHES.find((b) => b.toLowerCase() === branchInput.toLowerCase());
                if (foundBranch) matchedBranch = foundBranch;

                let isValid = true;
                let validationError = '';

                if (!svcNo) {
                    isValid = false;
                    validationError = 'Missing Service Number';
                } else if (!fullName) {
                    isValid = false;
                    validationError = 'Missing Full Name';
                }

                parsed.push({
                    serviceNumber: svcNo,
                    rank: matchedRank,
                    fullName,
                    militaryBranch: matchedBranch,
                    unitBrigade,
                    flatCode,
                    phone,
                    email,
                    isValid,
                    validationError,
                });
            });

            setImportedRows(parsed);
            setShowImportModal(true);
        };

        reader.readAsText(file);
    };

    const handleExecuteBatchImport = () => {
        const validRows = importedRows.filter((r) => r.isValid);
        if (validRows.length === 0) {
            alert('No valid soldier rows to import.');
            return;
        }

        setIsImporting(true);
        const existingSoldiers = store.getSoldiers() || [];
        const newSoldiers: Soldier[] = [];

        validRows.forEach((row, index) => {
            const newId = `soldier-imp-${Date.now()}-${index}`;

            let matchedFlatId = '';
            if (row.flatCode) {
                const flat = flats.find((f) => f.fullFlatCode.toUpperCase() === row.flatCode.toUpperCase());
                if (flat) {
                    matchedFlatId = flat.id;
                    flat.ownerId = newId;
                    flat.status = flat.currentTenantId ? 'sublet' : 'owner_occupied';
                    store.updateFlat(flat);
                }
            }

            const soldierObj: Soldier = {
                id: newId,
                serviceNumber: row.serviceNumber,
                militaryBranch: row.militaryBranch,
                rank: row.rank,
                fullName: row.fullName,
                phone: row.phone,
                email: row.email,
                unitBrigade: row.unitBrigade,
                ownedFlatIds: matchedFlatId ? [matchedFlatId] : [],
                verificationStatus: 'verified',
                idCardNumber: `PHDL-UNT-S-2026-${Math.floor(100 + Math.random() * 900)}`,
                createdAt: new Date().toISOString(),
            };

            newSoldiers.push(soldierObj);

            const assignedFlat = flats.find((f) => f.id === matchedFlatId);
            const assignedLane = lanes.find((l) => l.id === assignedFlat?.laneId);

            const card: IDCard = {
                id: `idc-${newId}`,
                estateId: currentEstateId,
                holderType: 'soldier',
                holderId: newId,
                holderName: soldierObj.fullName,
                holderRoleOrRank: `${soldierObj.rank} (${soldierObj.militaryBranch})`,
                flatCode: assignedFlat?.fullFlatCode || row.flatCode || 'N/A',
                laneName: assignedLane?.name || 'Lane 1',
                cardNumber: soldierObj.idCardNumber || `PHDL-UNT-S-2026-001`,
                qrData: `PHDL:UNT:SOLDIER:${soldierObj.serviceNumber}:${soldierObj.fullName.replace(/\s+/g, '-')}:EXP-2030`,
                issueDate: '2026-01-01',
                expiryDate: '2030-12-31',
                status: 'active',
                emergencyContact: soldierObj.phone,
            };

            store.issueIDCard(card);
        });

        const combined = [...newSoldiers, ...existingSoldiers];
        localStorage.setItem('phdl_soldiers_v7', JSON.stringify(combined));

        setIsImporting(false);
        setShowImportModal(false);
        setImportedRows([]);
        setNoticeMessage(`Successfully onboarded and allocated ${newSoldiers.length} soldiers from CSV.`);
        setTimeout(() => setNoticeMessage(null), 5000);
    };

    // -------------------------------------------------------------
    // CSV EXPORT HANDLER
    // -------------------------------------------------------------
    const handleExportCSV = () => {
        const headers = [
            'Service Number',
            'Rank',
            'Full Name',
            'Military Branch',
            'Unit / Formation',
            'Allocated Flats',
            'Phone Number',
            'Official Email',
            'Verification Status',
            'ID Card Number',
        ];

        const dataRows = filteredSoldiers.map((s) => {
            const soldierFlats = flats.filter((f) => (s.ownedFlatIds || []).includes(f.id));
            const flatList = soldierFlats.map((f) => f.fullFlatCode).join(', ') || 'Unallocated';
            return [
                s.serviceNumber || '',
                s.rank || '',
                s.fullName || '',
                s.militaryBranch || '',
                s.unitBrigade || '',
                flatList,
                s.phone || '',
                s.email || '',
                (s.verificationStatus || 'VERIFIED').toUpperCase(),
                s.idCardNumber || 'N/A',
            ];
        });

        exportGenericToCSV(headers, dataRows, `PHDL_Soldier_Roster_${Date.now()}.csv`);
        setNoticeMessage(`Exported ${dataRows.length} soldier records to CSV.`);
        setTimeout(() => setNoticeMessage(null), 3000);
    };

    // -------------------------------------------------------------
    // ISOLATED ROSTER PDF PRINT
    // -------------------------------------------------------------
    const handlePrintIsolatedRoster = () => {
        const printContent = document.getElementById('isolated-roster-document');
        if (!printContent) return;

        const printWindow = window.open('', '_blank', 'width=1000,height=800');
        if (!printWindow) {
            alert('Please allow popups to print/export the official document.');
            return;
        }

        printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>PHDL Authenticated Allocatee Roster - RC 676563</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 12mm 15mm;
            }
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              color: #111827;
              margin: 0;
              padding: 0;
              font-size: 11px;
            }
            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 2px solid #1b4d21;
              padding-bottom: 10px;
              margin-bottom: 12px;
            }
            .title {
              font-size: 16px;
              font-weight: 900;
              color: #1b4d21;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .subtitle {
              font-size: 10px;
              font-weight: 700;
              color: #991b1b;
            }
            .meta-bar {
              background: #f3f4f6;
              padding: 6px 10px;
              margin-bottom: 12px;
              border-radius: 4px;
              display: flex;
              justify-content: space-between;
              font-size: 10px;
              border-left: 3px solid #1b4d21;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
            }
            th {
              background-color: #1b4d21;
              color: #ffffff;
              text-align: left;
              padding: 6px 8px;
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
            }
            td {
              padding: 5px 8px;
              border-bottom: 1px solid #e5e7eb;
              font-size: 10px;
            }
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .flat-badge {
              display: inline-block;
              background: #dcfce7;
              color: #166534;
              padding: 2px 6px;
              border-radius: 3px;
              font-weight: 800;
              font-size: 9px;
            }
            .footer {
              margin-top: 30px;
              display: flex;
              justify-content: space-between;
              page-break-inside: avoid;
            }
            .sig-box {
              width: 45%;
            }
            .sig-line {
              border-bottom: 1px solid #000;
              height: 35px;
              margin-bottom: 4px;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 400);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Hidden File Input for CSV Batch Upload */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv,text/csv"
                style={{ display: 'none' }}
            />

            {/* Main Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div className="section-overline">
                        <span>OFFICIAL ARMED FORCES REGISTRY</span> • <span>RC 676563</span>
                    </div>
                    <h1>Soldier Onboarding & Apartment Allocation Oversight</h1>
                    <p>
                        Dedicated module for onboarding, updating, verifying, and allocating housing units to Nigerian Armed Forces personnel (Private to Master Warrant Officer).
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-outline"
                        style={{ gap: '0.4rem', borderColor: 'var(--army-green-800)', color: 'var(--army-green-950)' }}
                        title="Import multiple soldiers from CSV file"
                    >
                        <Upload size={16} />
                        Import Batch (CSV)
                    </button>

                    <button
                        onClick={() => setShowPdfPreviewModal(true)}
                        className="btn btn-outline"
                        style={{ gap: '0.4rem', borderColor: 'var(--army-red-700)', color: 'var(--army-red-800)' }}
                        title="Open isolated PDF export preview for Authenticated Allocatee Roster"
                    >
                        <FileText size={16} />
                        Export Filtered PDF
                    </button>

                    <button
                        onClick={handleExportCSV}
                        className="btn btn-outline"
                        style={{ gap: '0.4rem' }}
                        title="Export filtered records to CSV spreadsheet"
                    >
                        <FileSpreadsheet size={16} />
                        Export CSV ({filteredSoldiers.length})
                    </button>

                    <button
                        onClick={handleOpenCreate}
                        className="btn btn-primary"
                        style={{ gap: '0.4rem', backgroundColor: 'var(--army-green-800)' }}
                    >
                        <UserPlus size={16} />
                        Onboard New Soldier
                    </button>
                </div>
            </div>

            {noticeMessage && (
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
                    {noticeMessage}
                </div>
            )}

            {/* KPI Stats Bar */}
            <div className="stat-grid">
                <div className="stat-card">
                    <div>
                        <div className="stat-label">Total Onboarded Soldiers</div>
                        <div className="stat-value">{soldiers.length}</div>
                        <div className="stat-subtext">Armed Forces Allocatees</div>
                    </div>
                    <div className="stat-icon-wrapper">
                        <Shield size={22} />
                    </div>
                </div>

                <div className="stat-card">
                    <div>
                        <div className="stat-label">Allocated Housing Units</div>
                        <div className="stat-value" style={{ color: 'var(--army-green-800)' }}>
                            {flats.filter((f) => f.ownerId && f.ownerId !== 'soldier-unidentified').length}
                        </div>
                        <div className="stat-subtext">Across 8 Estate Lanes</div>
                    </div>
                    <div className="stat-icon-wrapper">
                        <Building size={22} />
                    </div>
                </div>

                <div className="stat-card">
                    <div>
                        <div className="stat-label">Unallocated / Pending Flats</div>
                        <div className="stat-value" style={{ color: 'var(--army-gold-700)' }}>
                            {availableFlats.length}
                        </div>
                        <div className="stat-subtext">Available for Allocation</div>
                    </div>
                    <div className="stat-icon-wrapper">
                        <Award size={22} />
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Filter size={16} color="var(--army-green-800)" />
                        <strong style={{ fontSize: '0.85rem', color: 'var(--army-green-950)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Filter Soldier Records ({filteredSoldiers.length} Matching)
                        </strong>
                    </div>
                    {(selectedBranch !== 'all' || selectedRank !== 'all' || selectedLane !== 'all' || searchQuery) && (
                        <button
                            onClick={() => {
                                setSelectedBranch('all');
                                setSelectedRank('all');
                                setSelectedLane('all');
                                setSearchQuery('');
                            }}
                            className="btn btn-ghost btn-sm"
                            style={{ fontSize: '0.75rem', color: 'var(--army-red-700)' }}
                        >
                            Reset Filters
                        </button>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Search Keyword</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Name, SVC No, Flat code..."
                                className="form-control"
                                style={{ paddingLeft: '2rem' }}
                            />
                            <Search size={15} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                        </div>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Armed Forces Branch</label>
                        <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} className="form-select">
                            <option value="all">All Branches</option>
                            {BRANCHES.map((b) => (
                                <option key={b} value={b}>{b}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Military Rank</label>
                        <select value={selectedRank} onChange={(e) => setSelectedRank(e.target.value)} className="form-select">
                            <option value="all">All Ranks</option>
                            {PERMITTED_RANKS.map((r) => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Estate Lane</label>
                        <select value={selectedLane} onChange={(e) => setSelectedLane(e.target.value)} className="form-select">
                            <option value="all">All 8 Lanes</option>
                            {lanes.map((l) => (
                                <option key={l.id} value={l.id}>{l.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Soldiers Data Table */}
            <div className="card">
                <div className="card-header">
                    <div className="card-title">
                        <Shield size={18} />
                        Authenticated Armed Forces Allocatee Roster ({filteredSoldiers.length} Records)
                    </div>
                </div>

                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Service Number</th>
                                <th>Rank & Full Name</th>
                                <th>Branch & Formation</th>
                                <th>Allocated Flat(s)</th>
                                <th>Contact Details</th>
                                <th>Verification</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSoldiers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-subtle)' }}>
                                        No soldier records matching the selected filter criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredSoldiers.map((soldier) => {
                                    const soldierFlats = flats.filter((f) => (soldier.ownedFlatIds || []).includes(f.id));

                                    return (
                                        <tr key={soldier.id}>
                                            <td style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--army-green-950)' }}>
                                                {soldier.serviceNumber}
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 800, color: 'var(--army-green-950)' }}>
                                                    {soldier.rank} {soldier.fullName}
                                                </div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--army-gold-700)', fontWeight: 700 }}>
                                                    ID: {soldier.idCardNumber || 'Active'}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 600, fontSize: '0.825rem' }}>{soldier.militaryBranch}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {soldier.unitBrigade}
                                                </div>
                                            </td>
                                            <td>
                                                {soldierFlats.length > 0 ? (
                                                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                                                        {soldierFlats.map((f) => (
                                                            <span key={f.id} className="badge badge-military" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                                                                Flat {f.fullFlatCode}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--army-red-700)', fontStyle: 'italic' }}>
                                                        Unallocated
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{soldier.phone}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{soldier.email}</div>
                                            </td>
                                            <td>
                                                <span className="badge badge-success">
                                                    ✓ Verified Allocatee
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.35rem' }}>
                                                    <button
                                                        onClick={() => setPreviewSoldier(soldier)}
                                                        className="btn btn-ghost btn-sm"
                                                        title="Preview Digital Smart ID Card"
                                                        style={{ padding: '0.35rem', color: 'var(--army-green-800)' }}
                                                    >
                                                        <Eye size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenEdit(soldier)}
                                                        className="btn btn-ghost btn-sm"
                                                        title="Edit Soldier & Allocations"
                                                        style={{ padding: '0.35rem', color: '#0369A1' }}
                                                    >
                                                        <Edit2 size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSoldier(soldier)}
                                                        className="btn btn-ghost btn-sm"
                                                        title="Delete Soldier Record"
                                                        style={{ padding: '0.35rem', color: 'var(--army-red-700)' }}
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* MODAL 1: SPECIFIC ISOLATED ROSTER PDF EXPORT PREVIEW MODAL */}
            {/* ------------------------------------------------------------- */}
            {showPdfPreviewModal && (
                <div className="modal-backdrop" onClick={() => setShowPdfPreviewModal(false)}>
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 920, width: '95vw' }}>
                        <div className="modal-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FileText size={18} />
                                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>
                                    Export Document Preview: Authenticated Allocatee Roster
                                </h3>
                            </div>
                            <button type="button" onClick={() => setShowPdfPreviewModal(false)} className="btn btn-ghost btn-sm" style={{ color: '#FFFFFF' }}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto', backgroundColor: '#525659', padding: '1.5rem 1rem' }}>
                            {/* Paper Sheet Preview */}
                            <div
                                id="isolated-roster-document"
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    color: '#111827',
                                    maxWidth: '800px',
                                    margin: '0 auto',
                                    padding: '2rem 2.5rem',
                                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                                    borderRadius: '2px',
                                    fontFamily: 'Segoe UI, Arial, sans-serif',
                                }}
                            >
                                {/* Official Letterhead Header */}
                                <div className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #1B4D21', paddingBottom: '12px', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <img src="/logo.png" alt="PHDL Official Seal" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'contain' }} />
                                        <div>
                                            <div className="title" style={{ fontSize: '15px', fontWeight: 900, color: '#1B4D21', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                PHDL Estates
                                            </div>
                                            <div className="subtitle" style={{ fontSize: '10px', fontWeight: 800, color: '#991B1B', letterSpacing: '0.04em' }}>
                                                NIGERIAN ARMED FORCES HOUSING SCHEME • RC 676563
                                            </div>
                                            <div style={{ fontSize: '10px', color: '#4B5563', marginTop: '2px' }}>
                                                Unity Estate, Abuja FCT • Official Allocatee & Soldier Roster
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', fontSize: '9px', color: '#374151' }}>
                                        <div><strong>DATE:</strong> {new Date().toLocaleDateString('en-GB')}</div>
                                        <div><strong>REF:</strong> PHDL/UNT/ALLOC/{new Date().getFullYear()}</div>
                                        <div style={{ color: '#991B1B', fontWeight: 800, marginTop: '2px' }}>RESTRICTED OFFICIAL</div>
                                    </div>
                                </div>

                                {/* Filter Meta Context Bar */}
                                <div className="meta-bar" style={{ backgroundColor: '#F3F4F6', padding: '6px 10px', marginBottom: '14px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', borderLeft: '3px solid #1B4D21' }}>
                                    <div>
                                        <strong>FILTERS APPLIED:</strong> Branch ({selectedBranch.toUpperCase()}) | Rank ({selectedRank.toUpperCase()}) | Lane ({selectedLane === 'all' ? 'ALL 8 LANES' : lanes.find((l) => l.id === selectedLane)?.name.toUpperCase()})
                                    </div>
                                    <div>
                                        <strong>TOTAL ALLOCATEES:</strong> {filteredSoldiers.length} Officers/Soldiers
                                    </div>
                                </div>

                                {/* The Isolated Table */}
                                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '10px' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#1B4D21', color: '#FFFFFF' }}>
                                            <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 800, width: '4%' }}>S/N</th>
                                            <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 800, width: '16%' }}>SVC NO</th>
                                            <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 800, width: '25%' }}>RANK & FULL NAME</th>
                                            <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 800, width: '18%' }}>BRANCH / FORMATION</th>
                                            <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 800, width: '15%' }}>ALLOCATED UNIT</th>
                                            <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 800, width: '22%' }}>CONTACT PHONE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredSoldiers.map((soldier, i) => {
                                            const soldierFlats = flats.filter((f) => (soldier.ownedFlatIds || []).includes(f.id));
                                            const flatCodes = soldierFlats.map((f) => f.fullFlatCode).join(', ') || 'Unallocated';

                                            return (
                                                <tr key={soldier.id} style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F9FAFB' }}>
                                                    <td style={{ padding: '5px 8px', fontWeight: 700 }}>{i + 1}</td>
                                                    <td style={{ padding: '5px 8px', fontFamily: 'monospace', fontWeight: 800, color: '#1B4D21' }}>{soldier.serviceNumber}</td>
                                                    <td style={{ padding: '5px 8px' }}>
                                                        <strong>{soldier.rank}</strong> {soldier.fullName}
                                                    </td>
                                                    <td style={{ padding: '5px 8px', color: '#374151' }}>
                                                        <div>{soldier.militaryBranch}</div>
                                                        <div style={{ fontSize: '8.5px', color: '#6B7280' }}>{soldier.unitBrigade}</div>
                                                    </td>
                                                    <td style={{ padding: '5px 8px' }}>
                                                        <span className="flat-badge" style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '2px 6px', borderRadius: '3px', fontWeight: 800, fontSize: '9px' }}>
                                                            Flat {flatCodes}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '5px 8px', color: '#374151' }}>
                                                        <div>{soldier.phone}</div>
                                                        <div style={{ fontSize: '8.5px', color: '#6B7280' }}>{soldier.email}</div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                {/* Formal Sign-off Section */}
                                <div className="footer" style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between' }}>
                                    <div className="sig-box" style={{ width: '42%' }}>
                                        <div style={{ fontSize: '10px', fontWeight: 800 }}>COMPILED & VERIFIED BY:</div>
                                        <div className="sig-line" style={{ borderBottom: '1px solid #000', height: '35px', marginBottom: '4px' }}></div>
                                        <div style={{ fontSize: '9.5px', fontWeight: 700 }}>Estate Records & Allocation Officer</div>
                                        <div style={{ fontSize: '8.5px', color: '#6B7280' }}>PHDL Directorate of Estate Management, Abuja</div>
                                    </div>
                                    <div className="sig-box" style={{ width: '42%' }}>
                                        <div style={{ fontSize: '10px', fontWeight: 800 }}>AUTHENTICATED BY:</div>
                                        <div className="sig-line" style={{ borderBottom: '1px solid #000', height: '35px', marginBottom: '4px' }}></div>
                                        <div style={{ fontSize: '9.5px', fontWeight: 700 }}>Managing Director / CEO</div>
                                        <div style={{ fontSize: '8.5px', color: '#6B7280' }}>Post-Service Housing Development Limited (RC 676563)</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                                Document ready for print / PDF export (Clean A4 layout without UI elements).
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button type="button" onClick={() => setShowPdfPreviewModal(false)} className="btn btn-outline">
                                    Close Preview
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePrintIsolatedRoster}
                                    className="btn btn-primary"
                                    style={{ gap: '0.4rem', backgroundColor: 'var(--army-red-800)', borderColor: 'var(--army-red-800)' }}
                                >
                                    <Printer size={16} />
                                    Print / Save as PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* MODAL 2: BATCH CSV IMPORT PREVIEW MODAL */}
            {/* ------------------------------------------------------------- */}
            {showImportModal && (
                <div className="modal-backdrop" onClick={() => setShowImportModal(false)}>
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 850 }}>
                        <div className="modal-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Upload size={18} />
                                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>
                                    Batch CSV Import: {importFileName}
                                </h3>
                            </div>
                            <button type="button" onClick={() => setShowImportModal(false)} className="btn btn-ghost btn-sm" style={{ color: '#FFFFFF' }}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                                <div>
                                    <strong>Total Rows Detected:</strong> {importedRows.length} |{' '}
                                    <span style={{ color: 'var(--status-success-text)' }}>
                                        <strong>Valid:</strong> {importedRows.filter((r) => r.isValid).length}
                                    </span>{' '}
                                    |{' '}
                                    <span style={{ color: 'var(--army-red-700)' }}>
                                        <strong>Errors:</strong> {importedRows.filter((r) => !r.isValid).length}
                                    </span>
                                </div>
                                <button onClick={handleDownloadTemplate} className="btn btn-ghost btn-sm" style={{ gap: '0.3rem', fontSize: '0.75rem', color: 'var(--army-green-800)' }}>
                                    <Download size={14} />
                                    Download Sample CSV Template
                                </button>
                            </div>

                            <div style={{ maxHeight: 340, overflowY: 'auto', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
                                <table className="data-table" style={{ fontSize: '0.8rem' }}>
                                    <thead>
                                        <tr>
                                            <th>Status</th>
                                            <th>Service No</th>
                                            <th>Rank & Name</th>
                                            <th>Branch</th>
                                            <th>Unit / Brigade</th>
                                            <th>Flat Allocation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {importedRows.map((row, idx) => (
                                            <tr key={idx} style={{ backgroundColor: row.isValid ? 'transparent' : '#FEF2F2' }}>
                                                <td>
                                                    {row.isValid ? (
                                                        <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Valid</span>
                                                    ) : (
                                                        <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>{row.validationError}</span>
                                                    )}
                                                </td>
                                                <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{row.serviceNumber}</td>
                                                <td><strong>{row.rank}</strong> {row.fullName}</td>
                                                <td>{row.militaryBranch}</td>
                                                <td style={{ maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.unitBrigade}</td>
                                                <td>
                                                    {row.flatCode ? (
                                                        <span className="badge badge-military" style={{ fontSize: '0.7rem' }}>Flat {row.flatCode}</span>
                                                    ) : (
                                                        <span style={{ color: 'var(--text-subtle)', fontStyle: 'italic' }}>None</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" onClick={() => setShowImportModal(false)} className="btn btn-outline">
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleExecuteBatchImport}
                                disabled={isImporting || importedRows.filter((r) => r.isValid).length === 0}
                                className="btn btn-primary"
                                style={{ gap: '0.4rem', backgroundColor: 'var(--army-green-800)' }}
                            >
                                <FileCheck size={16} />
                                {isImporting ? 'Importing Soldiers...' : `Complete Batch Import (${importedRows.filter((r) => r.isValid).length} Soldiers)`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* MODAL 3: SINGLE ONBOARD / EDIT MODAL */}
            {/* ------------------------------------------------------------- */}
            {showOnboardModal && (
                <div className="modal-backdrop" onClick={() => setShowOnboardModal(false)}>
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 620 }}>
                        <form onSubmit={handleSaveSoldier}>
                            <div className="modal-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Shield size={18} />
                                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>
                                        {editingSoldier ? `Modify Soldier Profile: ${editingSoldier.fullName}` : 'Onboard Soldier Allocatee'}
                                    </h3>
                                </div>
                                <button type="button" onClick={() => setShowOnboardModal(false)} className="btn btn-ghost btn-sm" style={{ color: '#FFFFFF' }}>
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label">Service Number</label>
                                        <input
                                            type="text"
                                            value={formServiceNumber}
                                            onChange={(e) => setFormServiceNumber(e.target.value)}
                                            placeholder="e.g. NA/2014/4819"
                                            className="form-control"
                                            style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}
                                            required
                                        />
                                    </div>

                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label">Military Rank</label>
                                        <select
                                            value={formRank}
                                            onChange={(e) => setFormRank(e.target.value as MilitaryRank)}
                                            className="form-select"
                                            required
                                        >
                                            {PERMITTED_RANKS.map((r) => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            value={formFullName}
                                            onChange={(e) => setFormFullName(e.target.value)}
                                            placeholder="e.g. John Danjuma"
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label">Armed Forces Branch</label>
                                        <select
                                            value={formBranch}
                                            onChange={(e) => setFormBranch(e.target.value as MilitaryBranch)}
                                            className="form-select"
                                            required
                                        >
                                            {BRANCHES.map((b) => (
                                                <option key={b} value={b}>{b}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label">Mobile Phone Number</label>
                                        <input
                                            type="text"
                                            value={formPhone}
                                            onChange={(e) => setFormPhone(e.target.value)}
                                            placeholder="+234 803 000 0000"
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label">Official / Military Email</label>
                                        <input
                                            type="email"
                                            value={formEmail}
                                            onChange={(e) => setFormEmail(e.target.value)}
                                            placeholder="name@army.mil.ng"
                                            className="form-control"
                                        />
                                    </div>
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label">Unit / Brigade / Formation</label>
                                    <input
                                        type="text"
                                        value={formUnitBrigade}
                                        onChange={(e) => setFormUnitBrigade(e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label">Assign Apartment / Housing Unit</label>
                                    <select
                                        value={formAllocatedFlatId}
                                        onChange={(e) => setFormAllocatedFlatId(e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="">-- No Apartment Assigned Yet --</option>
                                        {flats.map((f) => {
                                            const lane = lanes.find((l) => l.id === f.laneId);
                                            return (
                                                <option key={f.id} value={f.id}>
                                                    Flat {f.fullFlatCode} ({lane?.name}) — Status: {f.status.toUpperCase()}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={() => setShowOnboardModal(false)} className="btn btn-outline">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" style={{ gap: '0.4rem', backgroundColor: 'var(--army-green-800)' }}>
                                    <Save size={16} />
                                    {editingSoldier ? 'Save Changes' : 'Complete Onboarding & Issue ID'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* MODAL 4: ID BADGE PREVIEW MODAL */}
            {/* ------------------------------------------------------------- */}
            {previewSoldier && (
                <div className="modal-backdrop" onClick={() => setPreviewSoldier(null)}>
                    <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
                        <div className="modal-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Shield size={18} />
                                <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Digital Gate Pass ID Card</h3>
                            </div>
                            <button onClick={() => setPreviewSoldier(null)} className="btn btn-ghost btn-sm" style={{ color: '#FFFFFF' }}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="modal-body" style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem 1rem' }}>
                            {(() => {
                                const assignedFlat = flats.find((f) => (previewSoldier.ownedFlatIds || []).includes(f.id));
                                const assignedLane = lanes.find((l) => l.id === assignedFlat?.laneId);

                                const card: IDCard = idCards.find((c) => c.holderId === previewSoldier.id) || {
                                    id: `idc-${previewSoldier.id}`,
                                    estateId: currentEstateId,
                                    holderType: 'soldier',
                                    holderId: previewSoldier.id,
                                    holderName: previewSoldier.fullName,
                                    holderRoleOrRank: `${previewSoldier.rank} (${previewSoldier.militaryBranch})`,
                                    flatCode: assignedFlat?.fullFlatCode || 'L1H1A',
                                    laneName: assignedLane?.name || 'Lane 1',
                                    cardNumber: previewSoldier.idCardNumber || 'PHDL-UNT-S-2026-001',
                                    qrData: `PHDL:UNT:SOLDIER:${previewSoldier.serviceNumber}:${previewSoldier.fullName.replace(/\s+/g, '-')}`,
                                    issueDate: '2026-01-01',
                                    expiryDate: '2030-12-31',
                                    status: 'active',
                                    emergencyContact: previewSoldier.phone,
                                };
                                return <IDCardBadge card={card} />;
                            })()}
                        </div>

                        <div className="modal-footer">
                            <button onClick={() => setPreviewSoldier(null)} className="btn btn-primary">
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};