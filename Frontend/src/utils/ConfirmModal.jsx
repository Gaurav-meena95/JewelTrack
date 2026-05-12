import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, AlertCircle, Trash2 } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, type, onClose }) => {
  if (!isOpen) return null;

  const configs = {
    confirm: {
      icon: <AlertTriangle className="w-10 h-10 text-amber-400" />,
      bg: "bg-amber-400/10",
      border: "border-amber-400/30",
      btn: "bg-amber-400 hover:bg-amber-500 text-black",
      actionText: "Yes, Proceed"
    },
    danger: {
      icon: <Trash2 className="w-10 h-10 text-red-500" />,
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      btn: "bg-red-500 hover:bg-red-600 text-white",
      actionText: "Yes, Delete"
    }
  };

  const config = configs[type] || configs.confirm;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onClose(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal content */}
          <motion.div
             initial={{ opacity: 0, scale: 0.9, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.9, y: 20 }}
             className="relative bg-card/90 backdrop-blur-2xl w-full max-w-sm rounded-[32px] border border-amber-400/30 shadow-2xl overflow-hidden"
          >
            <div className="p-8 text-center space-y-6">
              {/* Icon Section */}
              <div className={`mx-auto w-20 h-20 rounded-full ${config.bg} flex items-center justify-center border ${config.border} shadow-inner ring-8 ring-amber-400/5`}>
                {config.icon}
              </div>
              
              {/* Text Content */}
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight uppercase text-foreground">{title}</h3>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed px-4">
                  {message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => onClose(false)}
                  className="flex-1 p-4 rounded-2xl bg-secondary hover:bg-secondary/80 font-bold transition-all active:scale-95 border border-border/50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onClose(true)}
                  className={`flex-1 p-4 rounded-2xl font-black shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${config.btn}`}
                >
                  {config.actionText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
