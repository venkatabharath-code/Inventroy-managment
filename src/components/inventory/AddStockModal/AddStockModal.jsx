import { useState, useEffect } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { inventoryService } from '../../../services/inventoryService';
import { useToast } from '../../../context/ToastContext';
import './AddStockModal.css';
const initialFormData = {
  itemName: '',
  category: '',
  sku: 'SKU-1001', // auto-generated
  batchNumber: '',
  expiryDate: '',
  initialQuantity: '',
  unit: '',
  minStock: '',
  maxStock: '',
  storageLocation: '',
  shelfBin: ''
};
const AddStockModal = ({ isOpen, onClose, onSuccess }) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const validate = () => {
    const errors = {};
    if (!formData.itemName.trim()) errors.itemName = 'Item name is required.';
    if (!formData.category)        errors.category = 'Category is required.';
    const qty = Number(formData.initialQuantity);
    if (!formData.initialQuantity)          errors.initialQuantity = 'Initial quantity is required.';
    else if (isNaN(qty) || qty <= 0)        errors.initialQuantity = 'Quantity must be greater than 0.';
    if (!formData.unit) errors.unit = 'Unit is required.';
    const min = Number(formData.minStock);
    if (!formData.minStock)         errors.minStock = 'Minimum stock level is required.';
    else if (isNaN(min) || min < 0) errors.minStock = 'Minimum stock must be 0 or greater.';
    if (!formData.storageLocation) errors.storageLocation = 'Storage location is required.';
    return errors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    setIsSubmitting(true);
    try {
      await inventoryService.addStockItem({
        name: formData.itemName,
        sku: formData.sku,
        category: formData.category,
        currentStock: `${formData.initialQuantity} ${formData.unit || 'units'}`,
        minStock: `${formData.minStock} ${formData.unit || 'units'}`,
        expiryDate: formData.expiryDate || 'N/A',
        location: `${formData.storageLocation}${formData.shelfBin ? ' - ' + formData.shelfBin : ''}`
      });
      setFormData(initialFormData);
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Failed to add stock:', error);
      addToast('Failed to Add Stock', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="add-stock-overlay" onClick={onClose}>
      <form
        className="add-stock-modal"
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}>
        {/* Header */}
        <div className="add-stock-header">
          <h2>Add New Stock Item</h2>
          {/* type=button prevents accidental submit on close */}
          <button
            type="button"
            className="add-stock-close"
            onClick={onClose}
            aria-label="Close modal"
            data-testid="add-stock-close">
            <RiCloseLine />
          </button>
        </div>
        {/* Body */}
        <div className="add-stock-body">
          {/* Section 1: Item Information */}
          <div className="add-stock-section">
            <h3 className="section-title">Item Information</h3>
            <div className="form-row">
              <div className="form-field full-width">
                <label className="form-label">Item Name *</label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter item name"
                  required/>
              </div>
            </div>
            <div className="form-row">
              <div className="form-field half-width">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-input"
                  required>
                  <option value="" disabled>Select category</option>
                  <option value="Medical Supplies">Medical Supplies</option>
                  <option value="Pharmaceuticals">Pharmaceuticals</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Laboratory Items">Laboratory Items</option>
                </select>
              </div>
              <div className="form-field half-width">
                <label className="form-label">SKU / Item Code</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  className="form-input"
                  disabled/>
              </div>
            </div>
          </div>
          {/* Section 2: Stock Details */}
          <div className="add-stock-section">
            <h3 className="section-title">Stock Details</h3>
            <div className="form-row">
              <div className="form-field half-width">
                <label className="form-label">Batch Number</label>
                <input
                  type="text"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter batch number"/>
              </div>
              <div className="form-field half-width">
                <label className="form-label">Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="form-input"/>
              </div>
            </div>
            <div className="form-row">
              <div className="form-field half-width">
                <label className="form-label">Initial Quantity *</label>
                <input
                  type="number"
                  name="initialQuantity"
                  value={formData.initialQuantity}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="0"
                  required/>
              </div>
              <div className="form-field half-width">
                <label className="form-label">Unit *</label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="form-input"
                  required>
                  <option value="" disabled>Select unit</option>
                  <option value="Pieces">Pieces</option>
                  <option value="Boxes">Boxes</option>
                  <option value="Bottles">Bottles</option>
                  <option value="Packs">Packs</option>
                  <option value="Kg">Kg</option>
                  <option value="Liters">Liters</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-field half-width">
                <label className="form-label">Minimum Stock Level *</label>
                <input
                  type="number"
                  name="minStock"
                  value={formData.minStock}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Reorder threshold"
                  required/>
              </div>
              <div className="form-field half-width">
                <label className="form-label">Maximum Stock Level</label>
                <input
                  type="number"
                  name="maxStock"
                  value={formData.maxStock}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Optional"/>
              </div>
            </div>
          </div>
          {/* Section 3: Location & Storage */}
          <div className="add-stock-section">
            <h3 className="section-title">Location &amp; Storage</h3>
            <div className="form-row">
              <div className="form-field half-width">
                <label className="form-label">Storage Location *</label>
                <select
                  name="storageLocation"
                  value={formData.storageLocation}
                  onChange={handleInputChange}
                  className="form-input"
                  required>
                  <option value="" disabled>Select location</option>
                  <option value="Main Warehouse">Main Warehouse</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Cold Storage">Cold Storage</option>
                  <option value="Ward Supply">Ward Supply</option>
                </select>
              </div>
              <div className="form-field half-width">
                <label className="form-label">Shelf / Bin Location</label>
                <input
                  type="text"
                  name="shelfBin"
                  value={formData.shelfBin}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., Shelf A3"/>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="add-stock-footer">
          <div className="footer-container">
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Stock Item'}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default AddStockModal;
