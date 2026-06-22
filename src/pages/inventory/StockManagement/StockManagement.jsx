import { useState, useEffect, useCallback, useMemo } from 'react';
import PageTitle from '../../../components/common/PageTitle/PageTitle';
import Button from '../../../components/common/Button/Button';
import DataTable from '../../../components/common/DataTable/DataTable';
import { RiSearchLine, RiFileTextLine, RiAddLine } from 'react-icons/ri';
import AddStockModal from '../../../components/inventory/AddStockModal/AddStockModal';
import { inventoryService, initialStockData } from '../../../services/inventoryService';
import { useToast } from '../../../context/ToastContext';
import './StockManagement.css';
const StockManagement = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [items, setItems] = useState(initialStockData);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const loadItems = useCallback(async () => {
    try {
      const data = await inventoryService.getStockItems();
      setItems(data || initialStockData);
    } catch {
      setItems(initialStockData);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    // eslint-disable-next-line
    loadItems();
  }, [loadItems]);
  const allCount = items.length;
  const lowOutCount = items.filter(i => i.status === 'low-stock' || i.status === 'out-of-stock').length;
  const expiringSoonCount = items.filter(i => i.status === 'expiring-soon').length;
  const columns = useMemo(() => [
    {
      header: 'Item Name',
      field: 'name',
      render: (_, row) => (
        <div className="sm-item-name-col">
          <span className="sm-item-name">{row.name}</span>
          <span className="sm-item-sku">SKU: {row.sku}</span>
        </div>
      )
    },
    {
      header: 'Category',
      field: 'category',
      render: (_, row) => (
        <span className="sm-badge-category">{row.category}</span>
      )
    },
    {
      header: 'Current Stock',
      field: 'currentStock',
      render: (_, row) => (
        <span className={row.currentStockClass}>{row.currentStock}</span>
      )
    },
    {
      header: 'Min Stock',
      field: 'minStock',
      render: (_, row) => (
        <span className="text-normal">{row.minStock}</span>
      )
    },
    {
      header: 'Expiry Date',
      field: 'expiryDate',
      render: (_, row) => (
        <span className={row.expiryDateClass}>{row.expiryDate}</span>
      )
    },
    {
      header: 'Location',
      field: 'location',
      render: (_, row) => (
        <span className="text-normal">{row.location}</span>
      )
    },
    {
      header: 'Status',
      field: 'status',
      render: (_, row) => (
        <span className={`sm-badge-status sm-status-${row.status}`}>
          {row.statusLabel}
        </span>
      )
    },
    {
      header: 'Actions',
      field: 'actions',
      render: () => (
        <div className="sm-actions-cell">
          <button 
            type="button" 
            className="btn-sm-adjust" 
            onClick={(e) => {
              e.stopPropagation();
              addToast("Stock Updated Successfully", "success");
            }}>
            Adjust
          </button>
          <button 
            type="button" 
            className="btn-sm-reorder" 
            onClick={(e) => {
              e.stopPropagation();
              addToast("Reorder Request Sent Successfully", "success");
            }}>
            Reorder
          </button>
        </div>
      )
    }
  ], [addToast]);
  const filteredItems = items.filter(item => {
    const matchesTab = (() => {
      if (activeTab === 'low') return item.status === 'low-stock' || item.status === 'out-of-stock';
      if (activeTab === 'expiring') return item.status === 'expiring-soon';
      return true;
    })();
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.sku.toLowerCase().includes(searchQuery.toLowerCase());
                          
    return matchesTab && matchesSearch;
  });
  return (
    <div className="stock-management-page">
      <PageTitle 
        title="Stock Management" 
        subtitle="Multi-location inventory visibility and control"
        rightContent={
          <div className="stock-management-header-actions">
            <Button 
              variant="secondary" 
              className="sm-header-btn" 
              onClick={() => addToast("Report Exported Successfully", "success")}>
              <RiFileTextLine size={16} /> Export Stock Report
            </Button>
            <Button 
              variant="primary" 
              className="sm-header-btn" 
              onClick={() => setIsAddStockModalOpen(true)}>
              <RiAddLine size={18} /> Stock Adjustment
            </Button>
          </div>
        }/>
      <div className="stock-management-content">
        <div className="sm-filter-container">
          <div className="sm-search-input-wrapper">
            <RiSearchLine size={18} />
            <input 
              type="text" 
              className="sm-search-input" 
              placeholder="Search items..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}/>
          </div>
          <div className="sm-filter-dropdown"></div>
          <div className="sm-filter-dropdown"></div>
        </div>
        {/*Labels use live counts to reflect real-time filtering */}
        <div className="sm-category-tabs-container" data-testid="stock-tabs">
          {[
            { key: 'all', label: `All Items (${allCount})` },
            { key: 'low', label: `Low/Out of Stock (${lowOutCount})` },
            { key: 'expiring', label: `Expiring Soon (${expiringSoonCount})` },
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              className={`sm-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
              data-testid={`tab-${tab.key}`}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="sm-table-container" data-testid="stock-table">
          {loading ? (
            <div className="sm-loading-state">Loading...</div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredItems}
              keyField="id"
              itemsPerPage={10}
            />
          )}
        </div>
      </div>

      <AddStockModal
        isOpen={isAddStockModalOpen}
        onClose={() => setIsAddStockModalOpen(false)}
        onSuccess={() => {
          loadItems();
          addToast('Stock Added Successfully', 'success');
        }}
      />
    </div>
  );
};

export default StockManagement;
