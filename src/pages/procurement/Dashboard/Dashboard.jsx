import { useState, useEffect } from 'react';
import PageTitle from '../../../components/common/PageTitle/PageTitle';
import Button from '../../../components/common/Button/Button';
import DataTable from '../../../components/common/DataTable/DataTable';
import { RiAddLine, RiFileList2Line, RiTimeLine, RiTruckLine, RiMoneyDollarCircleLine, RiStarFill } from 'react-icons/ri';
import CreatePurchaseOrderModal from '../../../components/procurement/CreatePurchaseOrderModal/CreatePurchaseOrderModal';
import { procurementService } from '../../../services/procurementService';
import { useToast } from '../../../context/ToastContext';
import './Dashboard.css';
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
        return (
          <button 
            type="button" 
            className="btn-action-primary" 
            onClick={() => addToast("Purchase Order Approved Successfully", "success")}>
            Approve
          </button>
        );
      case 'approved':
        return (
          <button 
            type="button" 
            className="btn-action-success" 
            onClick={() => addToast("GRN Processed Successfully", "success")}>
            Process GRN
          </button>
        );
      case 'delivered':
        return <button type="button" className="btn-action-secondary">View GRN</button>;
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
  useEffect(() => {
    // eslint-disable-next-line 
    loadPurchaseOrders();
  }, []);
  const suppliers = [
    { name: "PharmaCorp Inc.", price: "₹2.5", delivery: "5-7 days", rating: 4.8 },
    { name: "MediSupply Ltd.", price: "₹2.35", delivery: "7-10 days", rating: 4.6 },
    { name: "HealthCare Dist.", price: "₹2.75", delivery: "3-5 days", rating: 4.9 }
  ];
  return (
    <div className="procurement-dashboard-page">
      <PageTitle 
        title="Procurement Management" 
        subtitle="Purchase orders, supplier management & GRN processing"
        rightContent={
          <Button 
            variant="primary" 
            className="procurement-header-btn" 
            onClick={() => setIsPOModalOpen(true)}>
            <RiAddLine size={18} /> Create Purchase Order
          </Button>
        }/>
      <div className="procurement-dashboard-content">
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
            <div className="procurement-stat-value">
              {purchaseOrders.filter(po => po.status === 'pending').length}
            </div>
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
        <div className="procurement-orders-container">
          <h3 className="procurement-section-title">Purchase Orders</h3>
          {loading ? (
            <div className="procurement-loading-state">Loading purchase orders...</div>
          ) : (
            <DataTable 
              columns={columns} 
              data={purchaseOrders}
              keyField="id" 
              itemsPerPage={10} />
          )}
        </div>
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
            <button type="button" className="btn-compare">Compare Suppliers</button>
          </div>
          <div className="supplier-cards-row">
            {suppliers.map((supplier, index) => (
              <div key={index} className="supplier-card">
                <div>
                  <div className="supplier-card-title">{supplier.name}</div>
                  <div className="supplier-data-row">
                    <span className="supplier-data-label">Unit Price:</span>
                    <span className="supplier-data-value">{supplier.price}</span>
                  </div>
                  <div className="supplier-data-row">
                    <span className="supplier-data-label">Delivery:</span>
                    <span className="supplier-data-value">{supplier.delivery}</span>
                  </div>
                  <div className="supplier-data-row">
                    <span className="supplier-data-label">Rating:</span>
                    <div className="supplier-data-value-rating">
                      <RiStarFill size={14} />
                      <span>{supplier.rating}</span>
                    </div>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn-select-supplier" 
                  onClick={() => addToast("Supplier Selected Successfully", "success")}>
                  Select Supplier
                </button>
              </div>
            ))}
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
