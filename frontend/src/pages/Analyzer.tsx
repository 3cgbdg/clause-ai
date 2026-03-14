import { useState, useRef, useEffect } from 'react';
import { useAnalyzeContract } from '../hooks/useAnalyzeContract';
import { FileText, Type, AlertCircle, CheckCircle, Info, Loader2 } from 'lucide-react';

const MAX_CHARS = 50000;
const MIN_CHARS = 50;

const Analyzer = () => {
  const [inputMode, setInputMode] = useState<'text' | 'pdf'>('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const getScoreColor = (score: number) => {
    if (score <= 3) return 'text-risk-low bg-risk-low/10 border-risk-low/20';
    if (score <= 6) return 'text-risk-med bg-risk-med/10 border-risk-med/20';
    return 'text-risk-high bg-risk-high/10 border-risk-high/20';
  };

  // Auto-scroll logic for summary could go here if needed
  const summaryRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (summaryRef.current && status === 'analyzing') {
       summaryRef.current.scrollTop = summaryRef.current.scrollHeight;
    }
  }, [summary]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Analyze Your Contract</h1>
        <p className="text-gray-400">Paste your text or upload a PDF to instantly understand what you're signing.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: INPUT */}
        <div className="flex flex-col gap-6">
          <div className="glass p-6 rounded-3xl relative">
            <div className="flex rounded-xl bg-white/5 p-1 mb-6 w-full">
              <button
                onClick={() => setInputMode('text')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                  inputMode === 'text' ? 'bg-accent text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Type className="w-4 h-4" /> Paste Text
              </button>
              <button
                onClick={() => setInputMode('pdf')}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                  inputMode === 'pdf' ? 'bg-accent text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" /> Upload PDF
              </button>
            </div>

            {inputMode === 'text' ? (
              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste your contract text here..."
                  className="w-full h-80 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none font-mono text-sm custom-scrollbar"
                />
                <div className="absolute bottom-4 right-4 text-xs font-mono">
                  <span className={`${text.length > MAX_CHARS ? 'text-risk-high' : 'text-gray-400'}`}>
                    {text.length.toLocaleString()}
                  </span>
                  <span className="text-gray-600"> / {MAX_CHARS.toLocaleString()}</span>
                </div>
                {text.length > 0 && text.length < MIN_CHARS && (
                  <div className="text-risk-med text-xs mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Minimum 50 characters required.
                  </div>
                )}
              </div>
            ) : (
              <div 
                className="w-full h-80 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  accept="application/pdf"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setFile(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4 text-accent">
                  {file ? <CheckCircle className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                </div>
                <h3 className="text-lg font-semibold mb-2">{file ? file.name : 'Select a PDF file'}</h3>
                <p className="text-sm text-gray-400 text-center px-4">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Max 50 pages or 10MB.'}
                </p>
                {file && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="mt-4 text-xs text-risk-high hover:underline"
                  >
                    Remove file
                  </button>
                )}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzeDisabled}
              className={`w-full mt-6 py-4 rounded-xl flex items-center justify-center gap-2 font-semibold text-lg transition-all ${
                isAnalyzeDisabled
                  ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                  : 'bg-accent text-white hover:bg-blue-600 shadow-lg shadow-accent/25 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {status === 'analyzing' ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" /> Analyzing...
                </>
              ) : (
                'Analyze Contract'
              )}
            </button>
            
            {status !== 'idle' && status !== 'analyzing' && (
              <button onClick={reset} className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                Reset and start over
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: RESULTS */}
        <div className="flex flex-col gap-6">
          {error ? (
            <div className="glass bg-risk-high/10 border-risk-high/20 p-6 rounded-3xl animate-fade-in flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-risk-high shrink-0" />
              <div>
                 <h3 className="font-semibold text-risk-high text-lg">Analysis Failed</h3>
                 <p className="text-gray-300 mt-1">{error}</p>
                 <button onClick={reset} className="mt-4 px-4 py-2 bg-risk-high/20 text-risk-high rounded-lg text-sm font-semibold hover:bg-risk-high/30 transition-colors">
                   Try Again
                 </button>
              </div>
            </div>
          ) : status === 'idle' ? (
            <div className="glass p-12 rounded-3xl h-full border-dashed flex flex-col items-center justify-center text-center text-gray-500">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Info className="w-8 h-8" />
              </div>
              <p>Your analysis will appear here.<br/>Paste a contract and click analyze to begin.</p>
            </div>
          ) : (
            <div className="glass p-6 rounded-3xl flex flex-col gap-6 animate-fade-in relative overflow-hidden">
               {/* Analysis active pulse indicator */}
               {status === 'analyzing' && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-accent/20 overflow-hidden">
                    <div className="h-full bg-accent w-1/3 animate-[translateX_1.5s_infinite_linear]" style={{animationName: 'shimmer', animationDuration: '1.5s', animationIterationCount: 'infinite'}}></div>
                  </div>
               )}

               {/* Header / Score */}
               <div className="flex items-center justify-between border-b border-white/10 pb-6">
                 <div>
                    <h2 className="text-xl font-bold text-white mb-1">
                      {result?.contract_type || (status === 'analyzing' ? 'Identifying document...' : 'Contract')}
                    </h2>
                    <p className="text-sm text-gray-400">Analysis Results</p>
                 </div>
                 {result && (
                   <div className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl border ${getScoreColor(result.attention_score)}`}>
                     <span className="text-xs font-bold uppercase tracking-wide opacity-80">Risk Score</span>
                     <span className="text-2xl font-black">{result.attention_score}/10</span>
                     <span className="text-xs font-semibold">{result.score_label}</span>
                   </div>
                 )}
               </div>

               {/* Summary Stream */}
               <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Plain English Summary</h3>
                  <div 
                    ref={summaryRef}
                    className="bg-black/30 p-4 rounded-xl border border-white/5 text-gray-200 leading-relaxed max-h-48 overflow-y-auto custom-scrollbar"
                  >
                    {summary || (status === 'analyzing' ? <span className="animate-pulse">Reading contract...</span> : '')}
                  </div>
               </div>

               {/* Key Points */}
               {result && result.key_points.length > 0 && (
                 <div className="animate-fade-in">
                   <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                     <CheckCircle className="w-4 h-4 text-accent" /> Key Points
                   </h3>
                   <ul className="space-y-2">
                     {result.key_points.map((pt, i) => (
                       <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                         <span className="text-accent mt-0.5">•</span>
                         <span>{pt}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
               )}

               {/* Red Flags */}
               {result && (
                 <div className="animate-fade-in mt-2">
                   <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                     <AlertCircle className="w-4 h-4 text-risk-high" /> Red Flags & Concerns
                   </h3>
                   {result.red_flags.length === 0 ? (
                      <p className="text-risk-low text-sm bg-risk-low/10 p-3 rounded-lg border border-risk-low/20">
                        No major red flags detected. Looks standard!
                      </p>
                   ) : (
                     <div className="space-y-3">
                       {result.red_flags.map((flag, i) => (
                         <div key={i} className={`p-4 rounded-xl border flex items-start gap-3 ${
                           flag.severity === 'high' ? 'bg-risk-high/10 border-risk-high/20' :
                           flag.severity === 'medium' ? 'bg-risk-med/10 border-risk-med/20' :
                           'bg-white/5 border-white/10'
                         }`}>
                           <div className={`mt-0.5 shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold font-mono ${
                             flag.severity === 'high' ? 'bg-risk-high text-white' :
                             flag.severity === 'medium' ? 'bg-risk-med text-navy' :
                             'bg-gray-400 text-navy'
                           }`}>!</div>
                           <div>
                             <h4 className={`font-semibold text-sm mb-1 ${
                               flag.severity === 'high' ? 'text-risk-high' :
                               flag.severity === 'medium' ? 'text-risk-med' :
                               'text-gray-300'
                             }`}>{flag.clause}</h4>
                             <p className="text-sm text-gray-400">{flag.concern}</p>
                           </div>
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
               )}
            </div>
          )}
        </div>
        
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};

export default Analyzer;
