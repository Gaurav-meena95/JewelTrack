import React, { createContext, useContext, useState, useCallback } from 'react';
import ConfirmModal from '../utils/ConfirmModal';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'confirm',
    resolve: null
  });

  const [toasts, setToasts] = useState([]);

  const confirm = useCallback((message, title = 'Confirm Action', type = 'confirm') => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        title,
        message,
        type,
        resolve
      });
    });
  }, []);

  const showToast = useCallback((message, type = 'success', title = '') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, title }]);
    
    // Auto-remove handled by Toast component
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleModalClose = (value) => {
    if (modalState.resolve) {
      modalState.resolve(value);
    }
    setModalState(prev => ({ ...prev, isOpen: false, resolve: null }));
  };

  return (
    <NotificationContext.Provider value={{ confirm, showToast }}>
      {children}
      
      {/* Centered Blocking Confirmation Modal */}
      <ConfirmModal 
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        onClose={handleModalClose}
      />

      {/* Non-blocking Top-Right Toast Notifications */}
      <div className="fixed top-4 right-4 z-[600] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} onRemove={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

// Internal Toast Component
const Toast = ({ id, message, type, title, onRemove }) => {
  const duration = 2000;

  React.useEffect(() => {
    const timer = setTimeout(onRemove, duration);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const configs = {
    success: {
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      progress: "bg-green-500",
      defaultTitle: "Success"
    },
    danger: {
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      progress: "bg-red-500",
      defaultTitle: "Error"
    },
    info: {
      icon: <Info className="w-5 h-5 text-blue-500" />,
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      progress: "bg-blue-500",
      defaultTitle: "Info"
    }
  };

  const config = configs[type] || configs.success;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      className="pointer-events-auto relative group bg-card/90 backdrop-blur-xl rounded-2xl border border-amber-400/30 shadow-[0_0_20px_rgba(251,191,36,0.1)] overflow-hidden"
    >
      <div className="p-4 pr-10 flex items-start gap-3">
        <div className={`shrink-0 w-10 h-10 rounded-full ${config.bg} flex items-center justify-center border ${config.border} shadow-inner`}>
          {config.icon}
        </div>
        <div className="pt-0.5">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-amber-400/80">
            {title || config.defaultTitle}
          </h4>
          <p className="text-xs font-bold leading-tight mt-0.5">{message}</p>
        </div>
        <button 
          onClick={onRemove}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <motion.div 
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: duration / 1000, ease: "linear" }}
        className={`absolute bottom-0 left-0 h-1 ${config.progress} shadow-[0_0_10px_rgba(251,191,36,0.2)]`}
      />
    </motion.div>
  );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
