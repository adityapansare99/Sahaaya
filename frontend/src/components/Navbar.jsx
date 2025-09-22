import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = (props) => {
  const navigate = useNavigate();
  const scrollToSection = (ref) => {
    window.scrollTo({
      top: ref.current.offsetTop,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div className="absolute py-1 -mt-6 top-0 left-1/2 transform -translate-x-1/2 z-10 flex flex-col md:flex-row justify-center items-center gap-3 md:gap-8 w-full px-4 md:px-0 md:-ml-15">
        <img
          className="w-50 md:w-70"
          src="https://res.cloudinary.com/dvdwjzjvf/image/upload/v1757965849/project/Sahaaya/logo_ogqpfq.png"
          alt=""
        />
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-12 md:mt-0 -mt-10">
          <h1
            onClick={() => scrollToSection(props.aboutusRef)}
            className="text-base cursor-pointer md:text-lg text-white"
          >
            ABOUT US
          </h1>
          <h1
            onClick={() => scrollToSection(props.ourworkRef)}
            className="text-base cursor-pointer md:text-lg text-white"
          >
            OUR WORK
          </h1>
          <h1
            onClick={() => scrollToSection(props.partnerwithusRef)}
            className="text-base cursor-pointer md:text-lg text-white"
          >
            PARTNER WITH US
          </h1>
          <hr className="w-1 h-10 bg-white hidden md:block" />
          <button
            onClick={() => {
              navigate("/Role");
            }}
            type="button"
            className="cursor-pointer text-base md:text-lg py-2 hidden md:block md:py-3 px-4 md:px-6 bg-[#EF4F5F] text-white rounded-lg"
          >
            JOIN US
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
