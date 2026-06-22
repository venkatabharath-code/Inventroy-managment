import { stockAlerts, recentMovements } from '../data/mockData';
export const initialStockData = [
  {
    id: 1,
    name: 'Paracetamol 500mg',
    sku: 'INV001',
    category: 'Medicine',
    currentStock: '5000 tablets',
    currentStockClass: 'text-success',
    minStock: '2000 tablets',
    expiryDate: '2027-06-15',
    expiryDateClass: 'text-normal',
    location: 'Pharmacy - Shelf A3',
    status: 'in-stock',
    statusLabel: 'in-stock'
  },
  {
    id: 2,
    name: 'Insulin Glargine 100U/ml',
    sku: 'INV002',
    category: 'Medicine',
    currentStock: '450 vials',
    currentStockClass: 'text-warning',
    minStock: '500 vials',
    expiryDate: '2026-03-20',
    expiryDateClass: 'text-normal',
    location: 'Pharmacy - Refrigerator B',
    status: 'low-stock',
    statusLabel: 'low-stock'
  },
  {
    id: 3,
    name: 'Surgical Gloves (Medium)',
    sku: 'INV003',
    category: 'Consumable',
    currentStock: '150 boxes',
    currentStockClass: 'text-warning',
    minStock: '500 boxes',
    expiryDate: 'N/A',
    expiryDateClass: 'text-normal',
    location: 'Storage - Section C',
    status: 'low-stock',
    statusLabel: 'low-stock'
  },
  {
    id: 4,
    name: 'Amoxicillin 250mg',
    sku: 'INV004',
    category: 'Medicine',
    currentStock: '0 capsules',
    currentStockClass: 'text-critical',
    minStock: '1000 capsules',
    expiryDate: 'N/A',
    expiryDateClass: 'text-normal',
    location: 'Pharmacy - Shelf B1',
    status: 'out-of-stock',
    statusLabel: 'out-of-stock'
  },
  {
    id: 5,
    name: 'ECG Machine Electrodes',
    sku: 'INV005',
    category: 'Equipment',
    currentStock: '800 pieces',
    currentStockClass: 'text-success',
    minStock: '200 pieces',
    expiryDate: 'N/A',
    expiryDateClass: 'text-normal',
    location: 'Equipment Room 2',
    status: 'in-stock',
    statusLabel: 'in-stock'
  },
  {
    id: 6,
    name: 'IV Fluid - Normal Saline 500ml',
    sku: 'INV006',
    category: 'Consumable',
    currentStock: '300 bags',
    currentStockClass: 'text-warning',
    minStock: '1000 bags',
    expiryDate: '2026-02-10',
    expiryDateClass: 'text-critical',
    location: 'Storage - Section A',
    status: 'expiring-soon',
    statusLabel: 'expiring-soon'
  },
  {
    id: 7,
    name: 'Surgical Suture Kit',
    sku: 'INV007',
    category: 'Surgical',
    currentStock: '250 kits',
    currentStockClass: 'text-success',
    minStock: '100 kits',
    expiryDate: 'N/A',
    expiryDateClass: 'text-normal',
    location: 'OR Storage',
    status: 'in-stock',
    statusLabel: 'in-stock'
  }
];
const STOCK_STORAGE_KEY = 'inventory_stock_data';
const MOVEMENTS_STORAGE_KEY = 'inventory_movements_data';
function safeParseStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    console.warn(`[inventoryService] localStorage corruption detected for key "${key}". Resetting.`);
    localStorage.removeItem(key);
    return null;
  }
}
function generateSKU(existingItems) {
  const nextNum = existingItems.length + 1;
  return `INV${String(nextNum).padStart(3, '0')}`;
}
export const inventoryService = {
  delay: (ms = 300) => new Promise(resolve => setTimeout(resolve, ms)),
  getStockItemsSync() {
    return safeParseStorage(STOCK_STORAGE_KEY) || initialStockData;
  },
  async getStockItems() {
    await this.delay();
    const parsed = safeParseStorage(STOCK_STORAGE_KEY);
    if (parsed) return parsed;
    localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(initialStockData));
    return initialStockData;
  },
  async addStockItem(item) {
    await this.delay();
    const items = await this.getStockItems();
    //  placeholder
    const uniqueSKU = (item.sku && item.sku !== 'SKU-1001') ? item.sku : generateSKU(items);
    const newItem = {
      ...item,
      id: Date.now(),
      sku: uniqueSKU,
      status: 'in-stock',
      statusLabel: 'in-stock',
      currentStockClass: 'text-success',
      expiryDateClass: 'text-normal'
    };
    const updatedItems = [newItem, ...items];
    localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(updatedItems));
    const movements = await this.getRecentMovements();
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const newMovement = {
      id: Date.now() + 1,
      dateTime: formattedDate,
      item: item.name,
      type: 'Stock In',
      quantity: `+${item.currentStock}`,
      quantityType: 'positive',
      location: item.location || 'Warehouse',
      user: 'Admin'
    };
    const updatedMovements = [newMovement, ...movements].slice(0, 10);
    localStorage.setItem(MOVEMENTS_STORAGE_KEY, JSON.stringify(updatedMovements));
    return newItem;
  },
  async getDashboardStats() {
    await this.delay(100);
    const stockItems = this.getStockItemsSync();
    const totalSKUs = stockItems.length;
    const lowStock = stockItems.filter(i => i.status === 'low-stock').length;
    const outOfStock = stockItems.filter(i => i.status === 'out-of-stock').length;
    const today = new Date();
    const in30 = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const expiringSoon = stockItems.filter(i => {
      if (!i.expiryDate || i.expiryDate === 'N/A') return false;
      const d = new Date(i.expiryDate);
      return d >= today && d <= in30;
    }).length;
    return [
      { id: 1, title: 'Total SKUs', value: String(totalSKUs), subtitle: 'Items tracked', icon: 'total', type: 'info' },
      { id: 2, title: 'Low Stock', value: String(lowStock), subtitle: 'Requires reorder', icon: 'low', type: 'warning' },
      { id: 3, title: 'Out of Stock', value: String(outOfStock), subtitle: 'Urgent action needed', icon: 'out', type: 'danger' },
      { id: 4, title: 'Expiring Soon', value: String(expiringSoon), subtitle: 'Within 30 days', icon: 'expiring', type: 'purple' },
    ];
  },
  async getAlerts() {
    await this.delay(100);
    return stockAlerts;
  },
  async getRecentMovements() {
    await this.delay(100);
    const parsed = safeParseStorage(MOVEMENTS_STORAGE_KEY);
    if (parsed) return parsed;
    localStorage.setItem(MOVEMENTS_STORAGE_KEY, JSON.stringify(recentMovements));
    return recentMovements;
  },
  async getStockByCategory() {
    await this.delay(100);
    const items = this.getStockItemsSync();
    const categoryNames = ['Medicine', 'Equipment', 'Consumable', 'Surgical', 'Other'];
    return categoryNames.map((name, idx) => {
      const group = items.filter(i => (i.category || 'Other') === name);
      const lowCount = group.filter(i => i.status === 'low-stock' || i.status === 'out-of-stock').length;
      const status = lowCount > 0 ? `${lowCount} low stock` : 'All stocked';
      const statusType = lowCount > 0 ? (lowCount >= group.length ? 'danger' : 'warning') : 'success';
      return { id: idx + 1, name, count: group.length, status, statusType };
    });
  }
};
