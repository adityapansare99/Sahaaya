import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RiderRegistration = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  return (
    <div>
      <div className="md:grid md:grid-cols-2 md:w-full md:h-screen">
        <div className="w-full justify-center md:flex items-center h-[100vh] hidden">
          <img
            className="w-100"
            src="https://res.cloudinary.com/dvdwjzjvf/image/upload/v1758366445/project/Sahaaya/Minimalistic_Sahaaya_Logo_Design_cxghbe_skvums.png"
            alt=""
          />
        </div>

        <div className="flex md:mx-10 mx-5 my-5  md:my-10 flex-col items-start md:px-20 md:py-10 md:shadow-2xl">
          {!image && (
            <p className="text-lg  text-gray-600">Upload Your Photo</p>
          )}

          <label htmlFor="image">
            <div className="inline-block relative cursor-pointer">
              <img
                className="md:w-30 w-20 rounded opacity-75"
                src={
                  image
                    ? URL.createObjectURL(image)
                    : "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png"
                }
                alt=""
              />
              <img
                className="w-10 absolute bottom-12 right-12"
                src={image ? null : ""}
                alt=""
              />
            </div>

            <input
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
              type="file"
              id="image"
              hidden
            />
          </label>

          <div className="mt-5 w-full flex flex-col md:flex-row items-start md:items-center md:justify-between h-full">
            <p className="text-lg text-gray-600 ">FullName</p>
            <input
              className="md:w-3/4 w-full text-lg font-semibold px-3 py-2 bg-gray-100 h-10"
              placeholder="Jhon Doe"
              type="text"
            />
          </div>

          <div className="mt-5 w-full flex flex-col md:flex-row items-start md:items-center md:justify-between h-full">
            <p className="text-lg md:-mr-4 text-gray-600 ">Address</p>
            <input
              className="md:w-3/4 w-full text-lg font-semibold px-3 py-2 bg-gray-100 h-10"
              placeholder="Near Silver Hospital Pune Maharashtra India"
              type="text"
            />
          </div>

          <div className="mt-5 w-full flex flex-col md:flex-row items-start md:items-center md:justify-between h-full">
            <p className="text-lg md:-mr-4 text-gray-600">Pincode</p>

            <input
              className="md:w-3/4 w-full text-lg font-semibold px-3 py-2 bg-gray-100 h-10"
              placeholder="435167"
              type="text"
            />
          </div>

          <div className="mt-5 w-full flex flex-col md:flex-row items-start md:items-center md:justify-between h-full">
            <p className="text-lg text-gray-600">Phone Number</p>
            <input
              className="md:w-3/4 w-full text-lg font-semibold px-3 py-2 bg-gray-100 h-10"
              placeholder="0000000000"
              type="number"
            />
          </div>

          <div className="mt-5 w-full flex flex-col md:flex-row items-start md:items-center md:justify-between h-full">
            <p className="text-lg text-gray-600">Email Address</p>
            <input
              className="w-full md:w-3/4 text-lg font-semibold px-3 py-2 bg-gray-100 h-10"
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
            <p className="text-lg text-gray-600 ">Confirm Password</p>
            <input
              className="md:w-3/4 w-full text-lg font-semibold px-3 py-2 bg-gray-100 h-10"
              placeholder="********"
              type="password"
            />
          </div>

          <div className="mt-5 w-full flex flex-col md:flex-row items-start md:items-center md:justify-between h-full">
            <p className="text-lg text-gray-600">Capacity of Vehicle</p>
            <input
              className="md:w-3/4 md:ml-1 w-full text-lg font-semibold px-3 py-2 bg-gray-100 h-10"
              placeholder="10 (people's food delivery capacity)"
              type="number"
            />
          </div>

          <div className="mt-5 w-full flex flex-col md:flex-row items-start md:items-center md:justify-between h-full">
            <p className="text-lg text-gray-600">License Number</p>
            <input
              className="md:w-3/4 md:-ml-10 w-full text-lg font-semibold px-3 py-2 bg-gray-100 h-10"
              placeholder="abcd43-abcd12"
              type="text"
            />
          </div>

          <div className="mt-5 w-full flex flex-col md:flex-row items-start md:items-center md:justify-between h-full">
            <p className="text-lg text-gray-600">Vehicle Number</p>
            <input
              className="md:w-3/4 md:-ml-10 w-full text-lg font-semibold px-3 py-2 bg-gray-100 h-10"
              placeholder="MH23AB1234"
              type="text"
            />
          </div>

          <div className="mt-5 w-full flex flex-col md:flex-row items-start md:items-center md:justify-between h-full">
            <p className="text-lg text-gray-600 ">Type of Vehicle</p>

            <select
              className="md:w-3/4 md:-ml-3 w-full text-lg font-semibold px-3 py-2 bg-gray-100 h-10"
              name=""
              id=""
            >
              <option value="Bicycle">Bicycle</option>
              <option value="Moto">Motorcycle / Bike</option>
              <option value="Auto">Auto Rickshaw</option>
              <option value="Car">Car</option>
              <option value="Tempo">Tempo</option>
              <option value="Truck">Truck</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 cursor-pointer"
            />
            <label
              htmlFor="terms"
              className="ml-2 text-gray-700 cursor-pointer"
            >
              Agree to terms and conditions
            </label>
          </div>

          <button className="p-2 cursor-pointer text-lg text-center w-full rounded-xl bg-[#ef4f5f] text-white font-semibold mt-5 md:mt-10 mb-2">
            Register as Delivery Rider Partner
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
    </div>
  );
};

export default RiderRegistration;
