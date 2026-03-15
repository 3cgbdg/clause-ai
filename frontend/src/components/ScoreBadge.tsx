interface ScoreBadgeProps {
  score: number;
  label: string;
}

const ScoreBadge = ({ score, label }: ScoreBadgeProps) => {
  const getScoreColor = (score: number) => {
    if (score <= 3) return 'text-risk-low bg-risk-low/10 border-risk-low/20';
    if (score <= 6) return 'text-risk-med bg-risk-med/10 border-risk-med/20';
    return 'text-risk-high bg-risk-high/10 border-risk-high/20';
  };

  return (
    <div className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl border animate-scale-in transition-all duration-500 shadow-lg ${getScoreColor(score)}`}>
      <span className="text-xs font-bold uppercase tracking-wide opacity-80">Risk Score</span>
      <span className="text-2xl font-black">{score}/10</span>
      <span className="text-xs font-semibold">{label}</span>
    </div>
  );
};

export default ScoreBadge;
