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
        return <CheckCircle class="w-5 h-5 text-emerald-500" />;
      case 'error':
        return <AlertCircle class="w-5 h-5 text-rose-500" />;
      case 'info':
      default:
        return <Info class="w-5 h-5 text-dreamy-lavender-600" />;
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
      <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            class={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl border shadow-lg dreamy-glass transition-all duration-300 transform translate-y-0 animate-fade-in ${getBgColor(
              toast.type
            )}`}
            style={{ animation: 'fadeIn 0.3s ease-out' }}
          >
            <div class="flex-shrink-0">{getIcon(toast.type)}</div>
            <p class="text-sm font-medium flex-grow">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              class="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
