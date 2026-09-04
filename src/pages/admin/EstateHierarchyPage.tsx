import React, { useState } from 'react';
import { Building, Building2, ChevronDown, ChevronRight, Printer } from 'lucide-react';

const LANES = [
  { laneNumber: 1, houses: 9, flats: 36, occupied: 34 },
  { laneNumber: 2, houses: 17, flats: 68, occupied: 63 },
  { laneNumber: 3, houses: 18, flats: 72, occupied: 68 },
  { laneNumber: 4, houses: 18, flats: 72, occupied: 66 },
  { laneNumber: 5, houses: 16, flats: 64, occupied: 60 },
  { laneNumber: 6, houses: 8, flats: 32, occupied: 30 },
  { laneNumber: 7, houses: 7, flats: 28, occupied: 26 },
  { laneNumber: 8, houses: 7, flats: 28, occupied: 26 },
];

export const EstateHierarchyPage: React.FC = () => {
  const [expandedLane, setExpandedLane] = useState<number | null>(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="section-overline"><span>COMMAND HIERARCHY TREE</span> • <span>400 FLATS • 100 HOUSES</span></div>
          <h1>Estate Tree Hierarchy & Architectural Map</h1>
          <p>Interactive hierarchy of all <strong>8 Zoned Lanes, 100 Residential Houses, and 400 Flats</strong> across PHDL Unity Estate.</p>
        </div>
        <button onClick={() => window.print()} className="btn btn-outline btn-sm" style={{ gap: '0.4rem' }}>
          <Printer size={14} /> Print Hierarchy Map
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {LANES.map((lane) => {
          const isExpanded = expandedLane === lane.laneNumber;
          const pct = Math.round((lane.occupied / lane.flats) * 100);

          return (
            <div key={lane.laneNumber} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div
                onClick={() => setExpandedLane(isExpanded ? null : lane.laneNumber)}
                style={{
                  padding: '1rem 1.25rem',
                  backgroundColor: isExpanded ? 'var(--army-green-50)' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {isExpanded ? <ChevronDown size={20} color="var(--army-green-900)" /> : <ChevronRight size={20} color="var(--text-muted)" />}
                  <div>
                    <span style={{ fontWeight: 900, fontSize: '1.05rem', color: 'var(--army-green-950)' }}>Lane {lane.laneNumber}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '0.75rem' }}>
                      ({lane.houses} Houses • {lane.flats} Flats: L{lane.laneNumber}H1 to L{lane.laneNumber}H{lane.houses})
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--army-green-800)' }}>
                  {lane.occupied}/{lane.flats} Occupied ({pct}%)
                </div>
              </div>

              {isExpanded && (
                <div style={{ padding: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', backgroundColor: '#F8FAFC' }}>
                  {Array.from({ length: lane.houses }, (_, i) => i + 1).map((houseNum) => (
                    <div key={houseNum} style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-light)', borderRadius: 8, padding: '0.85rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--army-green-900)', marginBottom: '0.5rem' }}>
                        House {houseNum} (4 Flats)
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                        {['A', 'B', 'C', 'D'].map((pos) => (
                          <div key={pos} style={{ padding: '0.35rem', borderRadius: 4, backgroundColor: 'var(--army-green-50)', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--army-green-950)' }}>
                            Flat L{lane.laneNumber}H{houseNum}{pos}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EstateHierarchyPage;