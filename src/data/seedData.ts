import {
  Estate,
  Lane,
  Building,
  Flat,
  UnitLabel,
  Soldier,
  Tenant,
  Dependent,
  LeaseAgreement,
  Bill,
  Payment,
  IDCard,
  MaintenanceRequest,
  Announcement,
  AuditLog,
  SystemNotification,
  MilitaryRank,
  ServiceChargeConfig,
  PaymentGatewaySettings,
  BroadcastSmsSettings,
} from '../types';

export const INITIAL_ESTATES: Estate[] = [
  {
    id: 'est-unity',
    name: 'PHDL Unity Estate',
    code: 'UNT-ABJ',
    state: 'Federal Capital Territory',
    city: 'Abuja (Idu / Karu Axis)',
    zone: 'North Central',
    totalLanes: 8,
    totalBuildings: 101, // 9 + 18 + 18 + 18 + 16 + 8 + 7 + 7 = 101 Houses (Blocks)
    totalFlats: 404, // 101 * 4 = 404 Flats
    managerName: 'Col. T. A. Bello (Rtd)',
    managerPhone: '+234 803 452 1190',
    managerEmail: 'unity.manager@phdl.gov.ng',
    establishedYear: 2018,
    address: 'Plot 418, Defence Housing Scheme, Idu Industrial District, Abuja',
  },
  {
    id: 'est-falcon',
    name: 'PHDL Falcon Estate',
    code: 'FLC-LOS',
    state: 'Lagos State',
    city: 'Ikeja / Maryland',
    zone: 'South West',
    totalLanes: 6,
    totalBuildings: 80,
    totalFlats: 320,
    managerName: 'Lt. Cdr. O. K. Sanusi',
    managerPhone: '+234 802 331 4452',
    managerEmail: 'falcon.manager@phdl.gov.ng',
    establishedYear: 2016,
    address: 'Aeronautical Way, Near 9th Brigade, Maryland, Lagos',
  },
  {
    id: 'est-ribadu',
    name: 'PHDL Ribadu Estate',
    code: 'RBD-KAD',
    state: 'Kaduna State',
    city: 'Kaduna North',
    zone: 'North West',
    totalLanes: 10,
    totalBuildings: 120,
    totalFlats: 480,
    managerName: 'Maj. H. U. Danbaba',
    managerPhone: '+234 806 771 9901',
    managerEmail: 'ribadu.manager@phdl.gov.ng',
    establishedYear: 2015,
    address: 'Ribadu Cantonment Bypass, Kawo, Kaduna',
  },
  {
    id: 'est-victoria',
    name: 'PHDL Victoria Estate',
    code: 'VCT-PHC',
    state: 'Rivers State',
    city: 'Port Harcourt',
    zone: 'South South',
    totalLanes: 7,
    totalBuildings: 90,
    totalFlats: 360,
    managerName: 'Capt. (NN) E. E. Bassey',
    managerPhone: '+234 803 118 7654',
    managerEmail: 'victoria.manager@phdl.gov.ng',
    establishedYear: 2019,
    address: 'Bori Camp Annex, GRA Phase 4, Port Harcourt',
  },
  {
    id: 'est-oluyole',
    name: 'PHDL Oluyole Estate',
    code: 'OLY-IBD',
    state: 'Oyo State',
    city: 'Ibadan',
    zone: 'South West',
    totalLanes: 5,
    totalBuildings: 60,
    totalFlats: 240,
    managerName: 'Maj. A. O. Adebayo',
    managerPhone: '+234 805 442 8812',
    managerEmail: 'oluyole.manager@phdl.gov.ng',
    establishedYear: 2020,
    address: '2nd Division Garrison Road, Ojoo, Ibadan',
  },
  {
    id: 'est-akanu',
    name: 'PHDL Akanu Estate',
    code: 'AKN-ENU',
    state: 'Enugu State',
    city: 'Enugu',
    zone: 'South East',
    totalLanes: 6,
    totalBuildings: 70,
    totalFlats: 280,
    managerName: 'Lt. Col. C. N. Okoro',
    managerPhone: '+234 803 992 0014',
    managerEmail: 'akanu.manager@phdl.gov.ng',
    establishedYear: 2021,
    address: '82 Division Cantonment Gate 3, Abakpa, Enugu',
  },
  {
    id: 'est-bagauda',
    name: 'PHDL Bagauda Estate',
    code: 'BGD-KAN',
    state: 'Kano State',
    city: 'Kano',
    zone: 'North West',
    totalLanes: 8,
    totalBuildings: 100,
    totalFlats: 400,
    managerName: 'Maj. S. M. Garba',
    managerPhone: '+234 802 884 1290',
    managerEmail: 'bagauda.manager@phdl.gov.ng',
    establishedYear: 2017,
    address: 'Bukavu Barracks Perimeter, Airport Road, Kano',
  },
  {
    id: 'est-barracksview',
    name: 'PHDL Barracks View Estate',
    code: 'BW-MKD',
    state: 'Benue State',
    city: 'Makurdi',
    zone: 'North Central',
    totalLanes: 4,
    totalBuildings: 50,
    totalFlats: 200,
    managerName: 'Sqn. Ldr. P. T. Iorfa',
    managerPhone: '+234 807 662 1098',
    managerEmail: 'makurdi.manager@phdl.gov.ng',
    establishedYear: 2022,
    address: 'Tactical Air Command Access Road, Makurdi',
  },
  {
    id: 'est-harmony',
    name: 'PHDL Harmony Estate',
    code: 'HRM-ILR',
    state: 'Kwara State',
    city: 'Ilorin',
    zone: 'North Central',
    totalLanes: 4,
    totalBuildings: 40,
    totalFlats: 160,
    managerName: 'Capt. M. O. Yusuf',
    managerPhone: '+234 803 777 6512',
    managerEmail: 'harmony.manager@phdl.gov.ng',
    establishedYear: 2021,
    address: '22 Armoured Brigade Link Road, Sobi, Ilorin',
  },
  {
    id: 'est-sunshine',
    name: 'PHDL Sunshine Estate',
    code: 'SUN-AKR',
    state: 'Ondo State',
    city: 'Akure',
    zone: 'South West',
    totalLanes: 4,
    totalBuildings: 40,
    totalFlats: 160,
    managerName: 'Maj. K. E. Ogundipe',
    managerPhone: '+234 809 332 1198',
    managerEmail: 'sunshine.manager@phdl.gov.ng',
    establishedYear: 2023,
    address: '32 Artillery Brigade Road, Owena, Akure',
  },
  {
    id: 'est-diamond',
    name: 'PHDL Diamond Estate',
    code: 'DMD-ASB',
    state: 'Delta State',
    city: 'Asaba',
    zone: 'South South',
    totalLanes: 5,
    totalBuildings: 60,
    totalFlats: 240,
    managerName: 'Lt. Cdr. B. A. Clark',
    managerPhone: '+234 802 991 3321',
    managerEmail: 'diamond.manager@phdl.gov.ng',
    establishedYear: 2022,
    address: '63 Brigade Area, Okpanam Road, Asaba',
  },
  {
    id: 'est-heritage',
    name: 'PHDL Heritage Estate',
    code: 'HRT-JOS',
    state: 'Plateau State',
    city: 'Jos',
    zone: 'North Central',
    totalLanes: 6,
    totalBuildings: 70,
    totalFlats: 280,
    managerName: 'Col. D. G. Gyang (Rtd)',
    managerPhone: '+234 803 221 8844',
    managerEmail: 'heritage.manager@phdl.gov.ng',
    establishedYear: 2019,
    address: '3rd Armoured Division Cantonment, Rukuba, Jos',
  },
  {
    id: 'est-confluence',
    name: 'PHDL Confluence Estate',
    code: 'CNF-LKJ',
    state: 'Kogi State',
    city: 'Lokoja',
    zone: 'North Central',
    totalLanes: 3,
    totalBuildings: 30,
    totalFlats: 120,
    managerName: 'Capt. I. S. Suleiman',
    managerPhone: '+234 805 119 2288',
    managerEmail: 'confluence.manager@phdl.gov.ng',
    establishedYear: 2023,
    address: 'Chari Maigumeri Barracks Extension, Lokoja',
  },
  {
    id: 'est-calabar',
    name: 'PHDL Calabar Haven Estate',
    code: 'CLB-HVN',
    state: 'Cross River State',
    city: 'Calabar',
    zone: 'South South',
    totalLanes: 4,
    totalBuildings: 40,
    totalFlats: 160,
    managerName: 'Cdr. O. N. Archibong',
    managerPhone: '+234 803 661 5522',
    managerEmail: 'calabar.manager@phdl.gov.ng',
    establishedYear: 2020,
    address: 'Eastern Naval Command Area, Marina, Calabar',
  },
  {
    id: 'est-savannah',
    name: 'PHDL Savannah Estate',
    code: 'SVN-MDG',
    state: 'Borno State',
    city: 'Maiduguri',
    zone: 'North East',
    totalLanes: 5,
    totalBuildings: 50,
    totalFlats: 200,
    managerName: 'Lt. Col. M. Y. Aliyu',
    managerPhone: '+234 806 333 4411',
    managerEmail: 'savannah.manager@phdl.gov.ng',
    establishedYear: 2021,
    address: '7 Division Maimalari Cantonment Buffer, Maiduguri',
  },
  {
    id: 'est-newera',
    name: 'PHDL New Era Estate',
    code: 'NWE-BEN',
    state: 'Edo State',
    city: 'Benin City',
    zone: 'South South',
    totalLanes: 4,
    totalBuildings: 40,
    totalFlats: 160,
    managerName: 'Maj. P. O. Osagie',
    managerPhone: '+234 802 771 9933',
    managerEmail: 'newera.manager@phdl.gov.ng',
    establishedYear: 2022,
    address: '4 Brigade Ekenwan Barracks Road, Benin City',
  },
  {
    id: 'est-oasis',
    name: 'PHDL Oasis Estate',
    code: 'OAS-SKT',
    state: 'Sokoto State',
    city: 'Sokoto',
    zone: 'North West',
    totalLanes: 3,
    totalBuildings: 30,
    totalFlats: 120,
    managerName: 'Capt. A. B. Tambuwal',
    managerPhone: '+234 803 881 2299',
    managerEmail: 'oasis.manager@phdl.gov.ng',
    establishedYear: 2023,
    address: '8 Division Giginya Barracks Link, Sokoto',
  },
  {
    id: 'est-palmridge',
    name: 'PHDL Palm Ridge Estate',
    code: 'PLM-OWR',
    state: 'Imo State',
    city: 'Owerri',
    zone: 'South East',
    totalLanes: 4,
    totalBuildings: 40,
    totalFlats: 160,
    managerName: 'Maj. K. C. Nwachukwu',
    managerPhone: '+234 803 552 1100',
    managerEmail: 'palmridge.manager@phdl.gov.ng',
    establishedYear: 2022,
    address: '34 Artillery Brigade Obinze Extension, Owerri',
  },
];

