import React, { createContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-dreamy-lavender-600" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-emerald-200 bg-emerald-50 text-emerald-800';
      case 'error':
        return 'border-rose-200 bg-rose-50 text-rose-800';
      case 'info':
      default:
        return 'border-dreamy-lavender-100 bg-dreamy-lavender-50 text-dreamy-lavender-900';
    }
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast container */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 md:left-auto md:right-5 md:translate-x-0 z-50 flex flex-col gap-3 max-w-sm w-[calc(100%-2.5rem)] md:w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl border shadow-lg dreamy-glass transition-all duration-300 transform translate-y-0 animate-fade-in ${getBgColor(
              toast.type
            )}`}
            style={{ animation: 'fadeIn 0.3s ease-out' }}
          >
            <div className="flex-shrink-0">{getIcon(toast.type)}</div>
            <p className="text-sm font-medium flex-grow">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
