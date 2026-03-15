interface KeyPointCardProps {
  point: string;
  index: number;
}

const KeyPointCard = ({ point, index }: KeyPointCardProps) => {
  return (
    <div 
      className="flex items-start gap-3 text-sm text-gray-300 p-2 rounded-lg hover:bg-white/5 transition-colors group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="mt-1 shrink-0 w-5 h-5 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center text-[10px] font-bold text-accent group-hover:bg-accent group-hover:text-white transition-all">
        {index + 1}
      </div>
      <p className="leading-relaxed">{point}</p>
    </div>
  );
};

export default KeyPointCard;
