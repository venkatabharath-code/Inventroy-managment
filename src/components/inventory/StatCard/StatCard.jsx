import React from 'react';
import { RiBox3Line, RiAlertLine, RiCalendarEventLine } from 'react-icons/ri';
import { FiTrendingDown } from 'react-icons/fi';
import './StatCard.css';

const iconMap = {
  total: <RiBox3Line />,
  low: <RiAlertLine />,
  out: <FiTrendingDown />,
  expiring: <RiCalendarEventLine />
};

const StatCard = ({ title, value, subtitle, icon, type }) => {
  return (
    <div className={`stat-card stat-card-${type}`}>
      <div className="stat-card-header">
        <div className={`stat-card-icon-wrapper stat-icon-${type}`}>
          {iconMap[icon]}
        </div>
        <span className="stat-card-title">{title}</span>
      </div>
      <div className="stat-card-body">
        <h3 className="stat-card-value">{value}</h3>
        <p className={`stat-card-subtitle ${type === 'purple' ? 'text-purple' : ''} ${type === 'danger' ? 'text-danger' : ''} ${type === 'warning' ? 'text-warning' : ''}`}>{subtitle}</p>
      </div>
    </div>
  );
};

export default React.memo(StatCard);
