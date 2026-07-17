import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Heart, Truck, ChevronRight, UserCheck, Store } from "lucide-react";
import { AppContext } from "../context/AppContext";

const Role = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("Donor");

  const { Role, setRole } = useContext(AppContext);

  const roles = [
    {
      id: "Donor",
      title: "Food Donor",
      description: "Share surplus food and make a difference in your community",
      icon: Heart,
      color: "from-rose-400 to-pink-500",
      bgColor: "bg-gradient-to-br from-rose-50 to-pink-50",
      borderColor: "border-rose-200",
      selectedBorder: "border-rose-400",
    },
    {
      id: "Receiver",
      title: "Food Receiver",
      description: "Connect with donors and receive fresh food donations",
      icon: Users,
      color: "from-blue-400 to-indigo-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
      selectedBorder: "border-blue-400",
    },
    {
      id: "Rider",
      title: "Delivery Partner",
      description: "Bridge the gap by delivering food from donors to receivers",
      icon: Truck,
      color: "from-emerald-400 to-teal-500",
      bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
      borderColor: "border-emerald-200",
      selectedBorder: "border-emerald-400",
    },
    {
      id: "Partner",
      title: "Restaurant Partner",
      description: "Offer discounts to riders and grow your reach",
      icon: Store,
      color: "from-amber-400 to-orange-500",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
      borderColor: "border-amber-200",
      selectedBorder: "border-amber-400",
    },
  ];

  const submitHandler = (e) => {
    e.preventDefault();

    if (selectedRole === "Donor") {
      navigate("/Registration-Donor");
    } else if (selectedRole === "Receiver") {
      navigate("/Registration-Ngo");
    } else if (selectedRole === "Rider") {
      navigate("/Registration-Rider");
    } else {
      navigate("/Registration-Partner");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full mb-6 shadow-lg">
            <UserCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Join{" "}
            <span
              onClick={() => {
                navigate("/");
              }}
              className="bg-gradient-to-r from-red-500 to-red-600 cursor-pointer bg-clip-text text-transparent"
            >
              Sahaaya
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            Choose your role and become part of a community dedicated to
            reducing food waste and fighting hunger
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="space-y-4 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <div
                key={role.id}
                onClick={() => {
                  setRole(role.id);
                  setSelectedRole(role.id);
                  localStorage.setItem("role", role.id);
                }}
                className={`
                  relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl
                  ${
                    isSelected
                      ? `${role.bgColor} ${role.selectedBorder} shadow-lg scale-[1.02]`
                      : `bg-white ${role.borderColor} hover:${role.bgColor} shadow-md`
                  }
                `}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {role.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {role.description}
                    </p>
                  </div>

                  <div
                    className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                    ${
                      isSelected
                        ? `bg-gradient-to-br ${role.color} border-transparent`
                        : "border-gray-300 bg-white"
                    }
                  `}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={submitHandler}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 cursor-pointer text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 text-lg"
          >
            <span>Start Your Journey</span>
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="text-center">
            <p className="text-gray-600 mb-2">Already have an account?</p>
            <button
              onClick={() => navigate("/Login")}
              className="text-red-500 cursor-pointer font-semibold hover:text-red-600 transition-colors duration-200 underline decoration-2 underline-offset-4"
            >
              Sign in here
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-gray-500 text-sm">
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Role;
