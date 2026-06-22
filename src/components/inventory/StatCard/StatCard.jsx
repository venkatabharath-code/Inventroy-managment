import { RiBox3Line, RiAlertLine, RiCalendarEventLine } from 'react-icons/ri';
import { FiTrendingDown } from 'react-icons/fi';
import './StatCard.css';

const iconMap = {
  total: <RiBox3Line />,
  low: <RiAlertLine />,
  out: <FiTrendingDown />,
  expiring: <RiCalendarEventLine />
};
const subtitleColorMap = {
  purple: 'text-purple',
  danger: 'text-danger',
  warning: 'text-warning'
};
const StatCard = ({ title, value, subtitle, icon, type }) => {
  const subtitleClass = subtitleColorMap[type] || '';
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
        <p className={`stat-card-subtitle ${subtitleClass}`}>{subtitle}</p>
      </div>
    </div>
  );
};
export default StatCard;
