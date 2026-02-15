import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: '#dcfce7',
          border: '#86efac',
          text: '#166534',
          icon: CheckCircle,
          iconColor: '#16a34a'
        };
      case 'error':
        return {
          bg: '#fee2e2',
          border: '#fca5a5',
          text: '#991b1b',
          icon: AlertCircle,
          iconColor: '#dc2626'
        };
      case 'warning':
        return {
          bg: '#fef3c7',
          border: '#fcd34d',
          text: '#92400e',
          icon: AlertTriangle,
          iconColor: '#f59e0b'
        };
      case 'info':
      default:
        return {
          bg: '#dbeafe',
          border: '#93c5fd',
          text: '#1e3a8a',
          icon: Info,
          iconColor: '#3b82f6'
        };
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 pointer-events-none">
      {toasts.map(toast => {
        const styles = getToastStyles(toast.type);
        const IconComponent = styles.icon;

        return (
          <div
            key={toast.id}
            className="pointer-events-auto animate-in slide-in-from-right-4 fade-in duration-300 flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border border-2 max-w-sm"
            style={{
              backgroundColor: styles.bg,
              borderColor: styles.border,
              color: styles.text
            }}
          >
            <IconComponent size={20} color={styles.iconColor} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 hover:opacity-60 transition-opacity"
            >
              <X size={18} color={styles.text} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
