import { useEffect } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import './Modal.css';
const Modal = ({ isOpen, onClose, title, children, footer }) => {
  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <div className="custom-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="custom-modal-content" onClick={e => e.stopPropagation()}>
        <div className="custom-modal-header">
          <h5 className="custom-modal-title">{title}</h5>
          <button type="button" className="custom-modal-close" onClick={onClose} aria-label="Close modal" data-testid="modal-close">
            <RiCloseLine />
          </button>
        </div>
        <div className="custom-modal-body">
          {children}
        </div>
        {footer && (
          <div className="custom-modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
export default Modal;
