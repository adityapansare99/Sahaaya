import React, { useState } from 'react';
import { Calendar, User, Package, Filter } from 'lucide-react';

const DonationHistory = () => {
  const [filter, setFilter] = useState('all');
  
  const donations = [
    {
      id: '1',
      date: '2024-01-15',
      donorName: 'Spice Garden Restaurant',
      donorType: 'Restaurant',
      foodType: 'Cooked Meals',
      quantity: '75 portions',
      status: 'Completed',
      value: '₹15,000'
    },
    {
      id: '2',
      date: '2024-01-14',
      donorName: 'Corporate Event - TechCorp',
      donorType: 'Event',
      foodType: 'Mixed Items',
      quantity: '150 portions',
      status: 'Completed',
      value: '₹30,000'
    },
    {
      id: '3',
      date: '2024-01-13',
      donorName: 'Green Grocers',
      donorType: 'Grocery Store',
      foodType: 'Fresh Produce',
      quantity: '40 kg',
      status: 'Completed',
      value: '₹8,000'
    },
    {
      id: '4',
      date: '2024-01-12',
      donorName: 'Mumbai Bakery',
      donorType: 'Restaurant',
      foodType: 'Baked Items',
      quantity: '50 items',
      status: 'Cancelled',
      value: '₹5,000'
    },
    {
      id: '5',
      date: '2024-01-11',
      donorName: 'Wedding - Sharma Family',
      donorType: 'Event',
      foodType: 'Cooked Meals',
      quantity: '200 portions',
      status: 'Pending Pickup',
      value: '₹40,000'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Pending Pickup': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDonations = filter === 'all' ? donations : donations.filter(d => d.status.toLowerCase().includes(filter));

  const stats = {
    total: donations.length,
    completed: donations.filter(d => d.status === 'Completed').length,
    pending: donations.filter(d => d.status === 'Pending Pickup').length,
    cancelled: donations.filter(d => d.status === 'Cancelled').length
  };

  return (
    <div className="space-y-6 md:ml-2">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Received Donations</h2>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending Pickup</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">Total Received</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-500">Successfully Collected</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-500">Pending Collection</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          <div className="text-sm text-gray-500">Cancelled</div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900">Date</th>
                <th className="text-left p-4 font-semibold text-gray-900">Donor</th>
                <th className="text-left p-4 font-semibold text-gray-900">Food Type</th>
                <th className="text-left p-4 font-semibold text-gray-900">Quantity</th>
                <th className="text-left p-4 font-semibold text-gray-900">Value</th>
                <th className="text-left p-4 font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonations.map((donation, index) => (
                <tr key={donation.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {new Date(donation.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-gray-900">{donation.donorName}</div>
                      <div className="text-sm text-gray-500">{donation.donorType}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{donation.foodType}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-gray-900">{donation.quantity}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-green-600">{donation.value}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                      {donation.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DonationHistory;