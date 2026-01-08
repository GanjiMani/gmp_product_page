import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Calendar, Search } from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/observation-analysis', label: 'Analysis', icon: Search },
    { path: '/request-demo', label: 'Request a Demo', icon: Calendar },
  ];

  return (
    <nav className="glass-effect sticky top-0 z-50 border-b border-gray-200/50 backdrop-blur-xl bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300 bg-white">
              <img
                src={logo}
                alt="CompliSense Logo"
                className="h-8 w-auto"
              />
            </div>

            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CompliSense
              </span>
              <p className="text-xs text-gray-500 -mt-1">cGMP Intelligence Platform</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center space-x-2 px-5 py-2.5 rounded-xl transition-all duration-300 font-medium ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                      : 'text-gray-700 hover:bg-gray-100/80 hover:text-blue-600'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive(item.path) ? 'text-white' : ''}`} />
                  <span>{item.label}</span>
                  {isActive(item.path) && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


