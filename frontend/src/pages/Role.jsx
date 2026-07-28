import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Users, Truck, Store, ChevronRight } from "lucide-react";
import { AppContext } from "../context/AppContext";
import Logo from "../components/flow/Logo";

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
      tone: "donor",
    },
    {
      id: "Receiver",
      title: "Food Receiver",
      description: "Connect with donors and receive fresh food donations",
      icon: Users,
      tone: "ngo",
    },
    {
      id: "Rider",
      title: "Delivery Partner",
      description: "Bridge the gap by delivering food from donors to receivers",
      icon: Truck,
      tone: "rider",
    },
    {
      id: "Partner",
      title: "Restaurant Partner",
      description: "Offer discounts to riders and grow your reach",
      icon: Store,
      tone: "partner",
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
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-9">
          <div className="flex justify-center mb-6">
            <div onClick={() => navigate("/")} className="inline-flex cursor-pointer">
              <Logo size="lg" />
            </div>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink">
            Join the movement
          </h1>
          <p className="text-mute max-w-md mx-auto leading-relaxed mt-3">
            Choose your role and become part of a community dedicated to reducing
            food waste and fighting hunger
          </p>
        </div>

        {/* Role cards */}
        <div className="space-y-3 mb-7">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            const c1 = `var(--color-${role.tone})`;
            const c2 = `var(--color-${role.tone}-2, var(--color-${role.tone}))`;
            const soft = `var(--color-${role.tone}-soft)`;
            return (
              <div
                key={role.id}
                onClick={() => {
                  setRole(role.id);
                  setSelectedRole(role.id);
                  localStorage.setItem("role", role.id);
                }}
                className="flow-tile p-5 flex items-center gap-4 cursor-pointer"
                style={isSelected ? { borderColor: c1, background: soft } : undefined}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(140deg, ${c1}, ${c2})` }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg font-bold text-ink">
                    {role.title}
                  </h3>
                  <p className="text-sm text-mute leading-snug">{role.description}</p>
                </div>
                <div
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={
                    isSelected
                      ? { borderColor: c1, background: c1 }
                      : { borderColor: "var(--color-line)" }
                  }
                >
                  {isSelected && <span className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit */}
        <button onClick={submitHandler} className="fbtn fbtn-flow w-full">
          Start your journey <ChevronRight className="w-5 h-5" />
        </button>

        <div className="text-center mt-6">
          <p className="text-sm text-mute">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/Login")}
              className="text-ngo font-semibold hover:underline cursor-pointer"
            >
              Sign in
            </button>
          </p>
        </div>

        <p className="text-center mt-8 text-xs text-mute-2">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Role;
