import './Button.css';
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  icon,
  type = 'button'
}) => {
  const classes = `custom-btn btn-${variant} btn-${size} ${className}`;
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}>
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
};
export default Button;
