import React from 'react';
import './CategoryCard.css';
const CategoryCard = ({ name, count, status, statusType }) => {
  return (
    <div className="category-card">
      <div className="category-card-header">
        <h6 className="category-name">{name}</h6>
      </div>
      <div className="category-card-body">
        <h3 className="category-count">{count}</h3>
        <p className={`category-status text-${statusType}`}>{status}</p>
      </div>
    </div>
  );
};
export default React.memo(CategoryCard);
