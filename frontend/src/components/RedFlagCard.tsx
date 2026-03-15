import type { RedFlag } from '../types';

interface RedFlagCardProps {
  flag: RedFlag;
}

const RedFlagCard = ({ flag }: RedFlagCardProps) => {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-risk-high/10 border-risk-high/20 text-risk-high';
      case 'medium':
        return 'bg-risk-med/10 border-risk-med/20 text-risk-med';
      default:
        return 'bg-white/5 border-white/10 text-gray-300';
    }
  };

  const getBadgeStyles = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-risk-high text-white';
      case 'medium':
        return 'bg-risk-med text-navy';
      default:
        return 'bg-gray-400 text-navy';
    }
  };

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 transition-all duration-300 hover:scale-[1.01] ${getSeverityStyles(flag.severity)}`}>
      <div className={`mt-0.5 shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold font-mono ${getBadgeStyles(flag.severity)}`}>
        !
      </div>
      <div>
        <h4 className={`font-semibold text-sm mb-1 ${flag.severity === 'high' ? 'text-risk-high' : flag.severity === 'medium' ? 'text-risk-med' : 'text-white'}`}>
          {flag.clause}
        </h4>
        <p className="text-sm text-gray-400 leading-snug">{flag.concern}</p>
      </div>
    </div>
  );
};

export default RedFlagCard;
