import { initialAssets, initialMaintenance } from '../data/inventory/assets/asset.data';
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
