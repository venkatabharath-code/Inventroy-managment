import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Header from '../../components/layout/Header/Header';
import './DashboardLayout.css';
const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  return (
    <div className="dashboard-layout">
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}    
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="dashboard-main">
        <Header onMenuClick={toggleSidebar} />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default DashboardLayout;
