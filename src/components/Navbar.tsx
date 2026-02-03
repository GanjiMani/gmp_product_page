import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Calendar, Search } from 'lucide-react';
import logo from '../assets/fda-image.png';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/investigators', label: 'Investigator Details', icon: Search }, // new button
    { path: '/observation-analysis', label: 'Analysis', icon: Search },
    { path: '/request-demo', label: 'Request a Demo', icon: Calendar },

  ];

  return (
    <nav className="glass-effect sticky top-0 z-50 border-b border-gray-200/50 backdrop-blur-xl bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 p-2">
              <img
                src={logo}
                alt="FDA Logo"
                style={{ width: '158px', height: '59px' }}
                className="object-contain"
              />
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
                      ? 'text-white shadow-lg shadow-blue-500/30 scale-105'
                      : 'text-gray-700 hover:bg-gray-100/80 hover:text-blue-600'
                  }`}
                  style={isActive(item.path) ? { backgroundColor: '#1e82c9' } : {}}
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
