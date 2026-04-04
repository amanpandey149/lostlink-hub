import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Search, Home, LayoutDashboard, Sun, Moon, Bell, Menu, X } from "lucide-react";

const Navbar = ({ theme, toggleTheme }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Dummy notifications
  const notifications = [
    { id: 1, text: "A new item matching your report was found!", time: "2 hours ago", unread: true },
    { id: 2, text: "You successfully logged in.", time: "1 day ago", unread: false },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-100 dark:border-gray-800 transition-colors duration-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo / App Name */}
          <Link to="/" className="flex items-center space-x-3 group perspective">
            <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transform transition duration-500 group-hover:tracking-wider">
              Campus Connect
            </span>
          </Link>

          {/* Desktop Navigation Links and Icons */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex space-x-1 mr-4 bg-gray-50/50 dark:bg-slate-800/50 p-1 rounded-2xl border border-gray-100 dark:border-slate-700">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive ? "bg-white dark:bg-slate-700 text-primary dark:text-blue-400 font-semibold shadow-sm" : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-700/50"
                  }`
                }
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </NavLink>

              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive ? "bg-white dark:bg-slate-700 text-primary dark:text-blue-400 font-semibold shadow-sm" : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-700/50"
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </NavLink>
            </div>

            {/* Notifications Toggle */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-300 relative group"
              >
                <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-800"></span>
              </button>

              {/* Notification Dropdown UI */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-premium border border-gray-100 dark:border-slate-700 z-50 transform origin-top-right transition-all animate-dropdown">
                  <div className="p-4 border-b border-gray-50 dark:border-slate-700/50 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">2 New</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-2">
                    {notifications.map(notif => (
                      <div key={notif.id} className={`p-3 mb-1 rounded-xl text-sm transition-all cursor-pointer ${notif.unread ? 'bg-blue-50/50 dark:bg-slate-700/50 hover:bg-blue-50 dark:hover:bg-slate-700' : 'hover:bg-gray-50 dark:hover:bg-slate-700/30'}`}>
                        <p className={`mb-1 ${notif.unread ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-600 dark:text-gray-300'}`}>{notif.text}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{notif.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-300 group"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 group-hover:scale-110 group-hover:text-yellow-400 transition-transform" /> : <Moon className="w-5 h-5 group-hover:scale-110 group-hover:text-primary transition-transform" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button 
              onClick={toggleTheme} 
              className="p-2 text-gray-500 dark:text-gray-400 rounded-xl transition-all"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass border-t border-gray-100 dark:border-slate-700 absolute w-full left-0 animate-fade-in-up">
          <div className="px-4 py-4 space-y-2">
            <NavLink
              to="/"
              onClick={toggleMobileMenu}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl transition-all ${
                  isActive ? "bg-primary/10 text-primary font-semibold" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                }`
              }
            >
              <Home className="w-5 h-5 mr-3" />
              Home
            </NavLink>
            <NavLink
              to="/dashboard"
              onClick={toggleMobileMenu}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl transition-all ${
                  isActive ? "bg-primary/10 text-primary font-semibold" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Dashboard
            </NavLink>
            
            {/* Mobile Notifications (Just links for mobile UX) */}
            <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
              <h4 className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recent Activity</h4>
              {notifications.map(notif => (
                <div key={notif.id} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                  <span className="block mb-1">{notif.text}</span>
                  <span className="text-xs text-gray-400">{notif.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
