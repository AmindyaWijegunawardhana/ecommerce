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

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes] = await Promise.all([
        axios.get('/api/orders/stats'),
        axios.get('/api/orders')
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
      <div class="space-y-6">
        <div class="h-10 bg-slate-900 rounded-xl w-1/4 animate-pulse"></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} class="h-28 bg-slate-900 rounded-2xl animate-pulse"></div>)}
        </div>
        <div class="h-96 bg-slate-900 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div class="space-y-10">
      
      {/* Page Title & Refresh */}
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-serif font-bold text-white tracking-wide">Dashboard</h1>
          <p class="text-xs text-slate-500 mt-1">Real-time stats and metrics overview</p>
        </div>
        <button
          onClick={fetchDashboardData}
          class="text-xs font-semibold py-2 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          Sync Data
        </button>
      </div>

      {error && (
        <div class="flex items-center gap-2.5 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/20 text-rose-350 text-sm">
          <AlertCircle class="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Stats Cards Grid */}
      {stats && (
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Revenue */}
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between group shadow-sm">
            <div class="space-y-2">
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-widest">Total Sales</p>
              <h3 class="text-2xl font-bold text-white tracking-tight">{formatCurrency(stats.totalSales)}</h3>
              <p class="text-[10px] text-emerald-400">Delivered Orders only</p>
            </div>
            <div class="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp class="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Total Orders */}
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between group shadow-sm">
            <div class="space-y-2">
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-widest">Total Orders</p>
              <h3 class="text-2xl font-bold text-white tracking-tight">{stats.totalOrders}</h3>
              <p class="text-[10px] text-slate-400">Received orders count</p>
            </div>
            <div class="p-3.5 rounded-xl bg-dreamy-lavender-550/10 text-dreamy-lavender-400">
              <ShoppingBag class="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Pending Orders */}
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between group shadow-sm">
            <div class="space-y-2">
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-widest">Pending Orders</p>
              <h3 class="text-2xl font-bold text-white tracking-tight">{stats.pendingOrders}</h3>
              <p class="text-[10px] text-amber-400">Awaiting confirmation</p>
            </div>
            <div class="p-3.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock class="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Total Products */}
          <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between group shadow-sm">
            <div class="space-y-2">
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-widest">Products</p>
              <h3 class="text-2xl font-bold text-white tracking-tight">{stats.totalProducts}</h3>
              <p class="text-[10px] text-slate-400">Total items in catalog</p>
            </div>
            <div class="p-3.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Gift class="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders Section */}
      <div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div class="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 class="font-serif font-bold text-lg text-white">Recent Orders</h3>
            <p class="text-xs text-slate-500 mt-0.5">Track the latest incoming checkout requests</p>
          </div>
          <Link
            to="/admin/orders"
            class="flex items-center gap-1 text-xs font-semibold text-dreamy-lavender-450 hover:text-dreamy-lavender-300 transition-colors"
          >
            See All Orders
            <ArrowRight class="w-4 h-4" />
          </Link>
        </div>

        <div class="overflow-x-auto">
          {recentOrders.length > 0 ? (
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-950/40 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th class="p-5">Customer</th>
                  <th class="p-5">Ordered Items</th>
                  <th class="p-5">Grand Total</th>
                  <th class="p-5">Status</th>
                  <th class="p-5">Date</th>
                  <th class="p-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/60 text-sm text-slate-300">
                {recentOrders.map((order) => (
                  <tr key={order._id} class="hover:bg-slate-800/35 transition-colors">
                    <td class="p-5 font-medium">
                      <p class="text-white font-semibold">{order.customerName}</p>
                      <p class="text-xs text-slate-500 mt-0.5">{order.phoneNumber}</p>
                    </td>
                    <td class="p-5 max-w-[240px] truncate">
                      {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                    </td>
                    <td class="p-5 font-bold text-white">
                      {formatCurrency(order.grandTotal)}
                    </td>
                    <td class="p-5">
                      <span class={`inline-block px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td class="p-5 text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td class="p-5 text-center">
                      <Link
                        to="/admin/orders"
                        class="inline-flex items-center justify-center p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                        title="Manage Order"
                      >
                        <Eye class="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div class="text-center py-12 text-slate-500">
              <ShoppingBag class="w-10 h-10 mx-auto text-slate-700 mb-3 animate-pulse" />
              <p>No orders placed yet.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
