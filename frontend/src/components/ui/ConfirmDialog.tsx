import { FiAlertCircle } from 'react-icons/fi';
import Button from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, isLoading = false,}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />

        {/* Dialog */}
        <div className="relative w-full max-w-sm bg-white rounded-xl shadow-xl p-6">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <FiAlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-1 text-sm text-slate-500">{message}</p>
            </div>
            <div className="flex gap-3 w-full">
              <Button
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={onConfirm}
                className="flex-1"
                isLoading={isLoading}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
