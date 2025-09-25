import React from 'react';
import { Heart, Users, Building, Recycle, TrendingUp, Award } from 'lucide-react';

const Impact = ({ stats }) => {
  const impactCards = [
    {
      title: 'Total Meals Donated',
      value: stats.totalMealsDonated.toLocaleString(),
      icon: Heart,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      description: 'Meals shared with love'
    },
    {
      title: 'People Served',
      value: stats.peopleServed.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      description: 'Lives touched through kindness'
    },
    {
      title: 'NGOs Connected',
      value: stats.ngosConnected.toString(),
      icon: Building,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      description: 'Partner organizations'
    },
    {
      title: 'Waste Reduced',
      value: `${stats.wasteReduced} kg`,
      icon: Recycle,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      description: 'Environmental impact saved'
    }
  ];

  const achievements = [
    { title: 'First Donation', description: 'Made your first food donation', unlocked: true },
    { title: 'Generous Giver', description: 'Donated 10+ meals', unlocked: stats.totalMealsDonated >= 10 },
    { title: 'Community Hero', description: 'Served 100+ people', unlocked: stats.peopleServed >= 100 },
    { title: 'Sustainability Champion', description: 'Reduced 50kg+ waste', unlocked: stats.wasteReduced >= 50 },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Impact</h2>
        <p className="text-gray-600">See the difference you're making in the community</p>
      </div>

      {/* Impact Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {impactCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className={`${card.bgColor} rounded-2xl p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} p-3 rounded-2xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{card.value}</h3>
              <p className="text-sm font-medium text-gray-700 mb-2">{card.title}</p>
              <p className="text-xs text-gray-500">{card.description}</p>
            </div>
          );
        })}
      </div>

      {/* Monthly Progress */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Meals This Month</span>
                <span className="font-semibold text-gray-800">47 / 50</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-red-500 h-3 rounded-full transition-all duration-300" style={{ width: '94%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Waste Reduction Goal</span>
                <span className="font-semibold text-gray-800">15 kg / 20 kg</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full transition-all duration-300" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Donation completed - 25 meals</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">New NGO partnership established</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-xl">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Donation pending pickup - 15 meals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Achievements</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <div key={index} className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 ${
              achievement.unlocked 
                ? 'bg-yellow-50 border border-yellow-200' 
                : 'bg-gray-50 border border-gray-200 opacity-60'
            }`}>
              <div className={`p-2 rounded-xl ${
                achievement.unlocked 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-300 text-gray-500'
              }`}>
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{achievement.title}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Impact