import { AlertCircle } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
  onReset: () => void;
}

const ErrorBanner = ({ message, onRetry, onReset }: ErrorBannerProps) => {
  return (
    <div className="glass bg-risk-high/10 border-risk-high/20 p-6 rounded-3xl animate-fade-in flex flex-col md:flex-row items-start gap-4">
      <AlertCircle className="w-8 h-8 text-risk-high shrink-0" />
      <div className="flex-1">
        <h3 className="font-semibold text-risk-high text-lg">Analysis Failed</h3>
        <p className="text-gray-300 mt-1 leading-relaxed">{message}</p>
        <div className="flex gap-3 mt-4">
          <button 
            onClick={onRetry} 
            className="px-4 py-2 bg-risk-high/20 text-risk-high rounded-xl text-sm font-bold hover:bg-risk-high/30 transition-all active:scale-95"
          >
            Try Again
          </button>
          <button 
            onClick={onReset} 
            className="px-4 py-2 bg-white/5 text-gray-400 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBanner;
