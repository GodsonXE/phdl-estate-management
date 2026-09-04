export interface EstateFlat {
  id: string;
  flatCode: string;
  laneNumber: number;
  houseNumber: number;
  flatPosition: 'A' | 'B' | 'C' | 'D';
  apartmentType: string;
  soldierOwner: string;
  serviceNo: string;
  currentTenant: string;
  tenantPhone: string;
  occupancyStatus: 'owner_occupied' | 'sublet_tenant' | 'unoccupied' | 'maintenance';
  meterNumber: string;
  serviceCharge: 'Paid' | 'Pending';
}

export interface SoldierRecord {
  id: string;
  serviceNumber: string;
  rank: string;
  fullName: string;
  branch: 'Army' | 'Navy' | 'Air Force';
  phone: string;
  email: string;
  allocatedFlat: string;
  lane: string;
  status: 'active_service' | 'retired';
  onboardingStatus: 'verified' | 'pending';
  dateAllocated: string;
}

export interface TenantRecord {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  flatCode: string;
  lane: string;
  landlordSoldier: string;
  landlordServiceNo: string;
  employment: string;
  leaseStartDate: string;
  leaseEndDate: string;
  kycStatus: 'verified' | 'pending';
  monthlyRent: number;
  serviceChargeStatus: 'paid' | 'pending';
}

export const NATIONWIDE_18_ESTATES = [
  { id: 'estate-kurudu-01', name: 'PHDL Unity Estate (Kurudu, Abuja FCT)', state: 'Abuja FCT', totalFlats: 400, totalHouses: 100 },
  { id: 'estate-buhari-02', name: 'Muhammadu Buhari Housing Estate (Abuja FCT)', state: 'Abuja FCT', totalFlats: 350, totalHouses: 85 },
  { id: 'estate-ipaja-03', name: 'Post-Service Housing Estate (Iyana Ipaja, Lagos)', state: 'Lagos State', totalFlats: 480, totalHouses: 120 },
  { id: 'estate-epe-04', name: 'Armed Forces Housing Estate (Epe, Lagos)', state: 'Lagos State', totalFlats: 320, totalHouses: 80 },
  { id: 'estate-kaduna-05', name: 'Post-Service Estate (Kaduna)', state: 'Kaduna State', totalFlats: 400, totalHouses: 100 },
  { id: 'estate-ph-06', name: 'Army Post-Service Estate (Port Harcourt, Rivers)', state: 'Rivers State', totalFlats: 360, totalHouses: 90 },
  { id: 'estate-enugu-07', name: 'Armed Forces Estate (Enugu)', state: 'Enugu State', totalFlats: 280, totalHouses: 70 },
  { id: 'estate-asaba-08', name: 'PHDL Valley Estate (Asaba, Delta)', state: 'Delta State', totalFlats: 300, totalHouses: 75 },
  { id: 'estate-ibadan-09', name: 'Army Housing Scheme (Ibadan, Oyo)', state: 'Oyo State', totalFlats: 340, totalHouses: 85 },
  { id: 'estate-benin-10', name: 'Armed Forces Estate (Benin City, Edo)', state: 'Edo State', totalFlats: 260, totalHouses: 65 },
  { id: 'estate-jos-11', name: 'Post-Service Scheme (Jos, Plateau)', state: 'Plateau State', totalFlats: 310, totalHouses: 75 },
  { id: 'estate-calabar-12', name: 'Army Housing Estate (Calabar, Cross River)', state: 'Cross River State', totalFlats: 240, totalHouses: 60 },
  { id: 'estate-kano-13', name: 'Armed Forces Scheme (Kano)', state: 'Kano State', totalFlats: 380, totalHouses: 95 },
  { id: 'estate-owerri-14', name: 'PHDL Palm Estate (Owerri, Imo)', state: 'Imo State', totalFlats: 290, totalHouses: 70 },
  { id: 'estate-makurdi-15', name: 'Army Scheme (Makurdi, Benue)', state: 'Benue State', totalFlats: 220, totalHouses: 55 },
  { id: 'estate-abeokuta-16', name: 'Post-Service Housing (Abeokuta, Ogun)', state: 'Ogun State', totalFlats: 270, totalHouses: 65 },
  { id: 'estate-warri-17', name: 'Armed Forces Housing (Warri, Delta)', state: 'Delta State', totalFlats: 310, totalHouses: 75 },
  { id: 'estate-sokoto-18', name: 'PHDL Command Scheme (Sokoto)', state: 'Sokoto State', totalFlats: 250, totalHouses: 60 },
];

