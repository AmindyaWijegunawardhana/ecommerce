import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Settings, Phone, CreditCard, Lock, Sparkles, AlertCircle } from 'lucide-react';
import { SettingsContext } from '../context/SettingsContext';
import { ToastContext } from '../context/ToastContext';

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminSettings = () => {
  const { settings, updateGlobalSettings, refreshSettings } = useContext(SettingsContext);
  const { addToast } = useContext(ToastContext);

  // Shop settings fields
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Password reset fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (settings) {
      setWhatsappNumber(settings.whatsappNumber);
      setDeliveryCharge(settings.deliveryCharge.toString());
    }
  }, [settings]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();

    if (!whatsappNumber.trim() || !deliveryCharge) {
      addToast('Please enter both WhatsApp number and delivery fee', 'error');
      return;
    }

    setIsSavingSettings(true);

    try {
      const res = await updateGlobalSettings(whatsappNumber.trim(), Number(deliveryCharge));
      if (res && res.success === false) {
        addToast(res.message || 'Failed to update settings', 'error');
      } else {
        addToast('Shop configuration saved successfully', 'success');
        refreshSettings();
      }
    } catch (err) {
      addToast('Error saving shop configurations', 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      addToast('All password fields are required', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }

    if (newPassword.length < 5) {
      addToast('New password must be at least 5 characters long', 'error');
      return;
    }

    setIsChangingPassword(true);

    try {
      const res = await axios.put(`${API_URL}/api/auth/password`, { currentPassword, newPassword });
      addToast(res.data.message || 'Password updated successfully', 'success');
      
      // Clear forms
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to update password. Verify current password.', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div class="space-y-10">
      
      {/* Title */}
      <div>
        <h1 class="text-3xl font-serif font-bold text-white tracking-wide">Configuration Settings</h1>
        <p class="text-xs text-slate-500 mt-1 font-light font-sans">Modify global checkout constants and admin security parameters</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* ================= CARD 1: GLOBAL SHOP SETTINGS ================= */}
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div class="border-b border-slate-800 pb-3 flex items-center gap-2.5">
            <div class="p-2 rounded-xl bg-dreamy-lavender-550/10 text-dreamy-lavender-400">
              <Settings class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-serif font-bold text-white text-lg">Checkout configurations</h3>
              <p class="text-[10px] text-slate-500 font-sans mt-0.5">Parameters mapping delivery fee and order routing</p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} class="space-y-5">
            {/* WhatsApp Number */}
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                <Phone class="w-3.5 h-3.5 text-slate-500" />
                Business WhatsApp Number
              </label>
              <input
                type="text"
                required
                placeholder="Include country code, e.g. 919876543210"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                class="p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-dreamy-lavender-500"
              />
              <p class="text-[9px] text-slate-500 font-light italic">
                Enter digits only, including country code (e.g. 91 for India), no symbols or leading zeros.
              </p>
            </div>

            {/* Delivery Charge */}
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                <CreditCard class="w-3.5 h-3.5 text-slate-500" />
                Flat Delivery Fee (Rs.)
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 50"
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(e.target.value)}
                class="p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-dreamy-lavender-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSavingSettings}
              class="w-full py-3.5 rounded-xl bg-dreamy-lavender-600 hover:bg-dreamy-lavender-750 text-white font-semibold text-xs transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {isSavingSettings ? 'Saving details...' : 'Save Configuration'}
            </button>
          </form>
        </div>

        {/* ================= CARD 2: PASSWORD CHANGE ================= */}
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div class="border-b border-slate-800 pb-3 flex items-center gap-2.5">
            <div class="p-2 rounded-xl bg-rose-500/10 text-rose-455">
              <Lock class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-serif font-bold text-white text-lg">Change Admin Password</h3>
              <p class="text-[10px] text-slate-500 font-sans mt-0.5">Maintain system security by updating secrets</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} class="space-y-4">
            
            {/* Current Password */}
            <div class="flex flex-col gap-1">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Current Password</label>
              <input
                type="password"
                required
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                class="p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            {/* New Password */}
            <div class="flex flex-col gap-1">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">New Password</label>
              <input
                type="password"
                required
                placeholder="Enter new password (min 5 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                class="p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            {/* Confirm New Password */}
            <div class="flex flex-col gap-1">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Confirm New Password</label>
              <input
                type="password"
                required
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                class="p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              class="w-full py-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-450 hover:text-white font-semibold text-xs transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isChangingPassword ? 'Modifying Password...' : 'Change Password'}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default AdminSettings;
