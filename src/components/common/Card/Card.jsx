import './Card.css';
const Card = ({ children, className = '', noPadding = false, title }) => {
  return (
    <div className={`custom-card ${className}`}>
      {title && (
        <div className="custom-card-header">
          <h5 className="custom-card-title">{title}</h5>
        </div>
      )}
      <div className={`custom-card-body ${noPadding ? 'p-0' : ''}`}>
        {children}
      </div>
    </div>
  );
};
export default Card;
