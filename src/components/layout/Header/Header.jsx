import { RiMenuLine, RiHome4Line, RiNotification3Line, RiArrowDownSLine } from 'react-icons/ri';
import SearchInput from '../../common/SearchInput/SearchInput';
import './Header.css';
const Header = ({ onMenuClick }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMenuClick} aria-label="Open menu">
          <RiMenuLine />
        </button>
        <div className="header-search-container">
          <SearchInput placeholder="Search patients, ID, phone..." />
        </div>
      </div>
      <div className="header-actions">
        <div className="header-location">
          <RiHome4Line className="location-icon" />
          <span>Main Campus</span>
        </div>
        <div className="header-notification">
          <RiNotification3Line className="notification-icon" />
          <span className="notification-badge"></span>
        </div>
        <div className="header-user">
          <div className="header-user-info">
            <span className="header-user-name">Sarah Johnson</span>
            <span className="header-user-role">Inventory & Procurement</span>
          </div>
          <div className="header-user-avatar">
            SJ
          </div>
          <RiArrowDownSLine className="header-user-caret" />
        </div>
      </div>
    </header>
  );
};
export default Header;
