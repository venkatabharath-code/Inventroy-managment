import React, { useState } from 'react';
import PageTitle from '../../../components/common/PageTitle/PageTitle';
import Button from '../../../components/common/Button/Button';
import DataTable from '../../../components/common/DataTable/DataTable';
import { RiAddLine, RiFileList2Line, RiTimeLine, RiTruckLine, RiMoneyDollarCircleLine, RiStarFill } from 'react-icons/ri';
import CreatePurchaseOrderModal from '../../../components/procurement/CreatePurchaseOrderModal/CreatePurchaseOrderModal';
import './Dashboard.css';

import { procurementService } from '../../../services/procurementService';
import { useToast } from '../../../context/ToastContext';

const getStatusBadge = (status) => {
  switch (status) {
    case 'pending':
      return <span className="po-badge po-badge-pending">pending</span>;
    case 'approved':
      return <span className="po-badge po-badge-approved">approved</span>;
    case 'delivered':
      return <span className="po-badge po-badge-delivered">delivered</span>;
    default:
      return null;
  }
};



const Dashboard = () => {
  const { addToast } = useToast();
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getActionButton = (status) => {
    switch (status) {
      case 'pending':
        return <button className="btn-action-primary" onClick={() => addToast("Purchase Order Approved Successfully", "success")}>Approve</button>;
      case 'approved':
        return <button className="btn-action-success" onClick={() => addToast("GRN Processed Successfully", "success")}>Process GRN</button>;
      case 'delivered':
        return <button className="btn-action-secondary">View GRN</button>;
      default:
        return null;
    }
  };

  const columns = [
    { 
      header: 'PO Number', 
      field: 'id',
      render: (value) => <span className="po-number-cell">{value}</span>
    },
    { 
      header: 'Supplier', 
      field: 'supplier',
      render: (value) => <span className="po-supplier-cell">{value}</span>
    },
    { header: 'Items', field: 'items' },
    { header: 'Amount', field: 'amount' },
    { header: 'Order Date', field: 'orderDate' },
    { header: 'Expected Delivery', field: 'expectedDelivery' },
    { 
      header: 'Status', 
      field: 'status',
      render: (value) => getStatusBadge(value)
    },
    { 
      header: 'Actions', 
      field: 'status',
      render: (value) => getActionButton(value)
    }
  ];

  const loadPurchaseOrders = async () => {
    setLoading(true);
    try {
      const data = await procurementService.getPurchaseOrders();
      setPurchaseOrders(data || []);
    } catch (error) {
      console.error('Failed to load purchase orders:', error);
      setPurchaseOrders([]);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPurchaseOrders();
  }, []);

  return (
    <div className="procurement-dashboard-page">
      <PageTitle 
        title="Procurement Management" 
        subtitle="Purchase orders, supplier management & GRN processing"
        rightContent={
          <Button variant="primary" className="procurement-header-btn" onClick={() => setIsPOModalOpen(true)}>
            <RiAddLine size={18} /> Create Purchase Order
          </Button>
        }
      />
      
      <div className="procurement-dashboard-content">
        
        {/* Statistics Cards Section */}
        <div className="procurement-stats-container">
          <div className="procurement-stat-card">
            <div className="procurement-stat-header">
              <RiFileList2Line size={18} /> Total POs
            </div>
            <div className="procurement-stat-value">{purchaseOrders.length}</div>
            <div className="procurement-stat-footer">This month</div>
          </div>
          
          <div className="procurement-stat-card">
            <div className="procurement-stat-header stat-icon-warning">
              <RiTimeLine size={18} /> Pending Approval
            </div>
            <div className="procurement-stat-value">{purchaseOrders.filter(po => po.status === 'pending').length}</div>
            <div className="procurement-stat-footer text-warning">Requires action</div>
          </div>
          
          <div className="procurement-stat-card">
            <div className="procurement-stat-header">
              <RiTruckLine size={18} /> In Transit
            </div>
            <div className="procurement-stat-value">1</div>
            <div className="procurement-stat-footer text-info">Expected soon</div>
          </div>
          
          <div className="procurement-stat-card">
            <div className="procurement-stat-header stat-icon-success">
              <RiMoneyDollarCircleLine size={18} /> Total Value
            </div>
            <div className="procurement-stat-value">₹446K</div>
            <div className="procurement-stat-footer">This month</div>
          </div>
        </div>

        {/* Purchase Orders Section */}
        <div className="procurement-orders-container">
          <h3 className="procurement-section-title">Purchase Orders</h3>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#45556C' }}>Loading purchase orders...</div>
          ) : (
            <DataTable 
              columns={columns} 
              data={purchaseOrders}
              keyField="id" 
              itemsPerPage={10} 
            />
          )}
        </div>

        {/* Supplier Comparison Tool */}
        <div className="procurement-supplier-comparison-container">
          <h3 className="procurement-section-title">Supplier Comparison Tool</h3>
          
          <div className="comparison-inputs-row">
            <div className="comparison-input-group">
              <label>Select Item</label>
              <input type="text" placeholder="" />
            </div>
            <div className="comparison-input-group">
              <label>Required Quantity</label>
              <input type="text" defaultValue="1000" />
            </div>
            <button className="btn-compare">Compare Suppliers</button>
          </div>
          
          <div className="supplier-cards-row">
            {/* PharmaCorp Card */}
            <div className="supplier-card">
              <div>
                <div className="supplier-card-title">PharmaCorp Inc.</div>
                <div className="supplier-data-row">
                  <span className="supplier-data-label">Unit Price:</span>
                  <span className="supplier-data-value">₹2.5</span>
                </div>
                <div className="supplier-data-row">
                  <span className="supplier-data-label">Delivery:</span>
                  <span className="supplier-data-value">5-7 days</span>
                </div>
                <div className="supplier-data-row">
                  <span className="supplier-data-label">Rating:</span>
                  <div className="supplier-data-value-rating">
                    <RiStarFill size={14} />
                    <span>4.8</span>
                  </div>
                </div>
              </div>
              <button className="btn-select-supplier" onClick={() => addToast("Supplier Selected Successfully", "success")}>Select Supplier</button>
            </div>

            {/* MediSupply Card */}
            <div className="supplier-card" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <div className="supplier-card-title">MediSupply Ltd.</div>
                <div className="supplier-data-row">
                  <span className="supplier-data-label">Unit Price:</span>
                  <span className="supplier-data-value">₹2.35</span>
                </div>
                <div className="supplier-data-row">
                  <span className="supplier-data-label">Delivery:</span>
                  <span className="supplier-data-value">7-10 days</span>
                </div>
                <div className="supplier-data-row">
                  <span className="supplier-data-label">Rating:</span>
                  <div className="supplier-data-value-rating">
                    <RiStarFill size={14} />
                    <span>4.6</span>
                  </div>
                </div>
              </div>
              <button className="btn-select-supplier" onClick={() => addToast("Supplier Selected Successfully", "success")}>Select Supplier</button>
            </div>

            {/* HealthCare Dist Card */}
            <div className="supplier-card" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <div className="supplier-card-title">HealthCare Dist.</div>
                <div className="supplier-data-row">
                  <span className="supplier-data-label">Unit Price:</span>
                  <span className="supplier-data-value">₹2.75</span>
                </div>
                <div className="supplier-data-row">
                  <span className="supplier-data-label">Delivery:</span>
                  <span className="supplier-data-value">3-5 days</span>
                </div>
                <div className="supplier-data-row">
                  <span className="supplier-data-label">Rating:</span>
                  <div className="supplier-data-value-rating">
                    <RiStarFill size={14} />
                    <span>4.9</span>
                  </div>
                </div>
              </div>
              <button className="btn-select-supplier" onClick={() => addToast("Supplier Selected Successfully", "success")}>Select Supplier</button>
            </div>
            
          </div>
        </div>

      </div>
      
      <CreatePurchaseOrderModal 
        isOpen={isPOModalOpen} 
        onClose={() => setIsPOModalOpen(false)} 
        onSuccess={() => {
          loadPurchaseOrders();
        }}
      />

    </div>
  );
};

export default Dashboard;
