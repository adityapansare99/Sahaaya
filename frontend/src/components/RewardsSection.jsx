import React, { useContext, useEffect, useState } from "react";
import { Award, Star, Target, Trophy, Package } from "lucide-react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const RewardsSection = () => {
  const { backendurl, token } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await axios.get(`${backendurl}rider/rewards`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setData(response.data.data);
          console.log(response.data.data);
        } else {
          toast.error("Failed to load rewards");
        }
      } catch (error) {
        toast.error("Error fetching rewards");
      } finally {
        setLoading(false);
      }
    };
    fetchRewards();
  }, [backendurl, token]);

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="h-32 bg-gray-200 rounded-2xl animate-pulse mb-8"></div>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl p-6 animate-pulse bg-gray-100">
              <div className="h-12 w-12 bg-gray-200 rounded-2xl mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl p-6 animate-pulse bg-gray-100 mb-8 h-48"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Rewards & Impact
        </h2>
        <p className="text-gray-600 mb-8">
          Track your contributions and achievements
        </p>
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No rewards data yet
          </h3>
          <p className="text-gray-500">
            Complete deliveries to start earning points and rewards.
          </p>
        </div>
      </div>
    );
  }

  const {
    points = 0,
    redeemedPoints = 0,
    totalDeliveries = 0,
    rating = 0,
    milestones = [],
  } = data;

  const statCards = [
    {
      label: "Total Deliveries",
      value: totalDeliveries.toLocaleString(),
      icon: Package,
      tint: "bg-blue-100 text-blue-600",
      sub: "Lifetime deliveries completed",
    },
    {
      label: "Rating",
      value: rating ? rating.toFixed(1) : "—",
      icon: Star,
      tint: "bg-yellow-100 text-yellow-600",
      sub: "Average service rating",
    },
  ];

  // Derived from real API fields — no fabricated metrics.
  const badges = [
    {
      title: "First Delivery",
      desc: "Complete your first delivery",
      current: totalDeliveries,
      target: 1,
      unit: "",
      icon: Package,
    },
    {
      title: "Century Rider",
      desc: "Complete 100 deliveries",
      current: totalDeliveries,
      target: 100,
      unit: "",
      icon: Trophy,
    },
    {
      title: "Point Collector",
      desc: "Earn 500 points",
      current: points+redeemedPoints,
      target: 500,
      unit: " pts",
      icon: Award,
    },
    {
      title: "Top Rated",
      desc: "Maintain a 4.5+ rating",
      current: rating,
      target: 4.5,
      unit: "★",
      icon: Star,
    },
  ].map((b) => {
    const current = b.current || 0;
    const unlocked = current >= b.target;
    const progress = Math.min(100, Math.round((current / b.target) * 100));
    return { ...b, current, unlocked, progress };
  });

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Rewards & Impact
        </h2>
        <p className="text-gray-600">
          Track your contributions and achievements
        </p>
      </div>

      {/* Hero — points balance */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl p-6 md:p-8 text-white mb-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-amber-100 text-sm font-medium mb-1">
              Points Balance
            </p>
            <div className="text-4xl md:text-5xl font-bold mb-2">
              {points.toLocaleString()}
            </div>
            <p className="text-amber-100 text-sm">
              {redeemedPoints.toLocaleString()} points redeemed
            </p>
          </div>
          <div className="bg-white/20 rounded-2xl p-4">
            <Award className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <div
                className={`p-3 rounded-2xl w-fit mb-4 ${card.tint}`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {card.value}
              </div>
              <p className="text-sm font-medium text-gray-700">{card.label}</p>
              <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Badges */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-800">
            Achievement Badges
          </h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {badges.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                  b.unlocked
                    ? "bg-amber-50 border-amber-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div
                  className={`p-2 rounded-xl ${
                    b.unlocked
                      ? "bg-amber-500 text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-800">{b.title}</h4>
                    {b.unlocked && (
                      <span className="bg-amber-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                        EARNED
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{b.desc}</p>
                  {!b.unlocked && (
                    <>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">
                          {b.current}
                          {b.unit} / {b.target}
                          {b.unit}
                        </span>
                        <span className="font-medium text-gray-700">
                          {b.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${b.progress}%` }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-800">
            Delivery Milestones
          </h3>
        </div>
        <div className="space-y-3">
          {milestones.length > 0 ? (
            milestones.map((m, i) => {
              const completed = m.status === "completed";
              const inProgress = m.status === "in-progress";
              return (
                <div
                  key={i}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    completed
                      ? "bg-green-50 border-green-200"
                      : inProgress
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        completed
                          ? "bg-green-500 text-white"
                          : inProgress
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {completed ? (
                        <Trophy className="w-5 h-5" />
                      ) : (
                        <Target className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{m.milestone}</h4>
                      <p className="text-gray-600 text-sm">{m.reward}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    {completed && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Completed
                      </span>
                    )}
                    {inProgress && (
                      <div>
                        <span className="text-blue-600 font-medium text-sm">
                          {m.progress}%
                        </span>
                        <div className="w-24 bg-blue-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${m.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {m.status === "upcoming" && (
                      <span className="text-gray-500 text-sm">Upcoming</span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 text-center py-6">No milestones yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardsSection;
