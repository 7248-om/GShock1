import React from 'react';
import { useConfirm } from '../context/ConfirmContext';
import { AlertTriangle, AlertCircle, HelpCircle, X } from 'lucide-react';

const ConfirmDialog: React.FC = () => {
  const { confirmDialog } = useConfirm();

  if (!confirmDialog) return null;

  const getIcon = () => {
    switch (confirmDialog.type) {
      case 'danger':
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-amber-600" />;
      default:
        return <HelpCircle className="w-6 h-6 text-blue-600" />;
    }
  };

  const getHeaderClass = () => {
    switch (confirmDialog.type) {
      case 'danger':
        return 'border-b-2 border-red-200 bg-red-50';
      case 'warning':
        return 'border-b-2 border-amber-200 bg-amber-50';
      default:
        return 'border-b-2 border-blue-200 bg-blue-50';
    }
  };

  const getButtonClasses = () => {
    switch (confirmDialog.type) {
      case 'danger':
        return {
          confirm: 'bg-red-600 hover:bg-red-700 text-white',
          cancel: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        };
      case 'warning':
        return {
          confirm: 'bg-amber-600 hover:bg-amber-700 text-white',
          cancel: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        };
      default:
        return {
          confirm: 'bg-blue-600 hover:bg-blue-700 text-white',
          cancel: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        };
    }
  };

  const buttonClasses = getButtonClasses();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className={`flex items-start justify-between p-4 ${getHeaderClass()}`}>
          <div className="flex items-start gap-3">
            {getIcon()}
            <h2 className="text-lg font-semibold text-gray-900 mt-0.5">
              {confirmDialog.title}
            </h2>
          </div>
          <button
            onClick={confirmDialog.onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed">
            {confirmDialog.message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={confirmDialog.onCancel}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${buttonClasses.cancel}`}
          >
            {confirmDialog.cancelText || 'Cancel'}
          </button>
          <button
            onClick={confirmDialog.onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${buttonClasses.confirm}`}
          >
            {confirmDialog.confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
