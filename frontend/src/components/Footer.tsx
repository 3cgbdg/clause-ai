import Disclaimer from './Disclaimer';

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-navy/50 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center font-bold text-white text-xs">
              C
            </div>
            <span className="font-semibold text-white">ClauseAI</span>
          </div>
          
          <div className="flex space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
        
        <Disclaimer />
        
        <div className="mt-8 text-center text-xs text-gray-600">
          &copy; {new Date().getFullYear()} ClauseAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
