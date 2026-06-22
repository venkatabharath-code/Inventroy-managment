import React from 'react';
import Card from '../../common/Card/Card';
import Button from '../../common/Button/Button';
import { RiAlertLine, RiTimeLine } from 'react-icons/ri';
import './AlertCard.css';
const AlertCard = ({ title, items, type }) => {
  const isDanger = type === 'danger';
  return (
    <Card className="alert-card h-100">
      <div className={`alert-card-header text-${type}`}>
        <span className="alert-header-icon">
          {isDanger ? <RiAlertLine /> : <RiTimeLine />}
        </span>
        <h5 className="alert-header-title">{title}</h5>
      </div>
      <div className="alert-card-list">
        {items.map((item) => (
          <div key={item.id} className={`alert-item alert-item-${type}`}>
            <div className="alert-item-info">
              <h6 className="alert-item-name">{item.name}</h6>
              <div className="alert-item-details">
                {item.category && <span>Category: {item.category} | </span>}
                {item.location && <span>Location: {item.location}</span>}
                {item.current && <span>Current: {item.current} | </span>}
                {item.min && <span>Min: {item.min}</span>}
              </div>
            </div>
            <div className="alert-item-action">
              <Button 
                variant={isDanger ? 'danger' : 'warning'} 
                size="sm">
                {item.actionType}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
export default React.memo(AlertCard);
