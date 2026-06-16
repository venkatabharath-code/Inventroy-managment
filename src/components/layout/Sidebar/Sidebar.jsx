import { NavLink } from 'react-router-dom';
import { 
  RiDashboardLine, 
  RiBox3Line,
  RiSettings4Line, 
  RiLogoutBoxRLine,
  RiCloseLine
} from 'react-icons/ri';
import { FiActivity } from 'react-icons/fi';
import UserProfile from '../UserProfile/UserProfile';
import './Sidebar.css';

const navItems = [
  { name: 'Dashboard', path: '/inventory/dashboard', icon: <RiDashboardLine /> },
  { name: 'Stock Management', path: '/inventory/stock', icon: <RiBox3Line /> },
  { name: 'Procurement', path: '/procurement/dashboard', icon: <RiBox3Line /> },
  { name: 'Asset Management', path: '/assets/dashboard', icon: <RiSettings4Line /> }
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-brand">
        <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
          <RiCloseLine />
        </button>
        <div className="brand-logo-container">
          <div className="brand-icon-wrapper" style={{ 
            width: '32px', 
            height: '32px', 
            background: 'linear-gradient(135deg, #00B4D8 0%, #00C9A7 100%)', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0, 201, 167, 0.2)'
          }}>
            <FiActivity size={20} color="white" strokeWidth={2.5} />
          </div>
          <span className="brand-text">MediCare HIS</span>
        </div>
        <button className="sidebar-close-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex' }}>
          <RiCloseLine size={20} color="#0F172B" />
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, index) => (
          <NavLink 
            key={index} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <UserProfile />
        <button className="logout-btn">
          <RiLogoutBoxRLine className="logout-icon" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
