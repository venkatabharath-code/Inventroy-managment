import { useState, useEffect } from 'react';
import { RiCloseLine, RiSaveLine } from 'react-icons/ri';
import { assetService } from '../../../services/assetService';
import { useToast } from '../../../context/ToastContext';
import './RegisterAssetModal.css';
const initialFormData = {
  name: '',
  category: '',
  location: '',
  value: '',
  purchased: '',
  warrantyExpires: '',
  lastMaintenance: '',
  serialNumber: '',
  manufacturer: '',
  modelNumber: '',
  supplier: '',
  amc: '',
  maintenanceFrequency: ''
};
const RegisterAssetModal = ({ isOpen, onClose, onSuccess }) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!formData.name || !formData.category || !formData.location || !formData.value || !formData.purchased) {
      addToast('Please fill all required fields.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      await assetService.registerAsset({
        name: formData.name,
        category: formData.category,
        location: formData.location,
        value: formData.value,
        purchased: formData.purchased,
        warrantyExpires: formData.warrantyExpires || 'N/A',
        lastMaintenance: formData.lastMaintenance || 'N/A',
        serialNumber: formData.serialNumber || 'N/A',
        manufacturer: formData.manufacturer || 'N/A',
        modelNumber: formData.modelNumber || 'N/A',
        supplier: formData.supplier || 'N/A',
        amc: formData.amc || 'N/A',
        maintenanceFrequency: formData.maintenanceFrequency || 'N/A'
      });
      setFormData(initialFormData);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      addToast('Failed to register asset', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="ra-modal-overlay" onClick={onClose}>
      <form
        className="ra-modal-container"
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}>
        {/* Modal Header */}
        <div className="ra-modal-header">
          <h2 className="ra-modal-title">Register New Asset</h2>
          {/* type=button prevents accidental form submit on close */}
          <button
            type="button"
            className="ra-modal-close"
            onClick={onClose}
            aria-label="Close modal"
            data-testid="ra-modal-close">
            <RiCloseLine size={24} />
          </button>
        </div>
        {/* Modal Body */}
        <div className="ra-modal-body">
          {/* Asset Information */}
          <div className="ra-section">
            <h3 className="ra-section-title">Asset Information</h3>
            <div className="ra-form-row">
              <div className="ra-input-group ra-full-width">
                <label>Equipment Name <span className="ra-required">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., MRI Machine - Siemens 3T"
                  required/>
              </div>
            </div>
            <div className="ra-form-row">
              <div className="ra-input-group ra-half-width">
                <label>Asset Type <span className="ra-required">*</span></label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required/>
              </div>
              <div className="ra-input-group ra-half-width">
                <label htmlFor="ra-serial">Serial Number <span className="ra-required">*</span></label>
                <input
                  id="ra-serial"
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                  placeholder="Enter serial number"
                  required
                  data-testid="ra-serial"/>
              </div>
            </div>
            <div className="ra-form-row">
              <div className="ra-input-group ra-half-width">
                <label htmlFor="ra-manufacturer">Manufacturer</label>
                <input
                  id="ra-manufacturer"
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  placeholder="Equipment manufacturer"
                  data-testid="ra-manufacturer"/>
              </div>
              <div className="ra-input-group ra-half-width">
                <label htmlFor="ra-model">Model Number</label>
                <input
                  id="ra-model"
                  type="text"
                  name="modelNumber"
                  value={formData.modelNumber}
                  onChange={handleInputChange}
                  placeholder="Model/version"
                  data-testid="ra-model"/>
              </div>
            </div>
          </div>
          {/* Location & Value */}
          <div className="ra-section">
            <h3 className="ra-section-title">Location &amp; Value</h3>
            <div className="ra-form-row">
              <div className="ra-input-group ra-half-width">
                <label>Department/Location <span className="ra-required">*</span></label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required/>
              </div>
              <div className="ra-input-group ra-half-width">
                <label>Asset Value (₹) <span className="ra-required">*</span></label>
                <input
                  type="text"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  placeholder="Purchase price"
                  required/>
              </div>
            </div>
            <div className="ra-form-row">
              <div className="ra-input-group ra-half-width">
                <label>Purchase Date <span className="ra-required">*</span></label>
                <input
                  type="date"
                  name="purchased"
                  value={formData.purchased}
                  onChange={handleInputChange}
                  required/>
              </div>
              <div className="ra-input-group ra-half-width">
                <label htmlFor="ra-supplier">Supplier/Vendor</label>
                <input
                  id="ra-supplier"
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  placeholder="Supplier name"
                  data-testid="ra-supplier"/>
              </div>
            </div>
          </div>
          {/* Warranty & Maintenance */}
          <div className="ra-section ra-section-last">
            <h3 className="ra-section-title">Warranty &amp; Maintenance</h3>
            <div className="ra-form-row">
              <div className="ra-input-group ra-half-width">
                <label>Warranty Expiry Date</label>
                <input
                  type="date"
                  name="warrantyExpires"
                  value={formData.warrantyExpires}
                  onChange={handleInputChange}/>
              </div>
              <div className="ra-input-group ra-half-width">
                <label htmlFor="ra-amc">AMC (Annual Maintenance Contract)</label>
                <input
                  id="ra-amc"
                  type="text"
                  name="amc"
                  value={formData.amc}
                  onChange={handleInputChange}
                  data-testid="ra-amc"/>
              </div>
            </div>
            <div className="ra-form-row">
              <div className="ra-input-group ra-half-width">
                <label htmlFor="ra-maint-freq">Maintenance Frequency</label>
                <input
                  id="ra-maint-freq"
                  type="text"
                  name="maintenanceFrequency"
                  value={formData.maintenanceFrequency}
                  onChange={handleInputChange}
                  data-testid="ra-maint-freq"/>
              </div>
              <div className="ra-input-group ra-half-width">
                <label>Last Maintenance Date</label>
                <input
                  type="date"
                  name="lastMaintenance"
                  value={formData.lastMaintenance}
                  onChange={handleInputChange}/>
              </div>
            </div>
          </div>
        </div>
        {/* Modal Footer */}
        <div className="ra-modal-footer">
          <button type="submit" className="ra-btn-submit" disabled={isSubmitting}>
            <RiSaveLine size={16} />
            {isSubmitting ? 'Registering...' : 'Register Asset'}
          </button>
          <button type="button" className="ra-btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
export default RegisterAssetModal;
