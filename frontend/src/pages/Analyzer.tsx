import { useState } from 'react';
import { useAnalyzeContract } from '../hooks/useAnalyzeContract';
import { Type, AlertCircle, CheckCircle, Info, Loader2, FileText, Share2, RefreshCcw } from 'lucide-react';
import ScoreBadge from '../components/ScoreBadge';
import RedFlagCard from '../components/RedFlagCard';
import KeyPointCard from '../components/KeyPointCard';
import StreamingText from '../components/StreamingText';
import ErrorBanner from '../components/ErrorBanner';
import FileUpload from '../components/FileUpload';

const MAX_CHARS = 50000;
const MIN_CHARS = 50;

const Analyzer = () => {
  const [inputMode, setInputMode] = useState<'text' | 'pdf'>('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const { status, summary, result, error, analyze, reset } = useAnalyzeContract();

  const handleAnalyze = () => {
    if (inputMode === 'text') {
      analyze({ text });
    } else if (file) {
      analyze({ file });
    }
  };

  const isAnalyzeDisabled = 
    status === 'analyzing' ||
    (inputMode === 'text' && (text.length < MIN_CHARS || text.length > MAX_CHARS)) ||
    (inputMode === 'pdf' && !file);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Contract Analyzer</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Our AI reads the fine print so you don't have to. Get immediate clarity on risks and rewards.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        
        {/* LEFT COLUMN: INPUT */}
        <div className="flex flex-col gap-6">
          <div className="glass p-8 rounded-3xl relative border-white/10 shadow-2xl">
            <div className="flex rounded-2xl bg-white/5 p-1.5 mb-8 w-full border border-white/5">
              <button
                onClick={() => setInputMode('text')}
                className={`flex-1 py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                  inputMode === 'text' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Type className="w-4 h-4" /> Paste Text
              </button>
              <button
                onClick={() => setInputMode('pdf')}
                className={`flex-1 py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                  inputMode === 'pdf' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" /> Upload PDF
              </button>
            </div>

            {inputMode === 'text' ? (
              <div className="relative group">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your contract text here..."
                  className="w-full h-96 bg-black/20 border border-white/10 rounded-2xl p-6 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none font-mono text-sm custom-scrollbar transition-all group-hover:border-white/20"
                />
                <div className="absolute bottom-4 right-6 text-[10px] font-bold tracking-widest uppercase py-1 px-2 rounded-md bg-black/40 border border-white/5">
                  <span className={`${text.length > MAX_CHARS ? 'text-risk-high' : 'text-gray-400'}`}>
                    {text.length.toLocaleString()}
                  </span>
                  <span className="text-gray-600 ml-1">/ {MAX_CHARS.toLocaleString()}</span>
                </div>
                {text.length > 0 && text.length < MIN_CHARS && (
                  <div className="absolute top-full left-0 mt-2 text-risk-med text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 animate-fade-in">
                    <AlertCircle className="w-3.5 h-3.5" /> Minimum {MIN_CHARS} characters required.
                  </div>
                )}
              </div>
            ) : (
              <FileUpload file={file} onFileSelect={setFile} />
            )}

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzeDisabled}
              className={`w-full mt-10 py-5 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all active:scale-95 ${
                isAnalyzeDisabled
                  ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                  : 'bg-accent text-white hover:bg-blue-600 shadow-xl shadow-accent/30 hover:-translate-y-0.5'
              }`}
            >
              {status === 'analyzing' ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" /> 
                  <span className="animate-pulse">Deep Analysis in Progress...</span>
                </>
              ) : (
                <>Analyze Contract</>
              )}
            </button>
            
            {(status === 'completed' || status === 'error') && (
              <button 
                onClick={reset} 
                className="w-full mt-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-3.5 h-3.5" /> reset and scan new
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: RESULTS */}
        <div className="flex flex-col gap-6">
          {error ? (
            <ErrorBanner message={error} onRetry={handleAnalyze} onReset={reset} />
          ) : status === 'idle' ? (
            <div className="glass p-16 rounded-3xl h-full border-dashed border-white/5 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                <Info className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">Awaiting Input</h3>
              <p className="text-gray-600 max-w-xs">Your plain-English breakdown and risk analysis will appear here instantly.</p>
            </div>
          ) : (
            <div className="glass p-8 rounded-3xl flex flex-col gap-8 animate-fade-in relative overflow-hidden border-white/10 shadow-2xl">
               {/* Analysis active pulse indicator */}
               {status === 'analyzing' && (
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-accent/10">
                    <div className="h-full bg-accent w-1/4 animate-[shimmer_2s_infinite_linear]" style={{ background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)' }}></div>
                  </div>
               )}

               {/* Header / Score */}
               <div className="flex items-center justify-between border-b border-white/5 pb-8">
                 <div>
                    <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">
                      {result?.contract_type || (status === 'analyzing' ? 'Classifying...' : 'Contract')}
                    </h2>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Document Intelligence</p>
                 </div>
                 {result && <ScoreBadge score={result.attention_score} label={result.score_label} />}
               </div>

               {/* Summary Stream */}
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Summary</h3>
                    {status === 'analyzing' && <div className="text-[10px] text-accent animate-pulse font-bold uppercase tracking-wider">Streaming Live</div>}
                  </div>
                  <StreamingText text={summary} isAnalyzing={status === 'analyzing'} />
               </div>

               {/* Key Points */}
               {result && result.key_points.length > 0 && (
                 <div className="animate-fade-in pt-4">
                   <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                     <CheckCircle className="w-4 h-4 text-accent" /> Key Provisions
                   </h3>
                   <div className="grid gap-3">
                     {result.key_points.map((pt, i) => (
                       <KeyPointCard key={i} index={i} point={pt} />
                     ))}
                   </div>
                 </div>
               )}

               {/* Red Flags */}
               {result && (
                 <div className="animate-fade-in pt-4">
                   <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                     <AlertCircle className="w-4 h-4 text-risk-high" /> Critical Concerns
                   </h3>
                   {result.red_flags.length === 0 ? (
                      <div className="p-5 rounded-2xl bg-risk-low/5 border border-risk-low/20 text-risk-low text-sm font-semibold flex items-center gap-3">
                        <CheckCircle className="w-5 h-5" />
                        No dangerous clauses detected for this document type.
                      </div>
                   ) : (
                     <div className="space-y-4">
                       {result.red_flags.map((flag, i) => (
                         <RedFlagCard key={i} flag={flag} />
                       ))}
                     </div>
                   )}
                 </div>
               )}

               {/* Actions */}
               {status === 'completed' && (
                  <div className="flex gap-4 mt-4 pt-8 border-t border-white/5">
                    <button className="flex-1 py-3 px-4 rounded-xl glass border border-white/5 text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-all active:scale-95 text-gray-300">
                      <Share2 className="w-4 h-4 text-accent" /> Share Analysis
                    </button>
                    <button 
                      onClick={reset}
                      className="flex-1 py-3 px-4 rounded-xl bg-white/5 text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95 text-white"
                    >
                      Analyze Another
                    </button>
                  </div>
               )}
            </div>
          )}
        </div>
        
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        .dot-1 { animation: pulse 1.5s infinite 0s; }
        .dot-2 { animation: pulse 1.5s infinite 0.3s; }
        .dot-3 { animation: pulse 1.5s infinite 0.6s; }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Analyzer;
