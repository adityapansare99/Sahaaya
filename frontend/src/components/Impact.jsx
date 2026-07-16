import React, { useContext, useEffect, useState } from 'react';
import { Heart, Users, Building, Recycle, Award, Calendar, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { formatAmount } from '../utils/formatDonation';

const Impact = () => {
  const { backendurl, token } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchImpact = async () => {
      try {
        const response = await axios.get(`${backendurl}donor/impact`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setData(response.data.data);
        } else {
          toast.error('Failed to load impact data');
        }
      } catch (error) {
        toast.error('Error fetching impact data');
      } finally {
        setLoading(false);
      }
    };
    fetchImpact();
  }, [backendurl, token]);

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl p-6 animate-pulse bg-gray-100">
              <div className="h-12 w-12 bg-gray-200 rounded-2xl mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Impact</h2>
        <p className="text-gray-600 mb-8">See the difference you're making in the community</p>
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No donations yet</h3>
          <p className="text-gray-500">Create your first donation to start making an impact.</p>
        </div>
      </div>
    );
  }

  const { totalDonations, completed, accepted, pending, ngosConnected, totalMealsDonated, wasteReduced, peopleServed, recentActivity, monthlyTrend } = data;

  const achievements = [
    { title: 'First Donation', desc: 'Made your first food donation', unlocked: totalDonations >= 1, icon: Award },
    { title: 'Generous Giver', desc: 'Completed 10+ food donations', unlocked: completed >= 10, icon: Heart },
    { title: 'Community Hero', desc: 'Served 100+ people', unlocked: peopleServed >= 100, icon: Users },
    { title: 'Eco Warrior', desc: 'Reduced 50kg+ food waste', unlocked: wasteReduced >= 50, icon: Recycle },
  ];

  const statusIcon = (s) => {
    if (s === 'Completed') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (s === 'Accepted') return <Clock className="w-4 h-4 text-yellow-500" />;
    return <Clock className="w-4 h-4 text-blue-400" />;
  };

  const maxTrend = monthlyTrend && monthlyTrend.length > 0
    ? Math.max(...monthlyTrend.map(m => m.donations), 1) : 1;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Impact</h2>
        <p className="text-gray-600">See the difference you're making in the community</p>
      </div>

      {/* Hero — total meals donated */}
      <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-2xl p-6 md:p-8 text-white mb-8">
        <p className="text-red-100 text-sm font-medium mb-1">Total Meals Donated</p>
        <div className="text-4xl md:text-5xl font-bold mb-1">{totalMealsDonated.toLocaleString()}</div>
        <p className="text-red-200 text-sm">
          <span className="text-green-300 font-semibold">{completed} completed</span>
          {' · '}{accepted} accepted · {pending} pending
        </p>
      </div>

      {/* 3 pillar cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 rounded-2xl p-6">
          <div className="bg-green-500 p-3 rounded-2xl w-fit mb-4">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{peopleServed.toLocaleString()}</div>
          <p className="text-sm font-medium text-gray-700">People Served</p>
          <p className="text-xs text-gray-500 mt-1">Lives touched through your generosity</p>
        </div>

        <div className="bg-blue-50 rounded-2xl p-6">
          <div className="bg-blue-500 p-3 rounded-2xl w-fit mb-4">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{ngosConnected}</div>
          <p className="text-sm font-medium text-gray-700">NGOs Partnered</p>
          <p className="text-xs text-gray-500 mt-1">Organizations you've supported</p>
        </div>

        <div className="bg-purple-50 rounded-2xl p-6">
          <div className="bg-purple-500 p-3 rounded-2xl w-fit mb-4">
            <Recycle className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{wasteReduced} kg</div>
          <p className="text-sm font-medium text-gray-700">Waste Reduced</p>
          <p className="text-xs text-gray-500 mt-1">Environmental impact saved</p>
        </div>
      </div>

      {/* Monthly trend + Recent activity */}
      <div className="grid lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-800">Monthly Donations</h3>
          </div>
          {monthlyTrend && monthlyTrend.length > 0 ? (
            <div className="flex items-end justify-between gap-2 h-40">
              {monthlyTrend.map((item, i) => {
                const pct = maxTrend > 0 ? (item.donations / maxTrend) * 100 : 0;
                const isMax = item.donations === maxTrend;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-xs font-semibold text-gray-700">{item.donations}</span>
                    <div className={`w-full rounded-lg transition-all duration-500 ${isMax ? 'bg-gradient-to-t from-red-500 to-red-400' : 'bg-red-200'}`}
                      style={{ height: `${Math.max(pct, 4)}%` }}></div>
                    <span className="text-xs text-gray-500">{item.month}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-6">No monthly data yet</p>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
          </div>
          {recentActivity && recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  {statusIcon(a.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{a.foodType}</p>
                    <p className="text-xs text-gray-500">{formatAmount(a)}{a.ngo ? ` → ${a.ngo}` : ''}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    a.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    a.status === 'Accepted' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>{a.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-6">No activity yet</p>
          )}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-800">Achievements</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {achievements.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                a.unlocked ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200 opacity-60'
              }`}>
                <div className={`p-2 rounded-xl ${a.unlocked ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{a.title}</h4>
                  <p className="text-sm text-gray-600">{a.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Impact;