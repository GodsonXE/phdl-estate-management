import React, { useState } from 'react';
import { usePhdlStore } from '../../data/storage';
import { Flat, UnitLabel } from '../../types';
import { FileSpreadsheet, Check, AlertCircle, X, Download } from 'lucide-react';

interface BulkImportModalProps {
  onClose: () => void;
  onImportComplete: (count: number) => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({ onClose, onImportComplete }) => {
  const store = usePhdlStore();
  const currentEstateId = store.getActiveEstateId();
  const currentEstate = store.getEstateById(currentEstateId);
  const lanes = store.getLanes(currentEstateId);

  const [rawText, setRawText] = useState('');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [isSampleLoaded, setIsSampleLoaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sampleCSV = `LaneNumber,HouseNumber,UnitLabel,FlatType,MeterNumber,Status,OwnerServiceNumber,OwnerRank,OwnerFullName
1,10,A,3_bedroom_flat,ED-UNT-110A,owner_occupied,NA/2008/1120,Major,Maj. S. K. Usman
1,10,B,3_bedroom_flat,ED-UNT-110B,sublet,NN/19201,Lieutenant Commander,Lt. Cdr. B. J. Adeleke
1,10,C,2_bedroom_flat,ED-UNT-110C,vacant,NAF/14/6620,Squadron Leader,Sqn Ldr A. C. Obi
1,10,D,2_bedroom_flat,ED-UNT-110D,owner_occupied,NA/2012/9901,Captain,Capt. T. E. Bamidele
2,19,A,3_bedroom_flat,ED-UNT-219A,owner_occupied,NA/2005/3310,Colonel,Col. M. M. Sadiq`;

  const handleLoadSample = () => {
    setRawText(sampleCSV);
    parseCSV(sampleCSV);
    setIsSampleLoaded(true);
  };

  const parseCSV = (csvContent: string) => {
    setErrorMsg(null);
    try {
      const lines = csvContent.trim().split('\n');
      if (lines.length < 2) {
        setErrorMsg('CSV must contain a header and at least one row of flat data.');
        setParsedRows([]);
        return;
      }

      const headers = lines[0].split(',').map((h) => h.trim());
      const rows: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map((v) => v.trim());
        if (values.length >= headers.length) {
          const rowObj: any = {};
          headers.forEach((h, idx) => {
            rowObj[h] = values[idx];
          });
          rows.push(rowObj);
        }
      }

      setParsedRows(rows);
    } catch (err: any) {
      setErrorMsg('Failed to parse CSV: ' + err.message);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setRawText(val);
    if (val.trim()) {
      parseCSV(val);
    } else {
      setParsedRows([]);
    }
  };

  const handleCommitImport = () => {
    if (parsedRows.length === 0) return;

    const newFlats: Flat[] = parsedRows.map((r, idx) => {
      const laneNum = parseInt(r.LaneNumber || '1', 10);
      const lane = lanes.find((l) => l.laneNumber === laneNum) || lanes[0];
      const hNum = parseInt(r.HouseNumber || r.BuildingNumber || '1', 10);
      const unit = (r.UnitLabel || 'A').toUpperCase() as UnitLabel;
      const flatId = `flat-imp-${Date.now()}-${idx}`;

      return {
        id: flatId,
        buildingId: `bld-l${laneNum}-h${hNum}`,
        laneId: lane ? lane.id : 'lane-1',
        estateId: currentEstateId,
        houseNumber: hNum,
        flatLetter: (unit === 'A' || unit === 'B' || unit === 'C' || unit === 'D' ? unit : 'A') as 'A' | 'B' | 'C' | 'D',
        unitLabel: unit,
        fullFlatCode: `L${laneNum}H${hNum}${unit}`,
        floor: unit === 'A' ? 'Ground Floor Left' : unit === 'B' ? 'Ground Floor Right' : unit === 'C' ? 'Upper Floor Left' : 'Upper Floor Right',
        status: (r.Status || 'owner_occupied') as Flat['status'],
        flatType: '2-Bedroom Standard',
        meterNumber: r.MeterNumber || `ED-UNT-${laneNum}${String(hNum).padStart(2, '0')}${unit}`,
        isAvailableForSublet: r.Status === 'vacant' || r.Status === 'unoccupied',
      };
    });

    store.bulkAddFlats(newFlats);
    store.logAudit({
      estateId: currentEstateId,
      actorId: 'admin',
      actorName: 'Super Admin Bello',
      actorRole: 'phdl_admin',
      action: 'BULK_IMPORT_FLATS',
      entityAffected: 'Flat',
      entityId: `bulk-${Date.now()}`,
      details: `Bulk imported ${newFlats.length} flats and military allocation records into ${currentEstate?.name}.`,
    });

    onImportComplete(newFlats.length);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 760 }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileSpreadsheet size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Bulk Import Flat & Soldier Allocation Records</h3>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-subtle)' }}>
                Target Estate: {currentEstate?.name} ({currentEstate?.totalFlats} Flats Total)
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Paste CSV records or load standard PHDL military onboarding template:
            </span>
            <button type="button" onClick={handleLoadSample} className="btn btn-outline btn-sm" style={{ gap: '0.35rem' }}>
              <Download size={14} />
              Load Sample Template
            </button>
          </div>

          <textarea
            value={rawText}
            onChange={handleTextChange}
            placeholder="Paste CSV lines here (Header: LaneNumber,HouseNumber,UnitLabel,FlatType,MeterNumber,Status,OwnerServiceNumber...)"
            rows={5}
            className="form-textarea"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.775rem' }}
          />

          {errorMsg && (
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--status-danger-bg)', color: 'var(--status-danger-text)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} />
              {errorMsg}
            </div>
          )}

          {/* Live Preview Table */}
          {parsedRows.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                  Parsed Preview ({parsedRows.length} Valid Records)
                </span>
                <span className="badge badge-success">Ready to Import</span>
              </div>
              <div className="table-container" style={{ maxHeight: 220 }}>
                <table className="data-table" style={{ fontSize: '0.775rem' }}>
                  <thead>
                    <tr>
                      <th>Flat Code</th>
                      <th>Type</th>
                      <th>Meter No.</th>
                      <th>Status</th>
                      <th>Officer Name</th>
                      <th>Service No.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.map((r, i) => {
                      const laneNum = r.LaneNumber || '1';
                      const hNum = r.HouseNumber || r.BuildingNumber || '1';
                      const unit = r.UnitLabel || 'A';
                      const code = `L${laneNum}H${hNum}${unit}`;
                      return (
                        <tr key={i}>
                          <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{code}</td>
                          <td>{r.FlatType?.replace(/_/g, ' ') || '3 Bedroom'}</td>
                          <td style={{ fontFamily: 'var(--font-mono)' }}>{r.MeterNumber || '-'}</td>
                          <td>
                            <span className={`badge badge-${r.Status === 'sublet' ? 'info' : r.Status === 'vacant' ? 'warning' : 'success'}`}>
                              {r.Status?.replace('_', ' ') || 'owner occupied'}
                            </span>
                          </td>
                          <td>{r.OwnerFullName || '-'}</td>
                          <td style={{ fontFamily: 'var(--font-mono)' }}>{r.OwnerServiceNumber || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCommitImport}
            disabled={parsedRows.length === 0}
            className="btn btn-primary"
            style={{ gap: '0.4rem' }}
          >
            <Check size={16} />
            Commit & Import {parsedRows.length} Flats
          </button>
        </div>
      </div>
    </div>
  );
};
