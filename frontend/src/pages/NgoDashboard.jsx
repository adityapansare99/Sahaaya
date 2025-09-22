import React, { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import FoodRequests from '../components/FoodRequests';
import DonationHistory from '../components/DonationHistory';
import Analytics from '../components/Analytics';
import Settings from '../components/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('requests');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'requests':
        return <FoodRequests />;
      case 'history':
        return <DonationHistory />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <FoodRequests />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      {/* Main Content */}
      <div className="lg:ml-64">
        <main className="p-6 lg:p-8 pt-16 lg:pt-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;