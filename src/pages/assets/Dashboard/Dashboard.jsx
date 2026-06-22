import { useState, useEffect, useMemo } from 'react';
import PageTitle from '../../../components/common/PageTitle/PageTitle';
import Button from '../../../components/common/Button/Button';
import { 
  RiAddLine, 
  RiBox3Line, 
  RiMapPinLine,
  RiCalendarEventLine
} from 'react-icons/ri';
import { FiTool, FiDollarSign, FiAlertTriangle } from 'react-icons/fi';
import RegisterAssetModal from '../../../components/assets/RegisterAssetModal/RegisterAssetModal';
import { assetService } from '../../../services/assetService';
import { useToast } from '../../../context/ToastContext';
import './Dashboard.css';
const Dashboard = () => {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assets, setAssets] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadData = async () => {
    setLoading(true);
    try {
      const [assetData, maintenanceData] = await Promise.all([
        assetService.getAssets(),
        assetService.getMaintenanceSchedule()
      ]);
      setAssets(assetData || []);
      setMaintenance(maintenanceData || []);
    } catch (error) {
      console.error('Failed to load asset data:', error);
      setAssets([]);
      setMaintenance([]);
    }
    setLoading(false);
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);
  const totalValue = useMemo(() => {
    let total = 0;
    assets.forEach(asset => {
      let valStr = asset.value ? String(asset.value).toUpperCase().replace(/[^0-9.LCR]/g, '') : '0';
      if (valStr.includes('CR')) {
        total += parseFloat(valStr.replace('CR', '')) * 10000000;
      } else if (valStr.includes('L')) {
        total += parseFloat(valStr.replace('L', '')) * 100000;
      } else {
        total += parseFloat(valStr) || 0;
      }
    });
    if (total >= 10000000) {
      return `₹${(total / 10000000).toFixed(1)}Cr`;
    } else if (total >= 100000) {
      return `₹${(total / 100000).toFixed(1)}L`;
    }
    return `₹${total.toLocaleString('en-IN')}`;
  }, [assets]);
  return (
    <div className="asset-dashboard-page">
      <PageTitle 
        title="Asset Management" 
        subtitle="High-value equipment tracking, maintenance & warranty"
        rightContent={
          <Button 
            variant="primary" 
            className="asset-header-btn" 
            onClick={() => setIsModalOpen(true)}>
            <RiAddLine size={18} /> 
            Register Asset
          </Button>
        }/>
      <div className="asset-dashboard-content">
        <div className="asset-stats-container">
          <div className="asset-stat-card">
            <div className="asset-stat-header color-primary">
              <RiBox3Line size={18} /> <span className="stat-label">Total Assets</span>
            </div>
            <div className="asset-stat-value">{assets.length}</div>
            <div className="asset-stat-footer">Registered</div>
          </div>
          <div className="asset-stat-card">
            <div className="asset-stat-header color-success">
              <FiDollarSign size={18} /> <span className="stat-label">Total Value</span>
            </div>
            <div className="asset-stat-value">{totalValue}</div>
            <div className="asset-stat-footer">Asset value</div>
          </div>
          <div className="asset-stat-card">
            <div className="asset-stat-header color-warning">
              <FiTool size={18} /> <span className="stat-label">Under Maintenance</span>
            </div>
            <div className="asset-stat-value">{assets.filter(a => a.status === 'maintenance').length}</div>
            <div className="asset-stat-footer text-warning">In service</div>
          </div>
          <div className="asset-stat-card">
            <div className="asset-stat-header color-critical">
              <FiAlertTriangle size={18} /> <span className="stat-label">Warranty Expiring</span>
            </div>
            <div className="asset-stat-value">1</div>
            <div className="asset-stat-footer text-critical">Within 6 months</div>
          </div>
        </div>
        <div className="asset-register-container">
          <div className="asset-section-title">Asset Register</div>
          <div className="asset-table-wrapper">
            <table className="asset-table">
              <thead>
                <tr>
                  <th>Asset ID</th>
                  <th>Equipment Name</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Value</th>
                  <th>Warranty Expires</th>
                  <th>Last Maintenance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="asset-loading-row">Loading assets...</td>
                  </tr>
                ) : assets.map(asset => (
                  <tr key={asset.id} className="asset-row">
                    <td>
                      <div className="asset-id-badge">{asset.id}</div>
                    </td>
                    <td>
                      <div className="asset-name">{asset.name}</div>
                      <div className="asset-purchased">Purchased: {asset.purchased}</div>
                    </td>
                    <td>
                      <div className="category-badge">{asset.category}</div>
                    </td>
                    <td>
                      <div className="location-cell">
                        <RiMapPinLine className="location-icon" />
                        {asset.location}
                      </div>
                    </td>
                    <td>
                      <div className="value-cell">{asset.value}</div>
                    </td>
                    <td>
                      <div className={`warranty-date ${asset.daysLeft !== null ? 'warranty-critical' : ''}`}>
                        {asset.warrantyExpires}
                      </div>
                      {asset.daysLeft !== null && (
                        <div className="warranty-days">
                          ({Math.abs(asset.daysLeft)} days {asset.daysLeft < 0 ? 'left)' : 'left)'}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="maintenance-cell">{asset.lastMaintenance}</div>
                    </td>
                    <td>
                      <div className={`status-badge status-${asset.status}`}>
                        {asset.status}
                      </div>
                    </td>
                    <td>
                      <div className="action-cell">
                        <button 
                          type="button"
                          className="btn-tool" 
                          aria-label="Settings" 
                          onClick={() => addToast("Asset Updated Successfully", "success")}>
                          <FiTool size={16} />
                        </button>
                        <button type="button" className="btn-view">View</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="asset-maintenance-container">
          <div className="asset-section-title">Upcoming Maintenance Schedule</div>
          <div className="maintenance-list">
            {loading ? (
              <div className="asset-loading-schedule">Loading schedule...</div>
            ) : maintenance.map(task => (
              <div key={task.id} className="maintenance-card">
                <div className="maintenance-info">
                  <div className="maintenance-icon-wrapper">
                    <RiCalendarEventLine size={20} className="maintenance-icon" />
                  </div>
                  <div className="maintenance-details">
                    <div className="maintenance-equipment">{task.equipment}</div>
                    <div className="maintenance-meta">
                      Scheduled: {task.scheduled} | Type: {task.type}
                    </div>
                  </div>
                </div>
                <button 
                  type="button"
                  className="btn-schedule" 
                  onClick={() => addToast("Maintenance Scheduled Successfully", "success")}>
                  Schedule Service
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <RegisterAssetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          addToast("Asset Registered Successfully", "success");
          loadData();
        }}/>
    </div>
  );
};
export default Dashboard;
