import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Gift,
  Tags,
  ShoppingBag,
  Settings as SettingsIcon,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

const AdminSidebar = () => {
  const { logout, admin } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    addToast('Logged out of admin panel', 'info');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Products', path: '/admin/products', icon: <Gift className="w-5 h-5" /> },
    { name: 'Categories', path: '/admin/categories', icon: <Tags className="w-5 h-5" /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag className="w-5 h-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <SettingsIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col w-64 bg-slate-900 text-slate-300 h-screen sticky top-0 border-r border-slate-800">
      
      {/* Header / Brand */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-lg font-bold text-white tracking-wide">Rashi Gifts</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Admin Management</p>
        </div>
        <NavLink
          to="/"
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-400 transition-colors"
          title="Back to Public Site"
        >
          <ArrowLeft className="w-4 h-4" />
        </NavLink>
      </div>

      {/* Admin User Info */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-dreamy-pink-400 to-dreamy-lavender-500 flex items-center justify-center text-white font-semibold shadow-inner text-sm uppercase">
            {admin?.username?.substring(0, 2)}
          </div>
          <div>
            <p className="text-sm font-semibold text-white truncate max-w-[140px]">{admin?.username}</p>
            <p className="text-[10px] text-dreamy-lavender-400 font-semibold tracking-wider uppercase">System {admin?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-grow p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-dreamy-lavender-600 text-white shadow-md shadow-dreamy-lavender-900/10'
                  : 'hover:bg-slate-800 hover:text-slate-100 text-slate-400'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>

    </div>
  );
};

export default AdminSidebar;
