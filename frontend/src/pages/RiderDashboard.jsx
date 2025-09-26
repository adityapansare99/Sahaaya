import React, { useState } from 'react';
import SidebarR from '../components/SidebarR';
import AvailableDeliveries from '../components/AvailableDeliveries';
import ActiveDelivery from '../components/ActiveDelivery';
import DeliveryHistory from '../components/DeliveryHistory';
import RewardsSection from '../components/RewardsSection';
import ProfileSection from '../components/ProfileSection';

const RiderDashboard = () => {
  const [activeSection, setActiveSection] = useState('deliveries');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'deliveries':
        return <AvailableDeliveries />;
      case 'active':
        return <ActiveDelivery setActiveSection={setActiveSection} />;
      case 'history':
        return <DeliveryHistory />;
      case 'rewards':
        return <RewardsSection />;
      case 'profile':
        return <ProfileSection />;
      default:
        return <AvailableDeliveries />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarR 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex-1 lg:ml-64 transition-all duration-300">
        <div className="p-4 lg:p-8">
          <div className="mb-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mb-4 p-2 rounded-lg bg-white shadow-sm border"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, Alex! 🚴‍♂️
            </h1>
            <p className="text-gray-600 mt-2">Ready to make a difference today?</p>
          </div>
          
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default RiderDashboard