export const generateDefaultFlats = (): EstateFlat[] => {
  const list: EstateFlat[] = [];
  const laneHouses: { [k: number]: number } = { 1: 9, 2: 17, 3: 18, 4: 18, 5: 16, 6: 8, 7: 7, 8: 7 };
  const ranks = ['Staff Sgt.', 'Captain', 'Major', 'Lt. Col.', 'Warrant Officer', 'Master Warrant Officer', 'Corporal', 'Sergeant'];
  const fNames = ['Adamu', 'Farouk', 'Emeka', 'Tunde', 'Ibrahim', 'Chukwuma', 'Musa', 'Babatunde', 'Sunday', 'Usman'];
  const lNames = ['Mohammed', 'Danjuma', 'Okon', 'Adeyemi', 'Bello', 'Eze', 'Abubakar', 'Balogun', 'Okafor', 'Garba'];

  for (let lane = 1; lane <= 8; lane++) {
    const maxH = laneHouses[lane];
    for (let h = 1; h <= maxH; h++) {
      ['A', 'B', 'C', 'D'].forEach((pos, posIdx) => {
        const flatCode = `L${lane}H${h}${pos}`;
        const seed = lane * 100 + h * 4 + posIdx;

        let status: EstateFlat['occupancyStatus'] = 'owner_occupied';
        if (seed % 9 === 0 || seed % 14 === 0) status = 'sublet_tenant';
        else if (seed % 19 === 0) status = 'unoccupied';
        else if (seed % 31 === 0) status = 'maintenance';

        const r = ranks[seed % ranks.length];
        const soldier = `${r} ${fNames[seed % fNames.length]} ${lNames[seed % lNames.length]}`;
        const srv = `NA/${1000 + (seed * 17) % 8999}/ARMY`;
        const tenant = status === 'sublet_tenant' ? `Engr. ${fNames[(seed + 3) % fNames.length]} ${lNames[(seed + 2) % lNames.length]}` : '';

        list.push({
          id: `flat-${flatCode.toLowerCase()}`,
          flatCode,
          laneNumber: lane,
          houseNumber: h,
          flatPosition: pos as any,
          apartmentType: '3-Bedroom Luxury Flat',
          soldierOwner: status !== 'unoccupied' ? soldier : 'Unallocated',
          serviceNo: status !== 'unoccupied' ? srv : 'N/A',
          currentTenant: status === 'sublet_tenant' ? tenant : (status === 'owner_occupied' ? soldier : 'None'),
          tenantPhone: `+234 80${(seed % 9) + 1} ${(100 + seed * 3) % 900} ${(2000 + seed * 7) % 9000}`,
          occupancyStatus: status,
          meterNumber: `MTR-PHDL-${1000 + seed}`,
          serviceCharge: seed % 2 === 0 ? 'Paid' : 'Pending',
        });
      });
    }
  }
  return list;
};

const INITIAL_SOLDIERS: SoldierRecord[] = [
  { id: 's-01', serviceNumber: 'NN/8924/ARMY', rank: 'Staff Sergeant', fullName: 'Adamu Mohammed', branch: 'Army', phone: '+234 803 111 2233', email: 's.adamu@phdl.gov.ng', allocatedFlat: 'L1H1A', lane: 'Lane 1', status: 'retired', onboardingStatus: 'verified', dateAllocated: '2022-04-10' },
  { id: 's-02', serviceNumber: 'NA/10492/ARMY', rank: 'Captain', fullName: 'Tunde Adeyemi', branch: 'Army', phone: '+234 809 123 4567', email: 't.adeyemi@army.gov.ng', allocatedFlat: 'L2H4B', lane: 'Lane 2', status: 'active_service', onboardingStatus: 'verified', dateAllocated: '2023-01-15' },
  { id: 's-03', serviceNumber: 'NN/4412/NAVY', rank: 'Lt. Commander', fullName: 'Emeka Chukwuma', branch: 'Navy', phone: '+234 802 333 4455', email: 'e.chukwuma@navy.gov.ng', allocatedFlat: 'L3H2C', lane: 'Lane 3', status: 'active_service', onboardingStatus: 'verified', dateAllocated: '2021-08-20' },
  { id: 's-04', serviceNumber: 'NAF/5109/AIR', rank: 'Flight Lieutenant', fullName: 'Zainab Bello', branch: 'Air Force', phone: '+234 805 777 8899', email: 'z.bello@airforce.gov.ng', allocatedFlat: 'L4H1D', lane: 'Lane 4', status: 'active_service', onboardingStatus: 'verified', dateAllocated: '2024-03-01' },
];

