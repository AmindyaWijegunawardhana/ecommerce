import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle,
  Gift,
  ArrowRight,
  Eye,
  AlertCircle
} from 'lucide-react';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes] = await Promise.all([
        axios.get(`${API_URL}/api/orders/stats`),
        axios.get(`${API_URL}/api/orders`)
      ]);
      setStats(statsRes.data);
      setRecentOrders(ordersRes.data.slice(0, 5)); // Show only top 5 recent orders
      setError('');
    } catch (err) {
      console.error('Error loading dashboard stats:', err.message);
      setError('Failed to load dashboard metrics. Check server status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount).toLocaleString('en-IN')}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Confirmed':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'Processing':
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      case 'Delivered':
        return 'text-emerald-450 bg-emerald-500/10 border-emerald-500/20';
      case 'Cancelled':
      default:
        return 'text-rose-450 bg-rose-500/10 border-rose-500/20';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-slate-900 rounded-xl w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-slate-900 rounded-2xl animate-pulse"></div>)}
        </div>
        <div className="h-96 bg-slate-900 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      
      {/* Page Title & Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white tracking-wide">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time stats and metrics overview</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="text-xs font-semibold py-2 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          Sync Data
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/20 text-rose-350 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Stats Cards Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Products */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between group shadow-sm">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Total Products</p>
              <h3 className="text-2xl font-bold text-white tracking-tight">{stats.totalProducts}</h3>
              <p className="text-[10px] text-slate-450">Items in catalog</p>
            </div>
            <div className="p-3.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Gift className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Total Orders */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between group shadow-sm">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Total Orders</p>
              <h3 className="text-2xl font-bold text-white tracking-tight">{stats.totalOrders}</h3>
              <p className="text-[10px] text-slate-455">Customer checkout count</p>
            </div>
            <div className="p-3.5 rounded-xl bg-dreamy-lavender-550/10 text-dreamy-lavender-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Pending Orders */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between group shadow-sm">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Pending Orders</p>
              <h3 className="text-2xl font-bold text-white tracking-tight">{stats.pendingOrders}</h3>
              <p className="text-[10px] text-amber-400">Awaiting confirmation</p>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Completed Orders */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between group shadow-sm">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Completed Orders</p>
              <h3 className="text-2xl font-bold text-white tracking-tight">{stats.completedOrders}</h3>
              <p className="text-[10px] text-emerald-400 font-semibold">Sales: {formatCurrency(stats.totalSales)}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg text-white">Recent Orders</h3>
            <p className="text-xs text-slate-500 mt-0.5">Track the latest incoming checkout requests</p>
          </div>
          <Link
            to="/admin/orders"
            className="flex items-center gap-1 text-xs font-semibold text-dreamy-lavender-450 hover:text-dreamy-lavender-300 transition-colors"
          >
            See All Orders
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          {recentOrders.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/40 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="p-5">Customer</th>
                  <th className="p-5">Ordered Items</th>
                  <th className="p-5">Grand Total</th>
                  <th className="p-5">Status</th>
                  <th className="p-5">Date</th>
                  <th className="p-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-800/35 transition-colors">
                    <td className="p-5 font-medium">
                      <p className="text-white font-semibold">{order.customerName}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{order.phoneNumber}</p>
                    </td>
                    <td className="p-5 max-w-[240px] truncate">
                      {order.items && Array.isArray(order.items) 
                        ? order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')
                        : 'N/A'
                      }
                    </td>
                    <td className="p-5 font-bold text-white">
                      {formatCurrency(order.grandTotal)}
                    </td>
                    <td className="p-5">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-5 text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="p-5 text-center">
                      <Link
                        to="/admin/orders"
                        className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                        title="Manage Order"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <ShoppingBag className="w-10 h-10 mx-auto text-slate-700 mb-3 animate-pulse" />
              <p>No orders placed yet.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
