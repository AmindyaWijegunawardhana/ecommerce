import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';

const AdminLogin = () => {
  const { login, admin, token } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (admin && token) {
      navigate('/admin/dashboard');
    }
  }, [admin, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(username.trim(), password);
      
      if (res.success) {
        addToast('Welcome back, Admin!', 'success');
        navigate('/admin/dashboard');
      } else {
        setError(res.message || 'Invalid username or password');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      
      {/* Back to Home Link */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 text-slate-500 hover:text-white flex items-center gap-1.5 text-xs font-semibold tracking-wide transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to public site
      </button>

      {/* Login Card Container */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl z-10 space-y-8">
        
        {/* Branding header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-dreamy-pink-500 to-dreamy-lavender-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-dreamy-lavender-500/10">
            <Gift className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-wide">Rashi Dreamy Gifts</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Authorized Admin Access</p>
          </div>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm animate-fade-in">
            <AlertCircle className="w-4.5 h-4.5 text-rose-400 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              Username
            </label>
            <input
              type="text"
              required
              disabled={isLoading}
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-dreamy-lavender-500 focus:border-dreamy-lavender-500 disabled:opacity-50"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              Password
            </label>
            <input
              type="password"
              required
              disabled={isLoading}
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-dreamy-lavender-500 focus:border-dreamy-lavender-500 disabled:opacity-50"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-dreamy-lavender-650 to-dreamy-lavender-800 text-white font-semibold text-sm shadow-lg shadow-dreamy-lavender-900/20 hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Authenticating...
              </>
            ) : (
              'Log In to Dashboard'
            )}
          </button>
        </form>
      </div>

      {/* Decorative Blur Background Blobs */}
      <div className="absolute -top-10 -left-10 w-80 h-80 bg-dreamy-pink-900/10 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-dreamy-lavender-900/10 rounded-full blur-3xl opacity-30"></div>

    </div>
  );
};

export default AdminLogin;
