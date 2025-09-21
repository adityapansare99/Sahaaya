import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center h-screen w-screen flex-col gap-5">
      <div className="mx-10 flex flex-col items-start px-10 py-10 shadow-2xl rounded-2xl">
        <h1 className="md:text-3xl text-2xl mb-4">Welcome Back to Sahaaya</h1>

        <div className="mt-5 w-full flex flex-col md:flex-row items-start md:items-center md:justify-between h-full">
          <p className="text-lg text-gray-600">Email Address</p>
          <input
            className="w-full md:w-3/4 md:-ml-6 text-lg font-semibold px-3 py-2 bg-gray-100 h-10"
            placeholder="Example@gmail.com"
            type="email"
          />
        </div>

        <div className="mt-5 w-full flex flex-col md:flex-row items-start md:items-center md:justify-between h-full">
          <p className="text-lg text-gray-600">Password</p>
          <input
            className="md:w-3/4 w-full text-lg font-semibold px-3 py-2 bg-gray-100 h-10"
            placeholder="********"
            type="password"
          />
        </div>
        <div className="mt-5 w-full flex flex-col md:flex-row items-start md:items-center md:justify-between h-full">
          <p className="text-lg text-gray-600">Login as</p>
          <select
            className="cursor-pointer md:w-3/4 w-full text-lg font-semibold px-3 py-2 bg-gray-100 h-10"
            name=""
            id=""
          >
            <option value="Donor">Food Donor</option>
            <option value="Receiver">Food Receiver</option>
            <option value="Rider">Delivery Partner</option>
          </select>
        </div>

        <button className="p-3 mt-10 cursor-pointer text-xl text-center w-full rounded-xl bg-[#ef4f5f] text-white font-semibold mb-2">
          Sign in to Continue
        </button>

        <p className="text-sm md:text-lg mt-2">
          Does not have an account?{" "}
          <span
            onClick={() => {
              navigate("/Role");
            }}
            className="text-decoration-underline text-[#ef4f5f] cursor-pointer"
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
