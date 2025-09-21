import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Role = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("Donor");

  const submitHandler = (e) => {
    e.preventDefault();

    if (role === "Donor") {
      navigate("/Registration-Donor");
    } else if (role === "Receiver") {
      navigate("/Registration-Ngo");
    } else {
      navigate("/Registration-Rider");
    }
  };
  return (
    <div className="flex justify-center items-center h-screen w-screen flex-col gap-5">
      <div className="mx-10 flex flex-col items-start px-10 py-10 shadow-2xl rounded-2xl">
        <h1 className="md:text-3xl text-2xl mb-4">
          Become a part of Sahaaya as..
        </h1>
        <select
          onChange={(e) => {
            setRole(e.target.value);
          }}
          value={role}
          className="p-3 text-xl mb-8 cursor-pointer"
          name=""
          id=""
        >
          <option value="Donor">Food Donor</option>
          <option value="Receiver">Food Receiver</option>
          <option value="Rider">Delivery Partner</option>
        </select>

        <button
          onClick={(role) => {
            submitHandler(role);
          }}
          className="p-3 cursor-pointer text-xl text-center w-full rounded-xl bg-[#ef4f5f] text-white font-semibold mb-2"
        >
          Start the journey
        </button>

        <p className="text-sm md:text-lg mt-2">
          Already have an account?{" "}
          <span
            onClick={() => {
              navigate("/Login");
            }}
            className="text-decoration-underline text-[#ef4f5f] cursor-pointer"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Role;
