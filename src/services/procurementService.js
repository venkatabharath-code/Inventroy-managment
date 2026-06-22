const initialPurchaseOrders = [
  {
    id: 'PO-2026-001',
    supplier: 'PharmaCorp Inc.',
    items: '5 items',
    amount: '₹1,25,000',
    orderDate: '2026-01-03',
    expectedDelivery: '2026-01-08',
    status: 'pending',
  },
  {
    id: 'PO-2026-002',
    supplier: 'MediSupply Ltd.',
    items: '3 items',
    amount: '₹87,000',
    orderDate: '2026-01-02',
    expectedDelivery: '2026-01-06',
    status: 'approved',
  },
  {
    id: 'PO-2025-087',
    supplier: 'SurgiPro',
    items: '8 items',
    amount: '₹2,34,000',
    orderDate: '2025-12-28',
    expectedDelivery: '2026-01-02',
    status: 'delivered',
  }
];
const PO_STORAGE_KEY = 'procurement_orders';
function safeParseStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    console.warn(`[procurementService] localStorage corruption for key "${key}". Resetting.`);
    localStorage.removeItem(key);
    return null;
  }
}
export const procurementService = {
  async delay(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  async getPurchaseOrders() {
    await this.delay();
    const parsed = safeParseStorage(PO_STORAGE_KEY);
    if (parsed) return parsed;
    localStorage.setItem(PO_STORAGE_KEY, JSON.stringify(initialPurchaseOrders));
    return initialPurchaseOrders;
  },
  async createPurchaseOrder(po) {
    await this.delay();
    const orders = await this.getPurchaseOrders();
    // Guarantee uniqueness 
    const year = new Date().getFullYear();
    const suffix = String(Date.now()).slice(-5);
    const nextId = `PO-${year}-${suffix}`;
    const newOrder = {
      ...po,
      id: nextId,
      status: 'pending'
    };
    const updatedOrders = [newOrder, ...orders];
    localStorage.setItem(PO_STORAGE_KEY, JSON.stringify(updatedOrders));
    return newOrder;
  }
};
