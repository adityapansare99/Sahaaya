import React from 'react';
import { TrendingUp, Users, Package, Leaf, Award, Heart } from 'lucide-react';

const Analytics = () => {
  const metrics = [
    {
      title: 'Total Meals Received',
      value: '18,650',
      change: '+23%',
      changeType: 'increase',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Connected Donors',
      value: '287',
      change: '+12%',
      changeType: 'increase',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Meals Distributed',
      value: '17,420',
      change: '+25%',
      changeType: 'increase',
      icon: Heart,
      color: 'bg-[#ef4f5f]'
    },
    {
      title: 'Food Waste Prevented',
      value: '2,840 kg',
      change: '+18%',
      changeType: 'increase',
      icon: Leaf,
      color: 'bg-emerald-500'
    }
  ];

  const monthlyData = [
    { month: 'Jan', donations: 85, meals: 1200 },
    { month: 'Feb', donations: 92, meals: 1350 },
    { month: 'Mar', donations: 78, meals: 1100 },
    { month: 'Apr', donations: 105, meals: 1500 },
    { month: 'May', donations: 118, meals: 1650 },
    { month: 'Jun', donations: 134, meals: 1850 }
  ];

  const topDonors = [
    { name: 'TechCorp Events', donations: 45, meals: 2250 },
    { name: 'Golden Palace Restaurant', donations: 38, meals: 1900 },
    { name: 'Fresh Market Chain', donations: 32, meals: 800 },
    { name: 'Community Wedding Hall', donations: 28, meals: 1400 },
    { name: 'City Bakery Group', donations: 25, meals: 750 }
  ];

  return (
    <div className="space-y-6 md:ml-2">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[#ef4f5f]" />
          <span className="text-sm text-gray-600">Impact Dashboard</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${metric.color} rounded-xl flex items-center justify-center`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-semibold text-green-500">{metric.change}</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
            <div className="text-sm text-gray-500">{metric.title}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Donations Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Collection Trends</h3>
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium text-gray-600">{data.month}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-1">
                    <span className="text-sm text-gray-900 w-20">Collections</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-[#ef4f5f] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(data.donations / 150) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">{data.donations}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 w-20">Distributed</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(data.meals / 2000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">{data.meals}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Donors */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Donors This Month</h3>
          <div className="space-y-4">
            {topDonors.map((donor, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className="w-8 h-8 bg-gradient-to-br from-[#ef4f5f] to-[#d63447] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{donor.name}</div>
                  <div className="text-sm text-gray-500">{donor.donations} donations • {donor.meals} meals</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-[#ef4f5f]">{donor.donations}</div>
                  <div className="text-xs text-gray-500">donations</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="bg-gradient-to-r from-[#ef4f5f] to-[#d63447] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-6 h-6" />
          <h3 className="text-xl font-bold">Monthly Impact Summary</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">134</div>
            <div className="text-sm opacity-90">Successful Collections</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">₹2.8L</div>
            <div className="text-sm opacity-90">Food Value Received</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">95%</div>
            <div className="text-sm opacity-90">Collection Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;