import './StatusBadge.css';
const StatusBadge = ({ status, text }) => {
  const normalizedStatus = status.toLowerCase();
  let variant = 'info';
  if (normalizedStatus.includes('in') || normalizedStatus.includes('success')) {
    variant = 'success';
  } else if (normalizedStatus.includes('out') || normalizedStatus.includes('danger')) {
    variant = 'danger';
  } else if (normalizedStatus.includes('transfer') || normalizedStatus.includes('info')) {
    variant = 'info';
  } else if (normalizedStatus.includes('low') || normalizedStatus.includes('warning')) {
    variant = 'warning';
  }
  return (
    <span className={`status-badge badge-${variant}`}>
      {text || status}
    </span>
  );
};
export default StatusBadge;
