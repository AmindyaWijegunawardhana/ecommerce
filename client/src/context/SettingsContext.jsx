import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const SettingsContext = createContext();

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    whatsappNumber: '919876543210',
    deliveryCharge: 50.0,
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/settings`);
      if (res.data) {
        setSettings(res.data);
      }
    } catch (error) {
      console.error('Error fetching global settings:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateGlobalSettings = async (whatsappNumber, deliveryCharge) => {
    try {
      const res = await axios.put(`${API_URL}/api/settings`, { whatsappNumber, deliveryCharge });
      if (res.data) {
        setSettings(res.data);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update settings',
      };
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, updateGlobalSettings, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
