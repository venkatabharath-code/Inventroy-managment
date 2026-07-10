import { initialPurchaseOrders } from '../data/inventory/procurement/procurement.data';
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
