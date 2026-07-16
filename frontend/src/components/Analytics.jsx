import React, { useContext, useEffect, useState } from 'react';
import { TrendingUp, Package, Award, Users, Calendar, ChevronUp, ChevronDown, Recycle } from 'lucide-react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const Analytics = () => {
  const { backendurl, token } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`${backendurl}ngo/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setData(response.data.data);
          console.log(response.data.data);
        } else {
          toast.error('Failed to load analytics');
        }
      } catch (error) {
        toast.error('Error fetching analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [backendurl, token]);

  if (loading) {
    return (
      <div className="space-y-6 md:ml-2">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-6 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
            <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 mb-4">
                <div className="w-10 h-4 bg-gray-200 rounded"></div>
                <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
            <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6 md:ml-2">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <div className="bg-white rounded-2xl p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No data yet</h3>
          <p className="text-gray-500">Start receiving donations to see your analytics here.</p>
        </div>
      </div>
    );
  }

  const { total, completed, accepted, cancelled, pending, topDonors, monthlyTrend, peopleServed, wasteReduced, avgServes, avgWeight, momChange } = data;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const activeNow = accepted + pending;
  const maxDonation = monthlyTrend && monthlyTrend.length > 0
    ? Math.max(...monthlyTrend.map(m => m.donations), 1)
    : 1;

  return (
    <div className="space-y-6 md:ml-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Your organization at a glance</p>
        </div>
        <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-xl">
          <Award className="w-5 h-5 text-red-500" />
          <span className="text-sm font-medium text-red-600">{completed}/{total} completed</span>
        </div>
      </div>

      {/* Hero Stat */}
      <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-2xl p-6 md:p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-red-100 text-sm font-medium mb-1">Total Donations Received</p>
            <div className="text-4xl md:text-5xl font-bold mb-2">{total}</div>
            <p className="text-red-200 text-sm">
              <span className="text-green-300 font-semibold">{completed} completed</span>
              {' '}· {pending} pending · {cancelled || 0} cancelled
            </p>
          </div>
          <div className="bg-white/20 rounded-2xl p-4 text-center min-w-[100px]">
            <div className="text-2xl font-bold">{completionRate}%</div>
            <div className="text-xs text-red-100 mt-1">Success Rate</div>
          </div>
        </div>
        <div className="mt-4 w-full bg-white/20 rounded-full h-2">
          <div className="bg-white h-2 rounded-full transition-all duration-700" style={{ width: `${completionRate}%` }}></div>
        </div>
      </div>

      {/* Impact — real-world effect of completed donations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">People Served</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{peopleServed.toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-2">Across {completed} completed {completed === 1 ? 'delivery' : 'deliveries'}</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Recycle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Food Waste Reduced</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{wasteReduced.toLocaleString()} kg</div>
          <div className="text-sm text-gray-500 mt-2">Diverted from landfill</div>
        </div>
      </div>

      {/* 3 Stat Cards — each says something different */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Delivered</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{completed}</div>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
            <ChevronUp className="w-4 h-4" />
            <span>{total > 0 ? Math.round((completed / total) * 100) : 0}% of all donations</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Active Now</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{activeNow}</div>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <span className="text-yellow-600 font-medium">{accepted} accepted</span>
            <span className="text-gray-300">·</span>
            <span className="text-blue-600 font-medium">{pending} pending</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Top Donor</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 truncate">
            {topDonors && topDonors.length > 0 ? topDonors[0].name : '—'}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            {topDonors && topDonors.length > 0 ? `${topDonors[0].donations} donations` : 'No donors yet'}
          </div>
        </div>
      </div>

      {/* Per-delivery averages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Avg People Served / Delivery</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{avgServes.toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-2">Per completed donation</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Recycle className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Avg Waste Reduced / Delivery</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{avgWeight} kg</div>
          <div className="text-sm text-gray-500 mt-2">Per completed donation</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Monthly Bar Chart — takes 3/5 */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">Monthly Trend</h3>
            </div>
            {momChange !== null && momChange !== undefined ? (
              <span className={`inline-flex items-center gap-1 text-sm font-medium px-2.5 py-1 rounded-full ${
                momChange > 0 ? 'bg-green-100 text-green-700' :
                momChange < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {momChange > 0 ? <ChevronUp className="w-4 h-4" /> : momChange < 0 ? <ChevronDown className="w-4 h-4" /> : null}
                {momChange > 0 ? `+${momChange}%` : `${momChange}%`} vs last month
              </span>
            ) : null}
          </div>
          {monthlyTrend && monthlyTrend.length > 0 ? (
            <div className="flex items-end justify-between gap-2 h-48">
              {monthlyTrend.map((item, index) => {
                const pct = maxDonation > 0 ? (item.donations / maxDonation) * 100 : 0;
                const isHighest = item.donations === maxDonation;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-xs font-semibold text-gray-700">{item.donations}</span>
                      <div
                      className={`w-full rounded-lg transition-all duration-500 ${
                        isHighest ? 'bg-gradient-to-t from-red-500 to-red-400' : 'bg-red-200'
                      }`}
                      style={{ height: `${Math.max(pct, 4)}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 font-medium">{item.month}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No data yet</p>
          )}
        </div>

        {/* Top Donors — takes 2/5 */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Top Donors</h3>
          </div>
          {topDonors && topDonors.length > 0 ? (
            <div className="space-y-3">
              {topDonors.map((donor, index) => {
                const medals = ['🥇', '🥈', '🥉'];
                const isPodium = index < 3;
                return (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    {isPodium ? (
                      <span className="text-lg">{medals[index]}</span>
                    ) : (
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-500">
                        {index + 1}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{donor.name}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-sm font-bold text-red-500">{donor.donations}</span>
                      <span className="text-xs text-gray-400 ml-1">donations</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No donors yet</p>
          )}
        </div>
      </div>

      {/* Status Breakdown — replaces the repetitive impact summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-5">Donation Status Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Completed', value: completed, color: 'bg-green-500', textColor: 'text-green-600', bgColor: 'bg-green-50' },
            { label: 'Accepted', value: accepted, color: 'bg-yellow-500', textColor: 'text-yellow-600', bgColor: 'bg-yellow-50' },
            { label: 'Pending', value: pending, color: 'bg-blue-500', textColor: 'text-blue-600', bgColor: 'bg-blue-50' },
            { label: 'Cancelled', value: cancelled || 0, color: 'bg-red-500', textColor: 'text-red-600', bgColor: 'bg-red-50' },
          ].map((item) => {
            const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
            return (
              <div key={item.label} className={`${item.bgColor} rounded-xl p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-bold ${item.textColor}`}>{pct}%</span>
                </div>
                <div className={`h-2 rounded-full bg-white overflow-hidden`}>
                  <div className={`${item.color} h-full rounded-full transition-all duration-700`} style={{ width: `${pct}%` }}></div>
                </div>
                <div className="mt-3">
                  <div className={`text-lg font-bold ${item.textColor}`}>{item.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Analytics;