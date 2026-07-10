import './PageTitle.css';
const PageTitle = ({ title, subtitle, rightContent }) => {
  return (
    <div className="page-title-container">
      <div className="page-title-text">
        <h2 className="page-title-heading">{title}</h2>
        {subtitle && <p className="page-title-subtitle">{subtitle}</p>}
      </div>
      {rightContent && (
        <div className="page-title-actions">
          {rightContent}
        </div>
      )}
    </div>
  );
};
export default PageTitle;
