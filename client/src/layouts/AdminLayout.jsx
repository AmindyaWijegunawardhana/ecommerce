import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout = () => {
  const { admin, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white gap-4">
        {/* Dreamy loading spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-dreamy-lavender-500 animate-spin"></div>
        </div>
        <p className="text-sm font-medium text-slate-400 tracking-wide">Securing connection...</p>
      </div>
    );
  }

  // Redirect to login if not logged in
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex bg-slate-950 text-slate-100 min-h-screen">
      <AdminSidebar />
      <main className="flex-grow h-screen overflow-y-auto bg-slate-950 p-6 md:p-10">
        <div className="max-w-6xl mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
