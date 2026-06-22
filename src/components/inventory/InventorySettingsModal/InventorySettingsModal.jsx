import React, { useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { settingsService } from '../../../services/settingsService';
import { useToast } from '../../../context/ToastContext';
import './InventorySettingsModal.css';
const InventorySettingsModal = ({ isOpen, onClose, onSuccess }) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    lowStockEmailAlerts: true,
    expiryAlerts: true,
    autoGeneratePO: false,
    defaultStockUnit: 'Pieces',
    lowStockThreshold: '20',
    poApprovalRequiredAbove: '50000',
    stockAdjustmentApproval: 'Role Based'
  });
  const [categories, setCategories] = useState([
    'Medicine', 'Equipment', 'Consumable', 'Surgical', 'Other'
  ]);
  const [newCategory, setNewCategory] = useState('');
  const loadSettings = async () => {
    try {
      const settings = await settingsService.getSettings();
      setFormData(prev => ({ ...prev, ...(settings || {}) }));
      if (settings && settings.categories) {
        setCategories(settings.categories);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };
  React.useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line 
      loadSettings();
    }
  }, [isOpen]);
  if (!isOpen) return null;
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };
  const handleRemoveCategory = (categoryToRemove) => {
    setCategories(categories.filter(cat => cat !== categoryToRemove));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        categories
      };
      await settingsService.saveSettings(payload);
      addToast('Settings Saved Successfully', 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };
  return (
    <div className="settings-overlay" onClick={onClose}>
      <form className="settings-modal" onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>    
        {/* Header */}
        <div className="settings-header">
          <h2>Inventory Settings</h2>
          <button type="button" className="settings-close" onClick={onClose} aria-label="Close settings">
            <RiCloseLine />
          </button>
        </div>
        {/* Body */}
        <div className="settings-body">
          {/* Section 1: Reorder Alert Settings */}
          <div className="settings-section">
            <h3 className="settings-section-title">Reorder Alert Settings</h3>
            <div className="alert-cards-container">
              <div className="settings-alert-card">
                <div className="settings-alert-card-info">
                  <span className="settings-alert-card-title">Low Stock Email Alerts</span>
                  <span className="settings-alert-card-desc">Send email when items reach minimum stock level</span>
                </div>
              </div>
              <div className="settings-alert-card">
                <div className="settings-alert-card-info">
                  <span className="settings-alert-card-title">Expiry Alerts</span>
                  <span className="settings-alert-card-desc">Alert when items are within 30 days of expiry</span>
                </div>
              </div>
              <div className="settings-alert-card">
                <div className="settings-alert-card-info">
                  <span className="settings-alert-card-title">Auto-generate PO Suggestions</span>
                  <span className="settings-alert-card-desc">Automatically suggest purchase orders for low stock items</span>
                </div>
              </div>
            </div>
          </div>
          {/* Section 2: Default Units & Categories */}
          <div className="settings-section">
            <h3 className="settings-section-title">Default Units & Categories</h3>
            <div className="settings-form-row">
              <div className="settings-form-field">
                <label className="settings-form-label">Default Stock Unit</label>
                <input 
                  type="text" 
                  name="defaultStockUnit"
                  value={formData.defaultStockUnit}
                  onChange={handleInputChange}
                  className="settings-input" />
              </div>
              <div className="settings-form-field">
                <label className="settings-form-label">Low Stock Threshold (%)</label>
                <input 
                  type="number" 
                  name="lowStockThreshold"
                  value={formData.lowStockThreshold}
                  onChange={handleInputChange}
                  className="settings-input" />
              </div>
            </div>
            <div className="settings-form-field full-width" style={{ height: 'auto', marginTop: '16px' }}>
              <label className="settings-form-label">Manage Categories</label>
              <div className="manage-categories-input-group">
                <input 
                  type="text" 
                  className="settings-input" 
                  placeholder="New category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCategory();
                    }
                  }}/>
                <button type="button" className="btn-add-category" onClick={handleAddCategory}>+ Add</button>
              </div>
              <div className="category-chips">
                {categories.map(cat => (
                  <span key={cat} className="category-chip">
                    {cat}
                    <button type="button" className="category-chip-close" onClick={() => handleRemoveCategory(cat)}>
                      <RiCloseLine />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* Section 3: Approval Workflows */}
          <div className="settings-section">
            <h3 className="settings-section-title">Approval Workflows</h3>
            <div className="settings-form-row">
              <div className="settings-form-field">
                <label className="settings-form-label">PO Approval Required Above</label>
                <input 
                  type="number" 
                  name="poApprovalRequiredAbove"
                  value={formData.poApprovalRequiredAbove}
                  onChange={handleInputChange}
                  className="settings-input" />
              </div>
              <div className="settings-form-field">
                <label className="settings-form-label">Stock Adjustment Approval</label>
                <input 
                  type="text" 
                  name="stockAdjustmentApproval"
                  value={formData.stockAdjustmentApproval}
                  onChange={handleInputChange}
                  className="settings-input" />
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="settings-footer">
          <div className="settings-footer-container">
            <button type="submit" className="btn-settings-submit">Save Settings</button>
            <button type="button" className="btn-settings-cancel" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default InventorySettingsModal;
