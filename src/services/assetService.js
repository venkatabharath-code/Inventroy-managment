const initialAssets = [
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
const initialMaintenance = [
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
const ASSET_STORAGE_KEY = 'asset_register';
function safeParseStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    console.warn(`[assetService] localStorage corruption detected for key "${key}". Resetting.`);
    localStorage.removeItem(key);
    return null;
  }
}
export const assetService = {
  async delay(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  async getAssets() {
    await this.delay();
    const parsed = safeParseStorage(ASSET_STORAGE_KEY);
    if (parsed) return parsed;
    localStorage.setItem(ASSET_STORAGE_KEY, JSON.stringify(initialAssets));
    return initialAssets;
  },
  async registerAsset(asset) {
    await this.delay();
    const assets = await this.getAssets();
    // Always pad to 3 digits
    const nextId = `AST${String(assets.length + 1).padStart(3, '0')}`;
    const newAsset = {
      ...asset,
      id: nextId,
      status: 'operational',
      daysLeft: 365
    };
    const updatedAssets = [newAsset, ...assets];
    localStorage.setItem(ASSET_STORAGE_KEY, JSON.stringify(updatedAssets));
    return newAsset;
  },
  async getMaintenanceSchedule() {
    await this.delay(100);
    return initialMaintenance;
  }
};
