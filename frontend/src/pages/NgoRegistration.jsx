import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NgoRegistration = () => {
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
            <p className="text-lg  text-gray-600">Upload Organization Image</p>
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
            <p className="text-lg text-gray-600 ">Organization Name</p>
            <input
              className="md:w-3/4 w-full text-lg font-semibold px-3 py-2 bg-gray-100 h-10"
              placeholder="Social Organization"
              type="text"
            />
          </div>

          <div className="mt-5 w-full flex flex-col md:flex-row items-start md:items-center md:justify-between h-full">
            <p className="text-lg md:-mr-4 text-gray-600 ">
              Organization Address
            </p>
            <input
              className="md:w-3/4 w-full text-lg font-semibold px-3 py-2 bg-gray-100 h-10"
              placeholder="Near IT Park Pune Maharashtra India"
              type="text"
            />
          </div>

          <div className="mt-5 w-full flex flex-col md:flex-row items-start md:items-center md:justify-between h-full">
            <p className="text-lg md:-mr-4 text-gray-600">
              Organization Pincode
            </p>

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
            <p className="text-lg text-gray-600">Capacity of Organization</p>
            <input
              className="md:w-3/4 md:-ml-10 w-full text-lg font-semibold px-3 py-2 bg-gray-100 h-10"
              placeholder="10"
              type="number "
            />
          </div>

          <div className="mt-5 w-full flex flex-col md:flex-row items-start md:items-center md:justify-between h-full">
            <p className="text-lg text-gray-600">License ID</p>
            <input
              className="md:w-3/4 md:-ml-10 w-full text-lg font-semibold px-3 py-2 bg-gray-100 h-10"
              placeholder="abcd43-abcd12"
              type="text"
            />
          </div>

          <div className="mt-5 w-full flex flex-col md:flex-row items-start md:items-center md:justify-between h-full">
            <p className="text-lg text-gray-600 ">Type of Organization</p>

            <select
              className="md:w-3/4 md:-ml-3 w-full text-lg font-semibold px-3 py-2 bg-gray-100 h-10"
              name=""
              id=""
            >
              <option value="trust">
                Trust (Registered under the Indian Trusts Act)
              </option>
              <option value="society">
                Society (Registered under the Societies Registration Act, 1860)
              </option>
              <option value="company">
                Section 8 Company (Non-Profit Company) (Under Companies Act,
                2013)
              </option>
              <option value="shg">
                Co-operative Society / Self-Help Group (SHG) (if applicable)
              </option>
              <option value="charitable">Charitable Foundation</option>
              <option value="community">Religious / Community Organization</option>
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
            Register as Organization
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

export default NgoRegistration;
