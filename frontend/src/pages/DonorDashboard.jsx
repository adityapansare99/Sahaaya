import React, { useState, useEffect, use } from "react";
import { Menu, X } from "lucide-react";
import SidebarD from "../components/SidebarD";
import CreateDonation from "../components/CreateDonation";
import MyDonations from "../components/MyDonations";
import Impact from "../components/Impact";
import SettingsD from "../components/SettingsD";
import { useNavigate } from "react-router-dom";

const DonorDashboard = () => {
  const [activeSection, setActiveSection] = useState("create");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [donations, setDonations] = useState([]);
  const [profile, setProfile] = useState({
    name: "Amit Sharma",
    address: "123 MG Road, Bangalore, Karnataka ",
    phone: "+91 98765 43210",
    pincode: "560001",
  });

  const [impactStats, setImpactStats] = useState({
    totalMealsDonated: 247,
    ngosConnected: 12,
    peopleServed: 823,
    wasteReduced: 78,
  });

  // Initialize with some sample donations
  useEffect(() => {
    const sampleDonations = [
      {
        id: "1",
        foodType: "Cooked Meals",
        quantity: "50 meals",
        pickupLocation: "123 MG Road, Bangalore",
        expiryDate: "2025-01-15",
        expiryTime: "18:00",
        status: "completed",
        createdAt: "2025-01-10",
        acceptedBy: "Akshaya Patra Foundation",
      },
      {
        id: "2",
        foodType: "Fresh Vegetables",
        quantity: "25 kg",
        pickupLocation: "456 Brigade Road, Bangalore",
        expiryDate: "2025-01-14",
        expiryTime: "20:00",
        status: "accepted",
        createdAt: "2025-01-12",
        acceptedBy: "Feeding India",
      },
      {
        id: "3",
        foodType: "Packaged Food",
        quantity: "100 packets",
        pickupLocation: "789 Commercial Street, Bangalore",
        expiryDate: "2025-01-16",
        expiryTime: "19:30",
        status: "pending",
        createdAt: "2025-01-13",
      },
    ];
    setDonations(sampleDonations);
  }, []);

  const handleDonationCreate = (newDonation) => {
    const donation = {
      ...newDonation,
      id: Date.now().toString(),
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setDonations((prev) => [donation, ...prev]);
    setActiveSection("donations");

    // Update impact stats
    setImpactStats((prev) => ({
      ...prev,
      totalMealsDonated: prev.totalMealsDonated + 1,
    }));
  };

  const navigate=useNavigate();

  const handleDonationEdit = (donation) => {
    // In a real app, this would open an edit modal
    console.log("Edit donation:", donation);
  };

  const handleDonationCancel = (donationId) => {
    setDonations((prev) =>
      prev.map((d) => (d.id === donationId ? { ...d, status: "cancelled" } : d))
    );
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "create":
        return <CreateDonation onDonationCreate={handleDonationCreate} />;
      case "donations":
        return (
          <MyDonations
            donations={donations}
            onEdit={handleDonationEdit}
            onCancel={handleDonationCancel}
          />
        );
      case "impact":
        return <Impact stats={impactStats} />;
      case "settings":
        return (
          <SettingsD profile={profile} onProfileUpdate={handleProfileUpdate} />
        );
      default:
        return <CreateDonation onDonationCreate={handleDonationCreate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarD
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-2xl hover:bg-gray-100 transition-colors duration-200"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
          <h1 className="text-xl font-bold text-gray-800">Sahaaya</h1>
          <div className="w-10"></div>
        </div>

        {/* Main Content */}
        <main className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default DonorDashboard;
