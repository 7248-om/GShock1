import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ConfirmOptions {
  id: string;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'default' | 'danger' | 'warning';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ConfirmContextType {
  confirmDialog: ConfirmOptions | null;
  openConfirm: (options: Omit<ConfirmOptions, 'id'>) => Promise<boolean>;
  closeConfirm: () => void;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [confirmDialog, setConfirmDialog] = useState<ConfirmOptions | null>(null);

  const openConfirm = useCallback((options: Omit<ConfirmOptions, 'id'>) => {
    return new Promise<boolean>((resolve) => {
      const id = Date.now().toString();
      
      const handleConfirm = async () => {
        await options.onConfirm();
        setConfirmDialog(null);
        resolve(true);
      };

      const handleCancel = () => {
        options.onCancel?.();
        setConfirmDialog(null);
        resolve(false);
      };

      setConfirmDialog({
        id,
        ...options,
        onConfirm: handleConfirm,
        onCancel: handleCancel,
      });
    });
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmDialog(null);
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirmDialog, openConfirm, closeConfirm }}>
      {children}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmProvider');
  }
  return context;
};
