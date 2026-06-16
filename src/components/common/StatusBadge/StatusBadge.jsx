import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status, text }) => {
  // Normalize status to lowercase for mapping
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

export default React.memo(StatusBadge);
