export const initialAssets = [
  {
    id: 'AST001',
    name: 'MRI Machine - Siemens 3T',
    purchased: '2023-05-15',
    category: 'Imaging',
    location: 'Radiology Dept',
    value: '₹150.0L',
    warrantyExpires: '2026-05-15',
    daysLeft: 107,
    lastMaintenance: '2025-12-10',
    status: 'operational',
  },
  {
    id: 'AST002',
    name: 'Ventilator - Model V500',
    purchased: '2024-02-20',
    category: 'Critical Care',
    location: 'ICU-1',
    value: '₹8.5L',
    warrantyExpires: '2027-02-20',
    daysLeft: null,
    lastMaintenance: '2026-01-01',
    status: 'operational',
  },
  {
    id: 'AST003',
    name: 'Surgical Table - Advanced',
    purchased: '2022-08-10',
    category: 'Surgery',
    location: 'OR-1',
    value: '₹12.0L',
    warrantyExpires: '2025-08-10',
    daysLeft: -171,
    lastMaintenance: '2025-11-15',
    status: 'maintenance',
  },
  {
    id: 'AST004',
    name: 'X-Ray Machine - Digital',
    purchased: '2023-11-05',
    category: 'Imaging',
    location: 'Radiology Dept',
    value: '₹25.0L',
    warrantyExpires: '2026-11-05',
    daysLeft: null,
    lastMaintenance: '2025-12-20',
    status: 'operational',
  }
];

export const initialMaintenance = [
  {
    id: 1,
    equipment: 'MRI Machine - Siemens 3T',
    scheduled: 'Jan 15, 2026',
    type: 'Quarterly Preventive'
  },
  {
    id: 2,
    equipment: 'Ventilator - Model V500',
    scheduled: 'Jan 16, 2026',
    type: 'Quarterly Preventive'
  }
];