export const INITIAL_LANES: Lane[] = [
  { id: 'lane-1', estateId: 'est-unity', laneNumber: 1, name: 'Lane 1', totalBuildings: 9 },
  { id: 'lane-2', estateId: 'est-unity', laneNumber: 2, name: 'Lane 2', totalBuildings: 18 },
  { id: 'lane-3', estateId: 'est-unity', laneNumber: 3, name: 'Lane 3', totalBuildings: 18 },
  { id: 'lane-4', estateId: 'est-unity', laneNumber: 4, name: 'Lane 4', totalBuildings: 18 },
  { id: 'lane-5', estateId: 'est-unity', laneNumber: 5, name: 'Lane 5', totalBuildings: 16 },
  { id: 'lane-6', estateId: 'est-unity', laneNumber: 6, name: 'Lane 6', totalBuildings: 8 },
  { id: 'lane-7', estateId: 'est-unity', laneNumber: 7, name: 'Lane 7', totalBuildings: 7 },
  { id: 'lane-8', estateId: 'est-unity', laneNumber: 8, name: 'Lane 8', totalBuildings: 7 },
];

export interface AuthenticatedRosterItem {
  flatCode: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  landlordName: string;
  landlordPhone: string;
}

// Complete verified entries from the 14-page document
export const AUTHENTICATED_ROSTER: AuthenticatedRosterItem[] = [
  // Page 1
  { flatCode: 'L1H1A', tenantName: 'Ugo Ikechukwu Christopher', tenantEmail: 'chrisugorji@gmail.com', tenantPhone: '0812 159 9443', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L1H1D', tenantName: 'Damilola Akindoyin', tenantEmail: 'tbaba1885@gmail.com', tenantPhone: '0813 114 5791', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L1H2A', tenantName: 'Gabriel Shaibu', tenantEmail: 'gabrielshaibu1@gmail.com', tenantPhone: '0817 825 8346', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L1H2B', tenantName: 'Peter Victor Ayodele', tenantEmail: 'dellywood100.vp@gmail.com', tenantPhone: '0704 339 1266', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L1H3A', tenantName: 'Adamu Rabiu', tenantEmail: 'adamurabiu@gmail.com', tenantPhone: '0201 453 7560', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L1H3B', tenantName: 'Enoghenedikieke Itoje', tenantEmail: 'uzuazoitoje@gmail.com', tenantPhone: '0903 354 0176', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L1H3C', tenantName: 'Isaac Oluwatobi Bolu', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L1H4B', tenantName: 'Emmanuel Chibuzor Orji', tenantEmail: 'echibuzor302@gmail.com', tenantPhone: '0817 286 0722', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L1H4C', tenantName: 'George Ubi Uferi', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L1H5B', tenantName: 'Ohenzuwa Clement', tenantEmail: 'ohenzuwaclement@gmail.com', tenantPhone: '0802 373 9427', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L1H6B', tenantName: 'Mr Terry Butcher', tenantEmail: 'contactterrybutcher@gmail.com', tenantPhone: '0902 890 2308', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L1H7A', tenantName: 'Engr. Abdulnur Ozemoya Tokhokho', tenantEmail: 'abdulnurumar@yahoo.com', tenantPhone: '0706 861 3564', landlordName: 'N/A', landlordPhone: 'N/A' },

  // Page 2
  { flatCode: 'L1H8D', tenantName: 'Daniel Akpama', tenantEmail: 'akpamadanielmadee@gmail.com', tenantPhone: '0705 961 6219', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L1H9B', tenantName: 'Faith Jideamah', tenantEmail: 'faithjideama@gmail.com', tenantPhone: '090 2384 7597', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L1H9D', tenantName: 'Chinaza Solomon Akani', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L2H1A', tenantName: 'Ojonye, Esther', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L2H1B', tenantName: 'Eke Kelvin Amarachukwu', tenantEmail: 'xtremekx.ek@gmail.com', tenantPhone: '0703 279 4017', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L2H2C', tenantName: 'Philemon Elisha', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L2H3B', tenantName: 'Jumbo Barnabas', tenantEmail: 'barneeking@gmail.com', tenantPhone: '+234 808 653 3131', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L2H4A', tenantName: 'Theresa John Kwapsoni', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L2H4B', tenantName: 'Rukayat Adeoye Tijani', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L2H5B', tenantName: 'Musa Zaharadeen Mustapha', tenantEmail: 'zaharadeenmusamustapha@gmail.com', tenantPhone: '0703 560 7847', landlordName: 'N/A', landlordPhone: 'N/A' },

  // Page 3
  { flatCode: 'L2H7A', tenantName: 'Dorathy Simon', tenantEmail: 'dorasimon222@gmail.com', tenantPhone: '0706 302 7772', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L2H8B', tenantName: 'Emmanuel Decent Divine', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },

  // Page 4
  { flatCode: 'L2H13C', tenantName: 'Faith Phek Amos', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L3H2A', tenantName: 'Sheriff Ibrahim', tenantEmail: 'sheffybig@gmail.com', tenantPhone: '0813 248 9619', landlordName: 'N/A', landlordPhone: 'N/A' },

  // Page 5
  { flatCode: 'L3H3A', tenantName: 'Rev. Kennedy Kwaghfan Ubwa', tenantEmail: 'N/A', tenantPhone: '0803 599 0680', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L3H4A', tenantName: 'David Onwu Inakwu', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L3H6A', tenantName: 'Mr Nweke Chisom Benedict', tenantEmail: 'amakaagu5@gmail.com', tenantPhone: '0813 107 2627', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L3H6D', tenantName: 'Ndayako Maryam', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L3H9D', tenantName: 'Obivees Signatures Enterprise', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },

  // Page 6
  { flatCode: 'L3H10B', tenantName: 'Thomas Isuwa', tenantEmail: 'thomasisuwa@gmail.com', tenantPhone: '0703 117 8440', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L3H13A', tenantName: 'Victor John', tenantEmail: 'jonvikto@gmail.com', tenantPhone: '0806 927 2111', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L3H15A', tenantName: 'Ibrahim Oluwaseun Ganiyu', tenantEmail: 'highbeeg@gmail.com', tenantPhone: '0812 533 5856', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L3H16A', tenantName: 'Pharm. Samson Ifeanyichukwu Okoro', tenantEmail: 'ifeanyichukwuventures8@gmail.com', tenantPhone: '0706 626 3353', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L3H16B', tenantName: 'Chibueze Onyeso', tenantEmail: 'ezeonline2006@yahoo.com', tenantPhone: '0813 776 1697', landlordName: 'N/A', landlordPhone: 'N/A' },

  // Page 7
  { flatCode: 'L4H3C', tenantName: 'Stephanie Orkuma', tenantEmail: 'stefnyorkuma@gmail.com', tenantPhone: '0810 934 7370', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L4H6C', tenantName: 'Joseph Egbe Godwin', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },

  // Page 8
  { flatCode: 'L4H8A', tenantName: 'Fatima Odufa Alasah', tenantEmail: 'fatudu.audu@gmail.com', tenantPhone: '0809 877 1220', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L4H13B', tenantName: 'Jonah Jackson', tenantEmail: 'triplejnice@gmail.com', tenantPhone: '0803 894 1982', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L4H14D', tenantName: 'Henry Udenwoke', tenantEmail: 'excelmore295@gmail.com', tenantPhone: '0909 987 0768', landlordName: 'N/A', landlordPhone: 'N/A' },

  // Page 9
  { flatCode: 'L4H15A', tenantName: 'Dr. Adeleke Bolaji', tenantEmail: 'adeleke141@gmail.com', tenantPhone: '0907 818 5494', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L4H15B', tenantName: 'Somtochukwu Queency Nwobodo', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L4H16A', tenantName: 'Michael Joel Sule', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L4H16C', tenantName: 'Adeleye Akapo', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L4H17B', tenantName: 'Godson Ogumka', tenantEmail: 'godson.ogumka@gmail.com', tenantPhone: '0816 043 0542', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L4H17D', tenantName: 'Owowa Adeyemi David', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L4H18A', tenantName: 'Col. Rtd. Diche Onunwor', tenantEmail: 'Dichmoorec15@gmail.com', tenantPhone: '0812 764 8165', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L5H1A', tenantName: 'Enahoro Gift', tenantEmail: 'enahorogif@outlook.com', tenantPhone: '0903 010 6336', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L5H1C', tenantName: 'Atai T Dauda', tenantEmail: 'hayosaphetravel@gmail.com', tenantPhone: '0903 040 0009', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L5H1D', tenantName: 'Akomolafe Ayomide Stephen', tenantEmail: 'hayosaphetravel@gmail.com', tenantPhone: '0814 479 8096', landlordName: 'N/A', landlordPhone: 'N/A' },

  // Page 10
  { flatCode: 'L5H7A', tenantName: 'Yusuf Isa Mamuda', tenantEmail: 'Yusufmamudaisa@gmail.com', tenantPhone: '0701 289 3103', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L5H8A', tenantName: 'Adeolu Ogunsuyi', tenantEmail: 'shuyi4real@gmail.com', tenantPhone: '0814 767 9707', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L5H8B', tenantName: 'Akande Adewole', tenantEmail: 'rabumai2030@gmail.com', tenantPhone: '0703 458 970', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L5H10B', tenantName: 'Charles Adegoke', tenantEmail: 'charlytech4gud@gmail.com', tenantPhone: '+234 703 440 3781', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L5H11A', tenantName: 'Ojochide Joseph', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L5H11B', tenantName: 'Abimbola', tenantEmail: 'onipakoabimbola@gmail.com', tenantPhone: '0803 450 4796', landlordName: 'N/A', landlordPhone: 'N/A' },

  // Page 11
  { flatCode: 'L5H12B', tenantName: 'Josephine Ochonogor', tenantEmail: 'hello.josephineochonogor@gmail.com', tenantPhone: '0706 819 2400', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L5H15A', tenantName: 'Phillips Onyike', tenantEmail: 'philonyyx@gmail.com', tenantPhone: '0707 204 4411', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L5H15B', tenantName: 'Promise Chukwuebuka Nbawuike', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L6H1A', tenantName: 'Oteh Jayson Oyiwona', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L6H1B', tenantName: 'Michael Chukwu', tenantEmail: 'naemugo@gmail.com', tenantPhone: '+234 813 063 0784', landlordName: 'N/A', landlordPhone: 'N/A' },

  // Page 12
  { flatCode: 'L6H6A', tenantName: 'Hassana Ibrahim', tenantEmail: 'hyelmursinyi@gmail.com', tenantPhone: '0913 601 9413', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L6H7A', tenantName: 'Kadiri Abdulrasheed', tenantEmail: 'rashkad212@gmail.com', tenantPhone: '0905 262 6988', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L6H8A', tenantName: 'Wisdon Kennedy Kwaghfan', tenantEmail: 'godson.ogumka@gmail.com', tenantPhone: '0706 185 7420', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L6H8B', tenantName: 'Chukwuka Damian Ugwu', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L7H1A', tenantName: 'Rose Apuu', tenantEmail: 'nguherapuu@gmail.com', tenantPhone: '0810 893 2205', landlordName: 'Mohammed Musa', landlordPhone: '0803 690 8771' },
  { flatCode: 'L7H1C', tenantName: 'Maximus Ndianaefo', tenantEmail: 'N/A', tenantPhone: '0803 404 2465', landlordName: 'Clement Odey', landlordPhone: '0706 456 6973' },
  { flatCode: 'L7H2A', tenantName: 'Jonathan Isah', tenantEmail: 'isahjonathan2@gmail.com', tenantPhone: '0903 137 6070', landlordName: 'Bashir Abba', landlordPhone: '0803 894 9839' },
  { flatCode: 'L7H2B', tenantName: 'Goody Oguzie', tenantEmail: 'consultgoody@gmail.com', tenantPhone: '0806 968 9913', landlordName: 'Damina Sammako', landlordPhone: '0703 383 3287' },

  // Page 13
  { flatCode: 'L7H2C', tenantName: 'Olanrewaju Yusuf', tenantEmail: 'yusufdavidd@gmail.com', tenantPhone: '0806 832 7028', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L7H2D', tenantName: 'Peter Anyanwu', tenantEmail: 'mhiterpiro@gmail.com', tenantPhone: '0903 310 0417', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L7H3A', tenantName: 'Chinaza Christopher Edeh', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L7H3B', tenantName: 'Engr Joseph Samson', tenantEmail: 'doxa2137@gmail.com', tenantPhone: '0903 690 9332', landlordName: 'Shitu Gambo', landlordPhone: '0814 316 0940' },
  { flatCode: 'L7H3D', tenantName: 'Andrew Atabo', tenantEmail: 'youngrex68@gmail.com', tenantPhone: '0816 719 7770', landlordName: 'James Ajayi David', landlordPhone: '0703 294 5946' },
  { flatCode: 'L7H4B', tenantName: 'Sheyemi Amazing Grace', tenantEmail: 'amazingyemigrace@gmail.com', tenantPhone: '0708 642 6999', landlordName: 'Ibrahim Ilya', landlordPhone: '0805 238 9178' },
  { flatCode: 'L7H4C', tenantName: 'Obeta Ikechukwu', tenantEmail: 'obetashopping@gmail.com', tenantPhone: '0903 241 285', landlordName: 'Amos Greatman', landlordPhone: '0903 477 2446' },
  { flatCode: 'L7H4D', tenantName: 'Sughter Nyerimba', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'Yakubu Tahir', landlordPhone: '0803 504 1950' },
  { flatCode: 'L7H5A', tenantName: 'Mr Joseph Osatuyi', tenantEmail: 'josephosatuyi@gmail.com', tenantPhone: '0701 881 6494', landlordName: 'Aiki Mohammed', landlordPhone: '0708 521 2735' },
  { flatCode: 'L7H5B', tenantName: 'Adi Nicholas Terwase', tenantEmail: 'adinicholas77@gmail.com', tenantPhone: '0806 166 0881', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L7H5C', tenantName: 'Kola Samuel', tenantEmail: 'whatshotnow.ng@gmail.com', tenantPhone: '0703 029 4464', landlordName: 'Omoja Cornelius', landlordPhone: '0812 684 7353' },
  { flatCode: 'L7H5D', tenantName: 'Mission Chukwudi', tenantEmail: 'chukxmission@gmail.com', tenantPhone: '+971 58 107 7042', landlordName: 'Aliyu Ibrahim', landlordPhone: '0813 304 4809' },
  { flatCode: 'L7H6B', tenantName: 'Oluwaseyi Owoniyi', tenantEmail: 'callmesesmo@gmail.com', tenantPhone: '0901 233 1727', landlordName: 'Kabiru Abdulahi', landlordPhone: '0803 517 6229' },
  { flatCode: 'L7H6C', tenantName: 'Godwin Attayi Egbunu', tenantEmail: 'godatta37@gmail.com', tenantPhone: '0897 255 0484', landlordName: 'Otulu Matthew', landlordPhone: '0706 664 7698' },
  { flatCode: 'L7H6D', tenantName: 'Vershima Racheal', tenantEmail: 'rachelsimon238@gmail.com', tenantPhone: '0813 076 3405', landlordName: 'Garba Maccido', landlordPhone: '0810 576 4342' },
  { flatCode: 'L7H7A', tenantName: 'Ovie Immanuel', tenantEmail: 'ovieimmanuel@gmail.com', tenantPhone: '+234 812 352 2390', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L7H7B', tenantName: 'Michael Ihueze', tenantEmail: 'ihuezemichael9@gmail.com', tenantPhone: '0901 233 1727', landlordName: 'Umar Saleh', landlordPhone: '0806 564 4770' },
  { flatCode: 'L7H7C', tenantName: 'Abdullahi Kabir', tenantEmail: 'abdallahkabeerbash@gmail.com', tenantPhone: '0706 344 4201', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L7H7D', tenantName: 'Obasiigbo Lawrence', tenantEmail: 'N/A', tenantPhone: '0803 055 4330', landlordName: 'Yahaya Umar', landlordPhone: '0703 548 7455' },
  { flatCode: 'L8H1A', tenantName: 'Nwosa Richman', tenantEmail: 'nwosaichman@gmail.com', tenantPhone: '0903 066 5180', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L8H1C', tenantName: 'Onyekachi Chigbu', tenantEmail: 'chigbu64@gmail.com', tenantPhone: '0906 684 8256', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L8H1D', tenantName: 'Elegbede Oluwaseyi George', tenantEmail: 'oluwaseyielegbede99@gmail.com', tenantPhone: '0913 765 8800', landlordName: 'Ahmed Mohammed', landlordPhone: '0803 699 6590' },

  // Page 14
  { flatCode: 'L8H2A', tenantName: 'Barr. Samuel Okoye', tenantEmail: 'wenfillglobal@gmail.com', tenantPhone: '0816 520 7087', landlordName: 'Bukar Mohammed', landlordPhone: '0803 950 4603' },
  { flatCode: 'L8H2B', tenantName: 'Ignatius Sani', tenantEmail: 'igee54077@gmail.com', tenantPhone: '0810 727 8841', landlordName: 'Awo Amos Joshua', landlordPhone: '0803 969 5557' },
  { flatCode: 'L8H2C', tenantName: 'Faith Ukachu', tenantEmail: 'princessfechi@gmail.com', tenantPhone: '0703 823 6019', landlordName: 'Oyeniyi Abodunrin', landlordPhone: '0803 157 8505' },
  { flatCode: 'L8H3A', tenantName: 'Queeneth', tenantEmail: 'duchessglamoreskin@gmail.com', tenantPhone: '0812 237 4450', landlordName: 'Okunye Joke', landlordPhone: '0803 633 2336' },
  { flatCode: 'L8H3C', tenantName: 'Mbak Akpan Moffat', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L8H3D', tenantName: 'Promise Michaelson', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'Yahaya Mudi', landlordPhone: '0703 555 4458' },
  { flatCode: 'L8H4A', tenantName: 'Bitrus Diwo Tumba', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L8H4B', tenantName: 'Ugonna Kingsley', tenantEmail: 'nganwuchuugonna@gmail.com', tenantPhone: '0803 418 2613', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L8H4D', tenantName: 'Eromosele', tenantEmail: 'viktorzion@yahoo.com', tenantPhone: '0905 181 8340', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L8H5A', tenantName: 'Ezeoke Anthony', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L8H5B', tenantName: 'Adeleke James Oseni', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L8H5C', tenantName: 'Osabeyi Martins Ogheneovo', tenantEmail: 'osabeyimartinsooo@gmail.com', tenantPhone: '0708 710 5888', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L8H5D', tenantName: 'Adekoya Olubukola', tenantEmail: 'olubukola910@gmail.com', tenantPhone: '0806 353 8078', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L8H6A', tenantName: 'Taofeeq Hamzat', tenantEmail: 'hamzattao@gmail.com', tenantPhone: '0803 373 3357', landlordName: 'Paulina Segun', landlordPhone: '0810 155 4663' },
  { flatCode: 'L8H7A', tenantName: 'Victor Osunde', tenantEmail: 'viktorzion@yahoo.com', tenantPhone: '0803 777 9166', landlordName: 'N/A', landlordPhone: 'N/A' },
  { flatCode: 'L8H7B', tenantName: 'Nwosu Wisdom', tenantEmail: 'N/A', tenantPhone: 'N/A', landlordName: 'N/A', landlordPhone: 'N/A' },
];

// Helper to check if string is placeholder / empty
export const isPlaceholder = (val?: string): boolean => {
  if (!val) return true;
  const t = val.trim().toLowerCase();
  return t === 'n/a' || t === 'unidentified soldier' || t === 'unconfirmed tenant' || t === '' || t === 'none';
};

// Permitted non-commissioned & warrant officer ranks in PHDL Unity Estate
const PERMITTED_SOLDIER_RANKS: MilitaryRank[] = [
  'Staff Sergeant',
  'Master Warrant Officer',
  'Warrant Officer',
  'Sergeant',
  'Corporal',
  'Lance Corporal',
  'Private',
];

// Map of roster item by flatCode
const ROSTER_MAP = new Map<string, AuthenticatedRosterItem>();
AUTHENTICATED_ROSTER.forEach((item) => {
  ROSTER_MAP.set(item.flatCode.toUpperCase(), item);
});

// Generate all 404 flats with precise landlords, tenants, and unoccupied statuses
export const generateEstateData = () => {
  const buildings: Building[] = [];
  const flats: Flat[] = [];
  const soldiers: Soldier[] = [];
  const tenants: Tenant[] = [];
  const leases: LeaseAgreement[] = [];

  const laneHouseCounts: Record<number, number> = {
    1: 9,
    2: 18,
    3: 18,
    4: 18,
    5: 16,
    6: 8,
    7: 7,
    8: 7,
  };

  // Single shared placeholder soldier object for UnIdentified Soldier
  const unidentifiedSoldier: Soldier = {
    id: 'soldier-unidentified',
    serviceNumber: 'NA/PENDING/000',
    militaryBranch: 'Nigerian Army',
    rank: 'Sergeant',
    fullName: 'UnIdentified Soldier',
    phone: 'N/A',
    email: 'unallocated@phdl.gov.ng',
    unitBrigade: 'Pending Unit Verification, Abuja Garrison',
    ownedFlatIds: [],
    verificationStatus: 'pending_verification',
  };
  soldiers.push(unidentifiedSoldier);

  // Ranks rotator for confirmed landlords without explicit ranks
  let rankIdx = 0;

  INITIAL_LANES.forEach((lane) => {
    const houseCount = laneHouseCounts[lane.laneNumber] || 10;

    for (let h = 1; h <= houseCount; h++) {
      const buildingId = `bld-l${lane.laneNumber}-h${h}`;
      buildings.push({
        id: buildingId,
        laneId: lane.id,
        estateId: 'est-unity',
        buildingNumber: h,
        blockLabel: `House ${h} (Block ${h})`,
        totalFloors: 2,
      });

      const units: UnitLabel[] = ['A', 'B', 'C', 'D'];
      const floors: Flat['floor'][] = [
        'Ground Floor Left',
        'Ground Floor Right',
        'First Floor Left',
        'First Floor Right',
      ];

      units.forEach((uLabel, uIdx) => {
        const fullCode = `L${lane.laneNumber}H${h}${uLabel}`;
        const flatId = `flat-l${lane.laneNumber}-h${h}-${uLabel.toLowerCase()}`;
        const rosterItem = ROSTER_MAP.get(fullCode);

        const hasTenant = rosterItem && !isPlaceholder(rosterItem.tenantName);
        const hasLandlord = rosterItem && !isPlaceholder(rosterItem.landlordName);

        let ownerId = unidentifiedSoldier.id;
        let tenantId: string | undefined = undefined;
        let status: Flat['status'] = 'unoccupied';

        // 1. If firm combination of both UnIdentified Soldier and Unconfirmed Tenant -> UNOCCUPIED
        if (!hasTenant && !hasLandlord) {
          status = 'unoccupied';
          ownerId = unidentifiedSoldier.id;
          tenantId = undefined;
        }
        // 2. If Landlord exists
        else if (hasLandlord) {
          const lName = rosterItem!.landlordName.trim();
          const lPhone = rosterItem!.landlordPhone.trim();
          const soldierId = `soldier-${fullCode.toLowerCase()}`;
          const assignedRank = PERMITTED_SOLDIER_RANKS[rankIdx % PERMITTED_SOLDIER_RANKS.length];
          rankIdx++;

          const soldier: Soldier = {
            id: soldierId,
            serviceNumber: `NA/${2005 + (rankIdx % 15)}/${1000 + Math.floor(Math.random() * 8999)}`,
            militaryBranch: 'Nigerian Army',
            rank: assignedRank,
            fullName: lName,
            phone: lPhone,
            email: `${lName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@army.mil.ng`,
            unitBrigade: 'Guards Brigade / Mogadishu Cantonment, Abuja',
            ownedFlatIds: [flatId],
            verificationStatus: 'verified',
          };
          soldiers.push(soldier);
          ownerId = soldier.id;

          if (hasTenant) {
            status = 'sublet';
          } else {
            status = 'owner_occupied';
          }
        }
        // 3. If Tenant exists but Landlord is UnIdentified Soldier
        else if (hasTenant) {
          status = 'sublet';
          ownerId = unidentifiedSoldier.id;
        }

        // Create Tenant & Lease if tenant exists
        if (hasTenant) {
          const tName = rosterItem!.tenantName.trim();
          const tEmail = isPlaceholder(rosterItem!.tenantEmail) ? 'N/A' : rosterItem!.tenantEmail.trim();
          const tPhone = isPlaceholder(rosterItem!.tenantPhone) ? 'N/A' : rosterItem!.tenantPhone.trim();
          const tId = `tenant-${fullCode.toLowerCase()}`;
          tenantId = tId;

          const tenant: Tenant = {
            id: tId,
            fullName: tName,
            phone: tPhone,
            email: tEmail,
            occupation: 'Civilian Resident',
            flatId,
            landlordId: ownerId,
            estateId: 'est-unity',
            leaseStart: '2025-10-01',
            leaseEnd: '2026-09-30',
            rentAmount: 1800000,
            rentFrequency: 'annual',
            status: 'active',
            idCardNumber: `PHDL-UNT-T-2025-${String(tenants.length + 1).padStart(3, '0')}`,
          };
          tenants.push(tenant);

          leases.push({
            id: `lease-${tId}`,
            tenantId: tId,
            flatId,
            landlordId: ownerId,
            estateId: 'est-unity',
            rentAmount: 1800000,
            paymentFrequency: 'annual',
            startDate: '2025-10-01',
            endDate: '2026-09-30',
            status: 'active',
            securityDeposit: 150000,
            agreementDocName: `PHDL_Tenancy_Agreement_${tName.replace(/\s+/g, '')}.pdf`,
            agreementDocUrl: '#',
            signedDate: '2025-10-01',
            isOwnerAcknowledged: true,
            isPHDLApproved: true,
            terms: 'Standard residential lease agreement. Subletting prohibited.',
          });
        }

        flats.push({
          id: flatId,
          buildingId,
          laneId: lane.id,
          estateId: 'est-unity',
          unitLabel: uLabel,
          fullFlatCode: fullCode,
          floor: floors[uIdx],
          status,
          flatType: '2_bedroom_flat',
          meterNumber: `ED-UNT-${lane.laneNumber}${String(h).padStart(2, '0')}${uLabel}`,
          ownerId,
          currentTenantId: tenantId,
          isAvailableForSublet: false,
        });
      });
    }
  });

  return { buildings, flats, soldiers, tenants, leases };
};

const generated = generateEstateData();
export const INITIAL_BUILDINGS = generated.buildings;
export const INITIAL_FLATS = generated.flats;
export const INITIAL_SOLDIERS = generated.soldiers;
export const INITIAL_TENANTS = generated.tenants;
export const INITIAL_LEASES = generated.leases;

export const INITIAL_DEPENDENTS: Dependent[] = [];

export const INITIAL_BILLS: Bill[] = [
  {
    id: 'bill-1',
    invoiceNumber: 'INV-2026-08-001',
    flatId: 'flat-l4-h17-b',
    estateId: 'est-unity',
    laneId: 'lane-4',
    billType: 'service_charge',
    title: 'Monthly Estate Service Charge (August 2026)',
    description: 'Security patrol, streetlighting generator diesel, waste disposal, horticulture.',
    totalAmount: 30000,
    ownerPortion: 15000,
    tenantPortion: 15000,
    payerRole: 'split',
    billingPeriod: 'August 2026',
    dueDate: '2026-08-25',
    status: 'unpaid',
    ownerPaidAmount: 0,
    tenantPaidAmount: 0,
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'bill-2',
    invoiceNumber: 'INV-2026-08-002',
    flatId: 'flat-l7-h1-a',
    estateId: 'est-unity',
    laneId: 'lane-7',
    billType: 'power_electricity',
    title: 'Central Grid Power Supply (July 2026 Post-Paid)',
    description: 'Abuja Electricity Distribution Company (AEDC) dedicated feeder charge.',
    totalAmount: 24500,
    ownerPortion: 0,
    tenantPortion: 24500,
    payerRole: 'tenant',
    billingPeriod: 'July 2026',
    dueDate: '2026-08-20',
    status: 'unpaid',
    ownerPaidAmount: 0,
    tenantPaidAmount: 0,
    createdAt: '2026-08-02T09:00:00Z',
  },
];

export const INITIAL_SERVICE_CHARGE_CONFIG: ServiceChargeConfig = {
  estateId: 'est-unity',
  monthlyRate: 10000,
  threeMonthsAmount: 30000,
  sixMonthsAmount: 60000,
  annualAmount: 120000,
  remarks:
    'Approved by PHDL Estate Command Board: Standard monthly service charge is set at ₦10,000. Under official policy, all residents/tenants pay directly in bulk cycles (Quarterly ₦30,000 | Bi-Annual ₦60,000 | Annual ₦120,000) to ensure uninterrupted 24/7 security detachment, borehole filtration, generator fuel, and estate sanitation.',
  lastUpdatedBy: 'Col. T. A. Bello (Rtd) - SuperAdmin',
  lastUpdatedAt: '2026-08-15T00:00:00.000Z',
  history: [],
};

export const INITIAL_PAYMENTS: Payment[] = [];

export const INITIAL_ID_CARDS: IDCard[] = INITIAL_TENANTS.map((t) => {
  const flat = INITIAL_FLATS.find((f) => f.id === t.flatId);
  const lane = INITIAL_LANES.find((l) => l.id === flat?.laneId);
  return {
    id: `idc-${t.id}`,
    estateId: 'est-unity',
    holderType: 'tenant' as const,
    holderId: t.id,
    holderName: t.fullName,
    holderRoleOrRank: 'Civilian Tenant Resident',
    flatCode: flat?.fullFlatCode || '',
    laneName: lane?.name || 'Lane',
    cardNumber: t.idCardNumber || `PHDL-UNT-T-2026-${Math.floor(100 + Math.random() * 900)}`,
    qrData: `PHDL:UNT:TENANT:${t.fullName.toUpperCase().replace(/\s+/g, '-')}:FLAT-${flat?.fullFlatCode}:EXP-2026-12-31`,
    issueDate: t.leaseStart || '2026-01-01',
    expiryDate: t.leaseEnd || '2026-12-31',
    status: 'active' as const,
    emergencyContact: t.phone,
  };
});

export const INITIAL_MAINTENANCE: MaintenanceRequest[] = [];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'anc-1',
    estateId: 'est-unity',
    senderName: 'Col. T. A. Bello (Rtd) - Estate Manager',
    senderRole: 'PHDL Estate Management',
    title: 'Authentication and Full Roster Upload Completed for Unity Estate',
    message: 'Official Landlord and Tenant rosters have been updated across all 404 flats. SuperAdmin edit capabilities are active for updating pending N/A records.',
    scope: 'estate_wide',
    channels: ['in_app', 'sms_termii', 'email'],
    deliveryStatus: {
      inAppCount: 404,
      smsSentCount: 404,
      emailSentCount: 404,
    },
    createdAt: '2026-08-15T01:30:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    recipientRole: 'phdl_admin',
    recipientId: 'admin',
    title: 'Estate Roster Authenticated',
    message: 'All 404 flats synchronized with authentic tenant and soldier landlord records. Unconfirmed units marked as unoccupied.',
    type: 'estate_broadcast',
    channel: 'in_app',
    isRead: false,
    createdAt: '2026-08-15T01:30:00Z',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1',
    estateId: 'est-unity',
    actorId: 'admin',
    actorName: 'Col. T. A. Bello (Rtd)',
    actorRole: 'phdl_admin',
    action: 'AUTHENTICATED_ROSTER_INGESTION',
    entityAffected: 'EstateHierarchy',
    entityId: 'est-unity-404',
    details: 'Erased old data and populated 404 flats with authenticated roster. Configured UnIdentified Soldier and Unconfirmed Tenant placeholders and tagged empty units as unoccupied.',
    ipAddress: '197.210.84.1',
    timestamp: '2026-08-15T01:30:00Z',
  },
];

export const INITIAL_PAYMENT_GATEWAY_SETTINGS: PaymentGatewaySettings = {
  activeGateway: 'paystack',
  environment: 'live',
  paystack: {
    livePublicKey: 'pk_live_d8a4f91b72e6c51083fa90812bd94e772810a9f1',
    liveSecretKey: 'sk_live_9a72b83c4d5e6f01928374650192837465910293',
    testPublicKey: 'pk_test_e910283746591028374659102837465910283746',
    testSecretKey: 'sk_test_1029384756102938475610293847561029384756',
    webhookSecret: 'whsec_phdl_unity_live_9018273645',
    merchantSubaccount: 'ACCT_phdl_unity_treasury_01',
    callbackUrl: 'https://unity.phdl.gov.ng/api/payments/paystack/callback',
  },
  flutterwave: {
    livePublicKey: 'FLWPUBK_LIVE-d89172635481920384756-X',
    liveSecretKey: 'FLWSECK_LIVE-91827364501928374650-X',
    liveEncryptionKey: 'FLWSECK_LIVE_ENC_81726354',
    testPublicKey: 'FLWPUBK_TEST-90182736451928374650-X',
    testSecretKey: 'FLWSECK_TEST-19283746501928374650-X',
    webhookSecret: 'flw_sec_hash_unity_estate_2026',
    callbackUrl: 'https://unity.phdl.gov.ng/api/payments/flutterwave/callback',
  },
  lastUpdatedBy: 'Col. T. A. Bello (Rtd) - SuperAdmin',
  lastUpdatedAt: '2026-08-15T12:00:00Z',
};

export const INITIAL_BROADCAST_SMS_SETTINGS: BroadcastSmsSettings = {
  primaryProvider: 'termii',
  senderId: 'PHDL-UNITY',
  termii: {
    apiKey: 'TL_TER_live_9018273645819203847561029384756102938475',
    baseUrl: 'https://api.ng.termii.com/api/sms/send',
    senderId: 'PHDL-UNITY',
    channel: 'generic',
  },
  bulkSmsNigeria: {
    apiToken: 'BSN_live_tok_81920384756102938475610293847561',
    baseUrl: 'https://www.bulksmsnigeria.com/api/v1/sms/create',
    senderId: 'PHDL-HQ',
    gateway: 'corporate',
  },
  twilio: {
    accountSid: 'AC90182736458192038475610293847561',
    authToken: 'auth_90182736458192038475610293847561',
    fromNumber: '+234800000PHDL',
  },
  africasTalking: {
    username: 'phdl_operations',
    apiKey: 'atsk_90182736458192038475610293847561',
    senderId: 'PHDL-UNITY',
  },
  smartSmsSolutions: {
    apiToken: 'SMART_90182736458192038475610293847561',
    senderId: 'PHDL-UNITY',
  },
  routingRules: {
    rentExpiryAlerts: true,
    serviceChargeBroadcasts: true,
    emergencySecurityAlerts: true,
    gatePassApprovals: true,
    maintenanceUpdates: true,
  },
  lastUpdatedBy: 'Col. T. A. Bello (Rtd) - SuperAdmin',
  lastUpdatedAt: '2026-08-15T12:00:00Z',
};
