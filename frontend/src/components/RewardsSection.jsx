import React from "react";
import {
  Award,
  TrendingUp,
  Heart,
  Star,
  Target,
  Trophy,
  Users,
  Package,
} from "lucide-react";

const RewardsSection = () => {
  const stats = [
    {
      title: "Total Deliveries",
      value: "124",
      icon: Package,
      color: "blue",
      change: "+12 this week",
    },
    {
      title: "Meals Served",
      value: "486",
      icon: Heart,
      color: "red",
      change: "+38 this week",
    },
    {
      title: "Total Earnings",
      value: "₹6,240",
      icon: TrendingUp,
      color: "green",
      change: "+₹520 this week",
    },
    {
      title: "Rating",
      value: "4.9/5",
      icon: Star,
      color: "yellow",
      change: "Excellent service",
    },
  ];

  const badges = [
    {
      id: 1,
      title: "Speed Demon",
      description: "Complete 10 deliveries in under 30 minutes",
      icon: Target,
      earned: true,
      progress: 100,
    },
    {
      id: 2,
      title: "Community Hero",
      description: "Help serve 500 meals to those in need",
      icon: Users,
      earned: true,
      progress: 100,
    },
    {
      id: 3,
      title: "Reliability Champion",
      description: "Maintain 100% delivery success rate for 30 days",
      icon: Trophy,
      earned: false,
      progress: 87,
    },
    {
      id: 4,
      title: "Early Bird",
      description: "Complete 25 morning deliveries (6 AM - 10 AM)",
      icon: Award,
      earned: false,
      progress: 68,
    },
  ];

  const milestones = [
    { milestone: "50 Deliveries", status: "completed", reward: "₹500 Bonus" },
    { milestone: "100 Deliveries", status: "completed", reward: "₹1000 Bonus" },
    {
      milestone: "250 Deliveries",
      status: "in-progress",
      reward: "₹2500 Bonus",
      progress: 50,
    },
    { milestone: "500 Deliveries", status: "upcoming", reward: "₹5000 Bonus" },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-800",
      red: "bg-red-100 text-red-800",
      green: "bg-green-100 text-green-800",
      yellow: "bg-yellow-100 text-yellow-800",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Rewards & Impact</h2>
        <p className="text-gray-600">
          Track your contributions and achievements
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClasses(
                    stat.color
                  )}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-gray-600 font-medium mb-2">{stat.title}</p>
                <p className="text-sm text-green-600 font-medium">
                  {stat.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Badges Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            Achievement Badges
          </h3>
          <p className="text-gray-600">
            Unlock rewards by completing challenges
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.id}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    badge.earned
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        badge.earned
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-bold text-gray-900">
                          {badge.title}
                        </h4>
                        {badge.earned && (
                          <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                            EARNED
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        {badge.description}
                      </p>

                      {!badge.earned && (
                        <div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium text-gray-900">
                              {badge.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${badge.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            Delivery Milestones
          </h3>
          <p className="text-gray-600">
            Earn bonus rewards for major achievements
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                  milestone.status === "completed"
                    ? "bg-green-50 border border-green-200"
                    : milestone.status === "in-progress"
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      milestone.status === "completed"
                        ? "bg-green-500 text-white"
                        : milestone.status === "in-progress"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {milestone.status === "completed" ? (
                      <Trophy className="w-5 h-5" />
                    ) : (
                      <Target className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {milestone.milestone}
                    </h4>
                    <p className="text-gray-600 text-sm">{milestone.reward}</p>
                  </div>
                </div>

                <div className="text-right">
                  {milestone.status === "completed" && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Completed
                    </span>
                  )}
                  {milestone.status === "in-progress" && (
                    <div className="text-right">
                      <span className="text-blue-600 font-medium text-sm">
                        {milestone.progress}%
                      </span>
                      <div className="w-24 bg-blue-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {milestone.status === "upcoming" && (
                    <span className="text-gray-500 text-sm">Upcoming</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsSection;
