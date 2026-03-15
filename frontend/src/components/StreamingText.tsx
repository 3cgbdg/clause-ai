import { useRef, useEffect } from 'react';

interface StreamingTextProps {
  text: string;
  isAnalyzing: boolean;
}

const StreamingText = ({ text, isAnalyzing }: StreamingTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && isAnalyzing) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [text, isAnalyzing]);

  return (
    <div 
      ref={containerRef}
      className="bg-black/30 p-4 rounded-xl border border-white/5 text-gray-200 leading-relaxed max-h-48 overflow-y-auto custom-scrollbar font-sans"
    >
      {text || (isAnalyzing ? (
        <span className="flex items-center gap-1 opacity-50 animate-pulse">
          Reading contract
          <span className="dot-1">.</span>
          <span className="dot-2">.</span>
          <span className="dot-3">.</span>
        </span>
      ) : null)}
      
      {isAnalyzing && text && (
        <span className="inline-block w-1.5 h-4 bg-accent ml-1 animate-pulse align-middle" />
      )}
    </div>
  );
};

export default StreamingText;
