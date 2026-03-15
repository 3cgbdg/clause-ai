import { Link, useLocation } from 'react-router-dom';

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="glass-header sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex shrink-0 items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-bold text-white shadow-lg shadow-accent/20">
                C
              </div>
              <span className="font-bold text-xl tracking-tight text-white">ClauseAI</span>
            </Link>

            <nav className="flex space-x-8">
              <Link
                to="/analyze"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/analyze' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Analyze
              </Link>
              <Link
                to="/pricing"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/pricing' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Pricing
              </Link>
              <SignedIn>
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === '/dashboard' ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
              </SignedIn>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm font-bold text-gray-400 hover:text-white transition-all">
                  Sign In
                </button>
              </SignInButton>
              <Link 
                to="/analyze" 
                className="px-4 py-2 rounded-xl bg-accent hover:bg-blue-600 text-white text-sm font-bold transition-all shadow-lg shadow-accent/20"
              >
                Get Started
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9 border border-white/10 shadow-lg"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