const INITIAL_TENANTS: TenantRecord[] = [
  { id: 't-01', fullName: 'Emeka Gabriel Okon', phone: '+234 803 456 7890', email: 'emeka.okon@gmail.com', flatCode: 'L1H2A', lane: 'Lane 1', landlordSoldier: 'Staff Sgt. Adamu Mohammed', landlordServiceNo: 'NN/8924/ARMY', employment: 'Petroleum Engineer, NNPC Ltd', leaseStartDate: '2025-01-01', leaseEndDate: '2025-12-31', kycStatus: 'verified', monthlyRent: 150000, serviceChargeStatus: 'paid' },
  { id: 't-02', fullName: 'Dr. (Mrs) Fatima Abubakar', phone: '+234 802 112 3344', email: 'fatima.abubakar@abuja.med.ng', flatCode: 'L2H3C', lane: 'Lane 2', landlordSoldier: 'Major Ibrahim Bello', landlordServiceNo: 'NA/7712/ARMY', employment: 'Medical Consultant, National Hospital', leaseStartDate: '2024-11-01', leaseEndDate: '2025-10-31', kycStatus: 'verified', monthlyRent: 180000, serviceChargeStatus: 'paid' },
  { id: 't-03', fullName: 'Barrister Oladipo Balogun', phone: '+234 806 789 0123', email: 'oladipo@balogunlegal.ng', flatCode: 'L3H5B', lane: 'Lane 3', landlordSoldier: 'Lt. Col. Farouk Danjuma (Rtd.)', landlordServiceNo: 'NA/3310/ARMY', employment: 'Principal Partner, Balogun & Co. Legal', leaseStartDate: '2025-02-01', leaseEndDate: '2026-01-31', kycStatus: 'verified', monthlyRent: 200000, serviceChargeStatus: 'pending' },
];

