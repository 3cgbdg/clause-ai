import { Check } from 'lucide-react';

const Pricing = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, transparent pricing</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Start for free, upgrade when you need to analyze more complex contracts.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Tier */}
        <div className="glass p-8 rounded-3xl flex flex-col border border-white/5 relative">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2">Basic</h3>
            <p className="text-gray-400 h-12">Perfect for checking standard everyday agreements.</p>
            <div className="mt-4 flex items-baseline text-5xl font-extrabold">
              $0
              <span className="ml-1 text-xl font-medium text-gray-400">/mo</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8 flex-1">
            {['3 analyzes per month', 'Up to 5 page PDFs (25K chars)', 'Standard speed text analysis', 'Basic risk scoring'].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-300">
                <Check className="w-5 h-5 text-accent shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <button className="w-full py-4 rounded-xl glass font-semibold hover:bg-white/5 transition-colors">
            Get Started Free
          </button>
        </div>

        {/* Pro Tier */}
        <div className="glass p-8 rounded-3xl flex flex-col border border-accent/30 bg-accent/5 relative shadow-2xl shadow-accent/10">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
            <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Most Popular
            </span>
          </div>
          
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2 text-white">Pro</h3>
            <p className="text-gray-400 h-12">For freelancers, renters, and independent professionals.</p>
            <div className="mt-4 flex items-baseline text-5xl font-extrabold text-white">
              $5
              <span className="ml-1 text-xl font-medium text-gray-400">/mo</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8 flex-1">
            {['Unlimited analyzes', 'Up to 50 page PDFs (150K chars)', 'Priority streaming speed', 'Advanced legal phrasing detection', 'Export reports to PDF'].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-white">
                <Check className="w-5 h-5 text-accent shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <button className="w-full py-4 rounded-xl bg-accent text-white font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-accent/25">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
