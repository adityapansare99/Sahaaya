import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Partner from "../components/Partner";
import Footer from "../components/Footer";

const Home = () => {
  const aboutusRef = useRef(null);
  const ourworkRef = useRef(null);
  const partnerwithusRef = useRef(null);

  const scrollToSection = (ref) => {
    window.scrollTo({
      top: ref.current.offsetTop,
      behavior: "smooth",
    });
  };

  const navigate = useNavigate();

  return (
    <div>
      <div className="w-full h-screen relative">
        <img
          className="w-full h-full object-cover"
          src="https://res.cloudinary.com/dvdwjzjvf/image/upload/v1757965856/project/Sahaaya/image_ipc2mm.png"
          alt=""
        />

        {/* navbar */}
        <Navbar aboutusRef={aboutusRef} ourworkRef={ourworkRef} partnerwithusRef={partnerwithusRef}/>

        <div className="absolute bottom-[10vh] z-10  px-4 md:px-0 md:left-[20vw]">
          <h2 className="text-white text-2xl md:text-5xl mb-2 font-bold text-center md:text-left">
            Hunger Free India
          </h2>
          <p className="text-white text-lg md:text-2xl font-medium text-center md:text-left">
            Serving meals daily to those in need, everywhere in India.
          </p>
          <div className="flex justify-center md:justify-start">
            <button
              onClick={() => {
                navigate("/Role");
              }}
              type="button"
              className="cursor-pointer text-base md:text-lg py-2 md:py-3 px-4 md:px-6 mt-4 bg-[#EF4F5F] text-white rounded-lg"
            >
              JOIN US
            </button>
          </div>
        </div>
      </div>

      {/* about us */}
      <div
        ref={aboutusRef}
        className="min-h-screen flex flex-col px-4 md:px-[20vw] mt-20 md:mt-40"
      >
        <div className="flex flex-col md:flex-row align-center justify-between gap-6 mb-10 md:mb-20">
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">
              Mission
            </h1>
            <p className="text-base md:text-lg">
              To reduce food waste and fight hunger by connecting restaurants,
              event organizers, and individuals with leftover food to verified
              NGOs who can distribute it to those in need.
            </p>
          </div>
          <img
            className="w-full md:w-1/2 h-40 md:h-70 rounded-xl mt-6 md:mt-0 object-cover"
            src="https://media.cntraveller.in/wp-content/uploads/2020/02/Feeding-India-Zomato.jpg"
            alt=""
          />
        </div>

        <div className="flex flex-col md:flex-row align-center justify-between gap-6 mt-10 md:mt-20">
          <img
            className="w-full md:w-1/2 h-40 md:h-70 rounded-xl object-cover"
            src="https://tatsatchronicle.com/wp-content/uploads/2022/01/Akshaya-Patra-Foundation-.jpg"
            alt=""
          />
          <div className="w-full md:w-1/2 flex flex-col justify-center ml-0 md:ml-5 mt-6 md:mt-0">
            <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">
              Vision
            </h1>
            <p className="text-base md:text-lg">
              To build a sustainable ecosystem where no edible food goes to
              waste and every extra meal becomes a lifeline for someone in need
              — creating a hunger-free and compassionate India.
            </p>
          </div>
        </div>
      </div>

      {/* our work */}
      <div ref={ourworkRef} className="flex flex-col px-4 md:px-[20vw]">
        <h1 className="text-2xl md:text-4xl font-bold text-center mt-10 md:mt-20">
          The Journey So Far
        </h1>

        <div className="mt-8 md:mt-15 bg-[#f8f8f8] h-24 md:h-40 rounded-lg px-4 md:px-10 flex flex-col justify-center items-center tracking-wider">
          <p className="text-xl md:text-4xl font-semibold">
            Total meals served:{" "}
            <span className="text-[#EF4F5F]">20 crores</span> and counting....
          </p>
        </div>
      </div>

      {/* PARTNER WITH US */}
      <Partner partnerwithusRef={partnerwithusRef} />

      {/* Footer */}
      <Footer aboutusRef={aboutusRef} ourworkRef={ourworkRef} partnerwithusRef={partnerwithusRef}/>
    </div>
  );
};

export default Home;
