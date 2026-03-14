import { ArrowRight, CheckCircle, FileText, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/20 text-accent text-sm font-medium mb-8">
          <Zap className="w-4 h-4" />
          <span>ClauseAI MVP Now Live</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-r from-white via-white to-gray-400">
          Understand any contract <br className="hidden md:block" />
          <span className="text-accent">in 10 seconds.</span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-gray-400 mb-10 leading-relaxed">
          Don't sign blind. Paste your lease, NDA, or freelance agreement and instantly get a plain-English summary, a risk score, and all the hidden red flags.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            to="/analyze"
            className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-xl bg-accent hover:bg-blue-600 text-white font-semibold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-accent/25"
          >
            Start analyzing free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-xl glass text-white font-semibold text-lg hover:bg-white/5 transition-all"
          >
            See how it works
          </a>
        </div>
      </section>

      {/* How It Works Layer */}
      <section id="how-it-works" className="w-full py-24 bg-black/20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">No legal degree required</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Get absolute clarity on what you are signing in three simple steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass p-8 flex flex-col items-center text-center relative overflow-hidden group">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-2xl font-bold text-accent group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload or Paste</h3>
              <p className="text-gray-400">
                Simply paste the text of your contract or upload a clean PDF (up to 50 pages).
              </p>
            </div>
            
            <div className="glass p-8 flex flex-col items-center text-center relative overflow-hidden group">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-2xl font-bold text-accent group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
              <p className="text-gray-400">
                Our AI instantly reads the document, searching for standard clauses and tricky phrasing.
              </p>
            </div>

            <div className="glass p-8 flex flex-col items-center text-center relative overflow-hidden group">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-2xl font-bold text-accent group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Clarity</h3>
              <p className="text-gray-400">
                Receive a plain-English summary, a risk score, and detailed red flags for hidden traps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Sample Output Preview */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="glass rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row items-center gap-12 border-accent/20 bg-linear-to-br from-accent/10 to-transparent relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="flex-1 z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Catch the hidden traps before it's too late.</h2>
            <ul className="space-y-4 mb-8">
              {[
                "Unfair non-compete clauses",
                "Automatic renewal traps",
                "Hidden liability waivers",
                "Unexpected termination fees"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-risk-low shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 text-accent font-semibold hover:text-blue-400 transition-colors"
            >
              Try it with a sample lease <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex-1 w-full z-10">
            <div className="bg-navy/80 rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold text-gray-200">Lease_Agreement_2026.pdf</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-risk-med/20 text-risk-med text-xs font-bold ring-1 ring-risk-med/30">
                  Worth Reviewing
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-white/5 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse"></div>
                <div className="mt-6 p-4 rounded-xl bg-risk-high/10 border border-risk-high/20">
                  <div className="flex items-start gap-3">
                    <span className="text-risk-high mt-1 text-sm font-bold">!</span>
                    <div>
                      <h4 className="font-semibold text-risk-high text-sm mb-1">Auto-Renewal Trap</h4>
                      <p className="text-xs text-gray-400">Renews automatically for 12 months unless 60 days written notice is given.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
