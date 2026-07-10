import { useState, useCallback } from 'react';
import { RiCheckLine } from 'react-icons/ri';
import './Toast.css';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, [removeToast]);

  const ToastUI = () => (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`custom-toast custom-toast-${toast.type}`}>
          <div className="custom-toast-icon">
            {toast.type === 'success' && <RiCheckLine size={20} />}
          </div>
          <div className="custom-toast-message">{toast.message}</div>
        </div>
      ))}
    </div>
  );

  return { addToast, ToastUI };
};
