const SETTINGS_STORAGE_KEY = 'inventory_settings';
const initialSettings = {
  lowStockThreshold: 10,
  autoReorder: false,
  notificationEmail: 'admin@hospital.com',
  currency: 'INR'
};
function safeParseStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    console.warn(`[settingsService] localStorage corruption detected for key "${key}". Resetting.`);
    localStorage.removeItem(key);
    return null;
  }
}
export const settingsService = {
  async delay(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  async getSettings() {
    await this.delay();
    const parsed = safeParseStorage(SETTINGS_STORAGE_KEY);
    if (parsed) return parsed;
    return initialSettings;
  },
  async saveSettings(settings) {
    await this.delay();
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    return settings;
  }
};
