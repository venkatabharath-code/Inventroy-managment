import { useState, useEffect } from 'react';
import StatCard from '../../../components/inventory/StatCard/StatCard';
import AlertCard from '../../../components/inventory/AlertCard/AlertCard';
import CategoryCard from '../../../components/inventory/CategoryCard/CategoryCard';
import RecentMovements from '../../../components/inventory/RecentMovements/RecentMovements';
import { inventoryService } from '../../../services/inventoryService';
import Button from '../../../components/common/Button/Button';
import Card from '../../../components/common/Card/Card';
import PageTitle from '../../../components/common/PageTitle/PageTitle';
import AddStockModal from '../../../components/inventory/AddStockModal/AddStockModal';
import InventorySettingsModal from '../../../components/inventory/InventorySettingsModal/InventorySettingsModal';
import { useToast } from '../../../context/ToastContext';
import { RiSettings3Line, RiAddLine } from 'react-icons/ri';
import './Dashboard.css';
const Dashboard = () => {
  const { addToast } = useToast();
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [stats, setStats] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [movements, setMovements] = useState([]);
  const loadDashboardData = async () => {
    try {
      const [s, a, c, m] = await Promise.all([
        inventoryService.getDashboardStats(),
        inventoryService.getAlerts(),
        inventoryService.getStockByCategory(),
        inventoryService.getRecentMovements()
      ]);
      setStats(s || []);
      setAlerts(a || []);
      setCategories(c || []);
      setMovements(m || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setStats([]);
      setAlerts([]);
      setCategories([]);
      setMovements([]);
    }
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    loadDashboardData();
  }, []);
  const headerActions = (
    <>
      <Button 
        variant="secondary" 
        icon={<RiSettings3Line />} 
        onClick={() => setIsSettingsModalOpen(true)} 
        data-testid="btn-settings">
        Settings
      </Button>
      <Button 
        variant="primary" 
        icon={<RiAddLine />} 
        onClick={() => setIsAddStockModalOpen(true)} 
        data-testid="btn-add-stock">
        Add Stock Item
      </Button>
    </>
  );
  return (
    <div className="dashboard-page">
      <PageTitle 
        title="Inventory Management" 
        subtitle="Multi-location stock control & procurement"
        rightContent={headerActions}/>
      <div className="stats-row" data-testid="stats-row">
        {stats.map(stat => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            type={stat.type}
            data-testid={`stat-${stat.id}`}/>
        ))}
      </div>
      <div className="alerts-section">
        {alerts.map(alert => (
          <div key={alert.id} className="alert-wrapper">
            <AlertCard 
              title={alert.title}
              items={alert.items}
              type={alert.type}/>
          </div>
        ))}
      </div>
      <div className="category-section">
        <Card noPadding={false}>
          <h5 className="section-title category-title">Stock by Category</h5>
          <div className="category-row">
            {categories.map(category => (
              <CategoryCard 
                key={category.id}
                name={category.name}
                count={category.count}
                status={category.status}
                statusType={category.statusType}/>
            ))}
          </div>
        </Card>
        <div className="movements-section">
          <h3 className="section-title">Recent Stock Movements</h3>
          <Card padding="0">
            <RecentMovements data={movements} />
          </Card>
        </div>
      </div>
      <AddStockModal
        isOpen={isAddStockModalOpen}
        onClose={() => setIsAddStockModalOpen(false)}
        onSuccess={() => {
          loadDashboardData();
          addToast('Stock Added Successfully', 'success');
        }}/>
      <InventorySettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSuccess={() => {
          addToast('Settings Saved Successfully', 'success');
        }}/>
    </div>
  );
};
export default Dashboard;