export const usePhdlStore = () => {
  return {
    getEstates: () => NATIONWIDE_18_ESTATES,
    getAllEstates: () => NATIONWIDE_18_ESTATES,
    getActiveRole: () => (localStorage.getItem('phdl_active_role') as any) || 'phdl_admin',
    setActiveRole: (r: string) => localStorage.setItem('phdl_active_role', r),
    getActiveEstateId: () => localStorage.getItem('phdl_active_estate_id') || 'estate-kurudu-01',
    setActiveEstateId: (id: string) => localStorage.setItem('phdl_active_estate_id', id),
    getEstateById: (id: string) => NATIONWIDE_18_ESTATES.find((e) => e.id === id) || NATIONWIDE_18_ESTATES[0],
    
    getCurrentUserProfile: () => ({
      fullName: 'Adamu Mohammed',
      rank: 'Staff Sergeant',
      serviceNumber: 'NN/8924/ARMY',
      phone: '+234 803 111 2233',
      email: 's.adamu@phdl.gov.ng',
    }),

    getLanes: () => [
      { id: 'lane-1', laneNumber: 1, name: 'Lane 1', blockCount: 9, flatCount: 36, occupiedCount: 34 },
      { id: 'lane-2', laneNumber: 2, name: 'Lane 2', blockCount: 17, flatCount: 68, occupiedCount: 63 },
      { id: 'lane-3', laneNumber: 3, name: 'Lane 3', blockCount: 18, flatCount: 72, occupiedCount: 68 },
      { id: 'lane-4', laneNumber: 4, name: 'Lane 4', blockCount: 18, flatCount: 72, occupiedCount: 66 },
      { id: 'lane-5', laneNumber: 5, name: 'Lane 5', blockCount: 16, flatCount: 64, occupiedCount: 60 },
      { id: 'lane-6', laneNumber: 6, name: 'Lane 6', blockCount: 8, flatCount: 32, occupiedCount: 30 },
      { id: 'lane-7', laneNumber: 7, name: 'Lane 7', blockCount: 7, flatCount: 28, occupiedCount: 26 },
      { id: 'lane-8', laneNumber: 8, name: 'Lane 8', blockCount: 7, flatCount: 28, occupiedCount: 26 },
    ],

    getFlats: (): EstateFlat[] => {
      const saved = localStorage.getItem('phdl_new_400_flats_v12');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length === 400) return parsed;
        } catch (e) { /* fallback */ }
      }
      const fresh = generateDefaultFlats();
      localStorage.setItem('phdl_new_400_flats_v12', JSON.stringify(fresh));
      return fresh;
    },
    saveFlats: (flats: EstateFlat[]) => {
      localStorage.setItem('phdl_new_400_flats_v12', JSON.stringify(flats));
    },

    getSoldiers: () => INITIAL_SOLDIERS,
    getTenants: () => INITIAL_TENANTS,
    getTariffs: () => [
      { id: 't-1', name: 'Monthly Service Charge Levy', amount: 10000, frequency: 'monthly', description: 'Central security patrol, water pumping & perimeter sanitation' },
      { id: 't-2', name: 'New Resident Smart ID Card', amount: 3500, frequency: 'one_time', description: 'RFID biometric pass for 24/7 gate barrier clearance' },
      { id: 't-3', name: 'Prepaid Digital Meter Surcharge', amount: 1500, frequency: 'monthly', description: 'Transformer maintenance and grid power distribution' },
    ],
    getInvoices: () => [
      { id: 'INV-2026-001', residentName: 'Emeka Gabriel Okon', flatCode: 'L1H2A', amount: 10000, status: 'paid', dueDate: '2026-09-05' },
      { id: 'INV-2026-002', residentName: 'Dr. Fatima Abubakar', flatCode: 'L2H3C', amount: 10000, status: 'paid', dueDate: '2026-09-05' },
      { id: 'INV-2026-003', residentName: 'Barrister Oladipo Balogun', flatCode: 'L3H5B', amount: 10000, status: 'pending', dueDate: '2026-09-05' },
    ],
    getIdCards: () => [
      { id: 'IDC-01', holderName: 'Staff Sgt. Adamu Mohammed', role: 'Soldier Owner', flatCode: 'L1H1A', qrCode: 'PHDL-PASS-001', status: 'active', expiryDate: '2027-12-31' },
      { id: 'IDC-02', holderName: 'Emeka Gabriel Okon', role: 'Civilian Tenant', flatCode: 'L1H2A', qrCode: 'PHDL-PASS-002', status: 'active', expiryDate: '2026-12-31' },
      { id: 'IDC-03', holderName: 'Captain Tunde Adeyemi', role: 'Soldier Owner', flatCode: 'L2H4B', qrCode: 'PHDL-PASS-003', status: 'active', expiryDate: '2027-12-31' },
    ],
    getMaintenanceRequests: () => [
      { id: 'MNT-01', flatCode: 'L1H4B', title: 'Main water borehole line pressure fault', priority: 'high', status: 'in_progress', reportedDate: '2026-08-30' },
      { id: 'MNT-02', flatCode: 'L3H2A', title: 'Streetlight pole 4 inverter solar replacement', priority: 'medium', status: 'resolved', reportedDate: '2026-08-25' },
      { id: 'MNT-03', flatCode: 'L5H1C', title: 'Drainage clearing at Lane 5 junction', priority: 'low', status: 'open', reportedDate: '2026-09-01' },
    ],
    getNotifications: () => [
      { id: 'NOTIF-01', title: 'Mandatory 22:00 Perimeter Security Curfew', date: '2026-08-31', target: 'all_residents', content: 'All visitor access at the main gate ceases at 22:00hrs daily.' },
      { id: 'NOTIF-02', title: 'September 2026 ₦10,000 Service Charge Due', date: '2026-09-01', target: 'all_residents', content: 'Monthly service charge billing is now open.' },
    ],
    getAdmins: () => [
      { id: 'ADM-01', name: 'Col. Farouk Danjuma (Rtd.)', role: 'SuperAdmin Commandant', email: 'commandant@phdl.gov.ng' },
      { id: 'ADM-02', name: 'Major Usman Bello', role: 'Operations & Security Officer', email: 'security.hq@phdl.gov.ng' },
    ],
  };
};