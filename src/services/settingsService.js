const SETTINGS_STORAGE_KEY = 'inventory_settings';

const initialSettings = {
  lowStockThreshold: 10,
  autoReorder: false,
  notificationEmail: 'admin@hospital.com',
  currency: 'INR'
};

export const settingsService = {
  async delay(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  async getSettings() {
    await this.delay();
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('localStorage corruption detected for settings. Resetting to default.', error);
      }
    }
    return initialSettings;
  },

  async saveSettings(settings) {
    await this.delay();
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    return settings;
  }
};
