import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import { useHistory } from '../hooks/useHistory';
import { Link } from 'react-router-dom';
import { Clock, FileText, AlertTriangle, CheckCircle, ArrowRight, RefreshCcw, Loader2 } from 'lucide-react';

const getRiskColor = (score: number) => {
  if (score <= 3) return 'text-risk-low bg-risk-low/10 border-risk-low/30';
  if (score <= 6) return 'text-risk-med bg-risk-med/10 border-risk-med/30';
  return 'text-risk-high bg-risk-high/10 border-risk-high/30';
};

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const DashboardContent = () => {
  const { user } = useUser();
  const { items, loading, error, refetch } = useHistory();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      {/* Header */}
      <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Dashboard</p>
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome back, {user?.firstName ?? 'User'} 👋
          </h1>
          <p className="text-gray-400 mt-2">Your past contract analyses are stored below.</p>
        </div>
        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent text-white font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-accent/20 hover:-translate-y-0.5 active:scale-95"
        >
          New Analysis <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Scans', value: items.length, icon: FileText },
          {
            label: 'High Risk',
            value: items.filter((i) => i.attention_score >= 7).length,
            icon: AlertTriangle,
            color: 'text-risk-high',
          },
          {
            label: 'Low Risk',
            value: items.filter((i) => i.attention_score <= 3).length,
            icon: CheckCircle,
            color: 'text-risk-low',
          },
          {
            label: 'This Month',
            value: items.filter((i) => {
              const date = new Date(i.created_at);
              const now = new Date();
              return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            }).length,
            icon: Clock,
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass p-5 rounded-2xl border border-white/5">
            <Icon className={`w-5 h-5 mb-3 ${color ?? 'text-accent'}`} />
            <div className="text-3xl font-black">{value}</div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* History List */}
      <div className="glass rounded-3xl border border-white/5 overflow-hidden">
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/5">
          <h2 className="font-black text-sm uppercase tracking-[0.15em] text-gray-400">Analysis History</h2>
          <button
            onClick={() => void refetch()}
            className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
            title="Refresh"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}

        {error && (
          <div className="p-8 text-center text-risk-high text-sm">
            <AlertTriangle className="w-8 h-8 mx-auto mb-3 opacity-60" />
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="py-24 text-center">
            <FileText className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <h3 className="text-gray-400 font-semibold text-lg mb-2">No analyses yet</h3>
            <p className="text-gray-600 text-sm mb-6">Scan your first contract to see it appear here.</p>
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent text-white font-bold text-sm hover:bg-blue-600 transition-all"
            >
              Start Analyzing <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {!loading && items.length > 0 && (
          <ul className="divide-y divide-white/5">
            {items.map((item) => (
              <li
                key={item.id}
                className="px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-white/2 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <FileText className="w-4 h-4 text-gray-500 shrink-0" />
                    <h3 className="font-bold text-white truncate">{item.contract_type ?? 'Contract'}</h3>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed pl-7">
                    {item.summary ?? 'No summary available.'}
                  </p>
                  <div className="flex items-center gap-2 mt-2 pl-7">
                    <Clock className="w-3 h-3 text-gray-600" />
                    <span className="text-[11px] text-gray-600">{formatDate(item.created_at)}</span>
                    {item.input_length && (
                      <span className="text-[11px] text-gray-700">
                        · {(item.input_length / 1000).toFixed(1)}K chars
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div
                    className={`px-3 py-1.5 rounded-xl border text-xs font-black uppercase tracking-wider ${getRiskColor(item.attention_score)}`}
                  >
                    {item.attention_score}/10
                  </div>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
                    {item.score_label}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <>
      <SignedIn>
        <DashboardContent />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default Dashboard;
