import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ShoppingBag, Eye, X, Mail, Phone, MapPin, CheckCircle, Calendar, AlertCircle } from 'lucide-react';
import { ToastContext } from '../context/ToastContext';
import { resolveImageUrl } from '../utils/api';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminOrders = () => {
  const { addToast } = useContext(ToastContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected Order for detail view
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/orders`);
      setOrders(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch orders from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await axios.put(`${API_URL}/api/orders/${orderId}/status`, { status: newStatus });
      addToast(`Order status updated to ${newStatus}`, 'success');
      
      // Update local state arrays
      setOrders((prev) => prev.map((ord) => (ord._id === orderId ? res.data : ord)));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(res.data);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to update order status. Check stock bounds.', 'error');
    }
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
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Cancelled':
      default:
        return 'text-rose-450 bg-rose-500/10 border-rose-500/20';
    }
  };

  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount).toLocaleString('en-IN')}`;
  };

  if (loading && orders.length === 0) {
    return <div className="text-center text-slate-500 py-20">Loading order books...</div>;
  }

  return (
    <div className="space-y-10">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-white tracking-wide">Orders Registry</h1>
        <p className="text-xs text-slate-500 mt-1 font-light">View customer details, update shipping stages, and monitor transactions</p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-305 text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Orders List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {orders.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/40 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="p-5">Customer info</th>
                <th className="p-5">Summary items</th>
                <th className="p-5">Grand total</th>
                <th className="p-5">Delivery status</th>
                <th className="p-5">Order Date</th>
                <th className="p-5 text-right">View details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-800/35 transition-colors">
                  <td className="p-5">
                    <p className="font-bold text-white leading-snug">{order.customerName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{order.phoneNumber}</p>
                  </td>
                  <td className="p-5 max-w-[200px] truncate text-slate-400 font-light">
                    {order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                  </td>
                  <td className="p-5 font-bold text-white">
                    {formatCurrency(order.grandTotal)}
                  </td>
                  <td className="p-5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-5 text-slate-500 font-light">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="p-5 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Inspect Order Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-20">
            <ShoppingBag className="w-12 h-12 text-slate-800 mx-auto mb-4 animate-pulse" />
            <h3 className="font-serif font-bold text-white text-lg">No Orders Placed</h3>
            <p className="text-slate-500 text-xs mt-1 font-light">Checkout orders placed by client appear here.</p>
          </div>
        )}
      </div>

      {/* ================= ORDER DETAILS DRAWER OVERLAY ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Drawer overlay */}
          <div onClick={() => setSelectedOrder(null)} className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"></div>

          {/* Drawer Container */}
          <div className="relative w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full p-6 sm:p-8 flex flex-col z-10 shadow-2xl animate-fade-in text-slate-300">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <h3 className="font-serif font-bold text-white text-xl">Order Invoice Details</h3>
                <span className="text-[10px] text-slate-550 font-bold uppercase tracking-widest">ID: {selectedOrder._id}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable details */}
            <div className="flex-grow overflow-y-auto space-y-6 pr-1">
              
              {/* Status Management Bar */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-850 flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order Status</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                  className="py-1.5 px-3 bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold rounded-lg focus:outline-none focus:ring-1 focus:ring-dreamy-lavender-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-1.5">
                  Customer Information
                </h4>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-dreamy-lavender-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Name</p>
                      <p className="text-white font-medium">{selectedOrder.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-dreamy-lavender-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Contact Phone</p>
                      <a href={`tel:${selectedOrder.phoneNumber}`} className="text-white hover:underline font-medium">
                        {selectedOrder.phoneNumber}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-dreamy-lavender-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Shipping Address</p>
                      <p className="text-white leading-relaxed font-light">{selectedOrder.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ordered Products Itemized */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-1.5">
                  Itemized Bill
                </h4>
                <div className="space-y-3.5">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-950/30 border border-slate-850/40">
                      <div className="w-12 h-12 bg-slate-950 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product?.images?.[0] ? (
                          <img src={resolveImageUrl(item.product.images[0])} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-900 text-[10px] font-bold text-slate-650">GIFT</div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-semibold text-white truncate max-w-[200px]">{item.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5 font-light">
                          {formatCurrency(item.price)} x {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-white">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Calculations Breakdown */}
              <div className="space-y-2.5 p-5 bg-slate-950/40 border border-slate-850 rounded-2xl text-sm font-light text-slate-400">
                <div className="flex justify-between">
                  <span>Items total:</span>
                  <span className="text-slate-200 font-medium">{formatCurrency(selectedOrder.itemTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery flat fee:</span>
                  <span className="text-slate-200 font-medium">{formatCurrency(selectedOrder.deliveryCharge)}</span>
                </div>
                <hr className="border-slate-850 my-1" />
                <div className="flex justify-between text-base font-bold text-white">
                  <span>Grand total:</span>
                  <span className="text-dreamy-lavender-400">{formatCurrency(selectedOrder.grandTotal)}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrders;
