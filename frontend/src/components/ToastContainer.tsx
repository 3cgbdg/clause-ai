import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import type { Toast } from '../hooks/useToast';

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const icons = {
  success: <CheckCircle className="w-4 h-4 text-risk-low shrink-0" />,
  error: <AlertCircle className="w-4 h-4 text-risk-high shrink-0" />,
  info: <Info className="w-4 h-4 text-accent shrink-0" />,
};

const styles = {
  success: 'border-risk-low/20 bg-risk-low/10',
  error: 'border-risk-high/20 bg-risk-high/10',
  info: 'border-accent/20 bg-accent/10',
};

const ToastContainer = ({ toasts, onDismiss }: ToastContainerProps) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border glass shadow-2xl shadow-black/40 backdrop-blur-xl min-w-[280px] max-w-sm animate-fade-in ${styles[t.type]}`}
        >
          {icons[t.type]}
          <span className="text-sm font-semibold text-white flex-1">{t.message}</span>
          <button
            onClick={() => onDismiss(t.id)}
            className="text-gray-500 hover:text-white transition-colors ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
