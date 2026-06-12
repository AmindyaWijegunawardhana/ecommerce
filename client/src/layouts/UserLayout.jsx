import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import backgroundImage from '../assets/background.jpg';

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen relative bg-slate-50/40">
      {/* Brand logo background watermark */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.05] pointer-events-none bg-center bg-no-repeat sm:bg-[length:600px_600px] bg-[length:350px_350px]"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="relative z-10 flex flex-col min-h-screen flex-grow">
        <Navbar />
        <main className="flex-grow relative z-10">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default UserLayout;
