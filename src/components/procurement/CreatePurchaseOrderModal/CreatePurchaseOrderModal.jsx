import { useState, useEffect } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { procurementService } from '../../../services/procurementService';
import { useToast } from '../../../context/ToastContext';
import './CreatePurchaseOrderModal.css';
const initialFormData = {
  supplier: '',
  expectedDeliveryDate: '',
  paymentTerms: ''
};
const initialOrderItems = [
  { id: 1, item: '', qty: 1000, unit: 'Tablets', rate: 2.50, amount: 2500 }
];
const formatCurrency = (val) =>
  `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
const CreatePurchaseOrderModal = ({ isOpen, onClose, onSuccess }) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState(initialFormData);
  const [orderItems, setOrderItems] = useState(initialOrderItems);
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
  const handleItemChange = (id, field, value) => {
    setOrderItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      // Recalculate amount when qty or rate changes
      if (field === 'qty' || field === 'rate') {
        updated.amount = (Number(updated.qty) || 0) * (Number(updated.rate) || 0);
      }
      return updated;
    }));
  };
  const handleAddItem = () => {
    setOrderItems(prev => [
      ...prev,
      { id: Date.now(), item: '', qty: 1, unit: '', rate: 0, amount: 0 }
    ]);
  };
  const handleRemoveItem = (id) => {
    setOrderItems(prev => prev.filter(item => item.id !== id));
  };
  const subtotal = orderItems.reduce((sum, item) => sum + item.amount, 0);
  const gst = subtotal * 0.18;
  const totalAmount = subtotal + gst;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    const validItems = orderItems.filter(i => i.item && i.item.trim() !== '');
    if (!formData.supplier) {
      addToast('Please select a supplier.', 'error');
      return;
    }
    if (validItems.length === 0) {
      addToast('Please add at least one order item before submitting.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      await procurementService.createPurchaseOrder({
        supplier: formData.supplier,
        orderDate: new Date().toISOString().split('T')[0],
        expectedDelivery: formData.expectedDeliveryDate,
        items: `${validItems.length} items`,
        amount: formatCurrency(totalAmount)
      });
      addToast('Purchase Order Created Successfully', 'success');
      setFormData(initialFormData);
      setOrderItems(initialOrderItems);
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Failed to create PO:', error);
      addToast('Failed to create Purchase Order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="cpo-overlay" onClick={onClose}>
      <form
        className="cpo-modal"
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}>
        {/* Header */}
        <div className="cpo-header">
          <h2>Create Purchase Order</h2>
          <button
            type="button"
            className="cpo-close"
            onClick={onClose}
            aria-label="Close modal"
            data-testid="cpo-close">
            <RiCloseLine />
          </button>
        </div>
        {/* Body */}
        <div className="cpo-body">
          {/* Section 1: Supplier Information */}
          <div className="cpo-section">
            <h3 className="section-title">Supplier Information</h3>
            <div className="cpo-form-row">
              <div className="cpo-form-field cpo-field-840">
                <label className="cpo-label">Select Supplier *</label>
                <select
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  className="cpo-input"
                  required>
                  <option value="" disabled></option>
                  <option value="PharmaCorp Inc.">PharmaCorp Inc.</option>
                  <option value="MediSupply Ltd.">MediSupply Ltd.</option>
                  <option value="HealthCare Dist.">HealthCare Dist.</option>
                </select>
              </div>
            </div>
            <div className="cpo-form-row">
              <div className="cpo-form-field cpo-field-412">
                <label className="cpo-label">Expected Delivery Date *</label>
                <input
                  type="date"
                  name="expectedDeliveryDate"
                  value={formData.expectedDeliveryDate}
                  onChange={handleInputChange}
                  className="cpo-input"
                  required/>
              </div>
              <div className="cpo-form-field cpo-field-412">
                <label className="cpo-label">Payment Terms</label>
                <input
                  type="text"
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleInputChange}
                  className="cpo-input"/>
              </div>
            </div>
          </div>
          {/* Section 2: Order Items */}
          <div className="cpo-section cpo-items-section">
            <div className="cpo-items-header">
              <h3 className="section-title">Order Items</h3>
              <button type="button" className="btn-add-item" onClick={handleAddItem}>
                + Add Item
              </button>
            </div>
            <div className="cpo-table-container">
              <table className="cpo-table">
                <thead>
                  <tr>
                    <th className="col-item">Item</th>
                    <th className="col-qty">Qty</th>
                    <th className="col-unit">Unit</th>
                    <th className="col-rate">Rate (₹)</th>
                    <th className="col-amount">Amount</th>
                    <th className="col-action"></th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item.id}>
                      <td className="col-item">
                        <input
                          type="text"
                          className="cpo-table-input"
                          value={item.item}
                          onChange={(e) => handleItemChange(item.id, 'item', e.target.value)}/>
                      </td>
                      <td className="col-qty">
                        <input
                          type="number"
                          className="cpo-table-input"
                          value={item.qty}
                          onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}/>
                      </td>
                      <td className="col-unit">
                        <input
                          type="text"
                          className="cpo-table-input"
                          value={item.unit}
                          onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                          placeholder="Tablets"/>
                      </td>
                      <td className="col-rate">
                        <input
                          type="number"
                          step="0.01"
                          className="cpo-table-input"
                          value={item.rate}
                          onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}/>
                      </td>
                      <td className="col-amount">{formatCurrency(item.amount)}</td>
                      <td className="col-action">
                        <button
                          type="button"
                          className="btn-remove-item"
                          onClick={() => handleRemoveItem(item.id)}>
                          <span className="remove-cross">×</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Section 3: Totals */}
          <div className="cpo-totals-section">
            <div className="cpo-totals-content">
              <div className="cpo-totals-row">
                <span className="cpo-totals-label">Subtotal:</span>
                <span className="cpo-totals-value">{formatCurrency(subtotal)}</span>
              </div>
              <div className="cpo-totals-row">
                <span className="cpo-totals-label">GST (18%):</span>
                <span className="cpo-totals-value">{formatCurrency(gst)}</span>
              </div>
              <div className="cpo-totals-divider"></div>
              <div className="cpo-totals-row total-final">
                <span className="cpo-totals-label">Total Amount:</span>
                <span className="cpo-totals-value">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="cpo-footer">
          <button type="submit" className="btn-cpo-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Purchase Order'}
          </button>
          <button type="button" className="btn-cpo-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreatePurchaseOrderModal;
