import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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

        <div className="absolute py-1 -mt-6 top-0 left-1/2 transform -translate-x-1/2 z-10 flex flex-col md:flex-row justify-center items-center gap-3 md:gap-8 w-full px-4 md:px-0 md:-ml-15">
          <img
            className="w-50 md:w-70"
            src="https://res.cloudinary.com/dvdwjzjvf/image/upload/v1757965849/project/Sahaaya/logo_ogqpfq.png"
            alt=""
          />
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-12 md:mt-0 -mt-10">
            <h1
              onClick={() => scrollToSection(aboutusRef)}
              className="text-base cursor-pointer md:text-lg text-white"
            >
              ABOUT US
            </h1>
            <h1
              onClick={() => scrollToSection(ourworkRef)}
              className="text-base cursor-pointer md:text-lg text-white"
            >
              OUR WORK
            </h1>
            <h1
              onClick={() => scrollToSection(partnerwithusRef)}
              className="text-base cursor-pointer md:text-lg text-white"
            >
              PARTNER WITH US
            </h1>
            <hr className="w-1 h-10 bg-white hidden md:block" />
            <button onClick={()=>{
              navigate("/Role")
            }}
              type="button"
              className="cursor-pointer text-base md:text-lg py-2 hidden md:block md:py-3 px-4 md:px-6 bg-[#EF4F5F] text-white rounded-lg"
            >
              JOIN US
            </button>
          </div>
        </div>

        <div className="absolute bottom-[10vh] z-10  px-4 md:px-0 md:left-[20vw]">
          <h2 className="text-white text-2xl md:text-5xl mb-2 font-bold text-center md:text-left">
            Hunger Free India
          </h2>
          <p className="text-white text-lg md:text-2xl font-medium text-center md:text-left">
            Serving meals daily to those in need, everywhere in India.
          </p>
          <div className="flex justify-center md:justify-start">
            <button onClick={()=>{
              navigate("/Role")
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
      <div
        ref={partnerwithusRef}
        className="flex flex-col px-4 md:px-[20vw] items-center mb-20"
      >
        <h1 className="text-2xl md:text-4xl font-bold text-center mt-20 md:mt-40">
          Hands Together for a Better Tomorrow
        </h1>
        <div className="mt-10 md:mt-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 w-full">
          <div className="flex flex-col items-center gap-2 md:gap-4 mb-6 md:mb-10">
            <img
              className="rounded-full w-24 h-24 md:w-40 md:h-40 object-cover"
              src="https://th.bing.com/th/id/OIP.esfv5ueHIM4_fMaafUiAtgHaGL?w=223&h=186&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
              alt=""
            />
            <h1 className="text-base md:text-lg font-semibold -mt-2">
              Jio Group
            </h1>
          </div>

          <div className="flex flex-col items-center gap-2 md:gap-4 mb-6 md:mb-10">
            <img
              className="rounded-full w-24 h-24 md:w-40 md:h-40 object-cover"
              src="https://th.bing.com/th/id/OIP.ZxwGHG5bjAtG9eDBQsLkxwHaFf?w=279&h=207&c=7&r=0&o=5&dpr=1.3&pid=1.7"
              alt=""
            />
            <h1 className="text-base md:text-lg font-semibold -mt-2">
              Adani Power
            </h1>
          </div>

          <div className="flex flex-col items-center gap-2 md:gap-4 mb-6 md:mb-10">
            <img
              className="rounded-full w-24 h-24 md:w-40 md:h-40 object-cover"
              src="https://th.bing.com/th/id/OIP.md_2v5S-eZ2uBn17nfMogAHaHa?w=206&h=207&c=7&r=0&o=5&dpr=1.3&pid=1.7"
              alt=""
            />
            <h1 className="text-base md:text-lg font-semibold -mt-2">
              Solana Foundation
            </h1>
          </div>

          <div className="flex flex-col items-center gap-2 md:gap-4 mb-6 md:mb-10">
            <img
              className="rounded-full w-24 h-24 md:w-40 md:h-40 object-cover"
              src="https://th.bing.com/th/id/OIP.l_swNbrjVJFJVAKqd3NddQHaHa?w=206&h=207&c=7&r=0&o=5&dpr=1.3&pid=1.7"
              alt=""
            />
            <h1 className="text-base md:text-lg font-semibold -mt-2">
              Social Organization
            </h1>
          </div>

          <div className="flex flex-col items-center gap-2 md:gap-4 mb-6 md:mb-10">
            <img
              className="rounded-full w-24 h-24 md:w-40 md:h-40 object-cover"
              src="https://th.bing.com/th/id/OIP.kWvePlAUEgj3a66g8tq2QQHaFL?w=294&h=207&c=7&r=0&o=5&dpr=1.3&pid=1.7"
              alt=""
            />
            <h1 className="text-base md:text-lg font-semibold -mt-2">
              Tesla Limited
            </h1>
          </div>

          <div className="flex flex-col items-center gap-2 md:gap-4 mb-6 md:mb-10">
            <img
              className="rounded-full w-24 h-24 md:w-40 md:h-40 object-cover"
              src="https://th.bing.com/th/id/OIP.Wke6kPg4icygH7zZHpRnQAHaHa?w=194&h=194&c=7&r=0&o=5&dpr=1.3&pid=1.7"
              alt=""
            />
            <h1 className="text-base md:text-lg font-semibold -mt-2">SpaceX</h1>
          </div>

          <div className="flex flex-col items-center gap-2 md:gap-4 mb-6 md:mb-10">
            <img
              className="rounded-full w-24 h-24 md:w-40 md:h-40 object-cover"
              src="https://th.bing.com/th/id/OIP.fvq_FdQCFN-WYRxiX-v0ggHaE7?w=292&h=194&c=7&r=0&o=5&dpr=1.3&pid=1.7"
              alt=""
            />
            <h1 className="text-base md:text-lg font-semibold -mt-2">
              Narendra Modi
            </h1>
          </div>

          <div className="flex flex-col items-center gap-2 md:gap-4 mb-6 md:mb-10">
            <img
              className="rounded-full w-24 h-24 md:w-40 md:h-40 object-cover"
              src="https://th.bing.com/th/id/OIP.6ffA5Q1G2pAdbHK4Sf48rwHaHa?w=195&h=194&c=7&r=0&o=5&dpr=1.3&pid=1.7"
              alt=""
            />
            <h1 className="text-base md:text-lg font-semibold -mt-2">
              Aditya Group
            </h1>
          </div>

          <div className="flex flex-col items-center gap-2 md:gap-4 mb-6 md:mb-10">
            <img
              className="rounded-full w-24 h-24 md:w-40 md:h-40 object-cover"
              src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/company-logo-logo-design-template-1b22013fa16671b6cdf18f4da8c5b9df_screen.jpg?ts=1667145663"
              alt=""
            />
            <h1 className="text-base md:text-lg font-semibold -mt-2">Birla</h1>
          </div>
        </div>
      </div>

      <div className="bg-[#f8f8f8] w-full md:h-[74vh] h-[90vh]">
        <div className="absolute md:left-[20vw] md:mt-15 flex sm:flex-wrap flex-col items-center md:items-start gap-4 md:justify-between md:flex-row">
          <div>
            <img
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="w-40 md:mt-0 mt-10 md:w-45 cursor-pointer"
              src="https://res.cloudinary.com/dvdwjzjvf/image/upload/v1758366445/project/Sahaaya/Minimalistic_Sahaaya_Logo_Design_cxghbe_skvums.png"
              alt=""
            />
            <p className="w-90 hidden md:block mt-6 -ml-2 md:mr-30 text-small text-[#828282]">
              Is a movement to fight hunger and food waste by connecting surplus
              meals with people who need them the most. With the support of
              volunteers, partners, and compassionate individuals, we strive to
              create a hunger-free India where every plate counts and every hand
              makes a difference.
            </p>
          </div>

          <div className="flex md:px-0 px-11 flex-wrap md:flex-nowrap md:flex-row md:gap-20">
            <div className="flex md:flex-row md:gap-20 justify-between w-full">
              <div>
                <h1 className="font-semibold text-xl mt-6 mb-4 md:mb-8">
                  Who we are
                </h1>
                <p
                  onClick={() => {
                    scrollToSection(aboutusRef);
                  }}
                  className="text-small cursor-pointer mb-3 text-[#828282]"
                >
                  About us
                </p>
                <p
                  onClick={() => {
                    scrollToSection(ourworkRef);
                  }}
                  className="text-small cursor-pointer mb-3 text-[#828282]"
                >
                  Our work
                </p>
                <p
                  onClick={() => {
                    scrollToSection(partnerwithusRef);
                  }}
                  className="text-small cursor-pointer mb-3 text-[#828282]"
                >
                  Partner with us
                </p>
                <p className="text-small cursor-pointer mb-3 text-[#828282]">
                  Contact us
                </p>
                <p className="text-small cursor-pointer mb-3 text-[#828282]">
                  Blog
                </p>
                <p className="text-small cursor-pointer mb-3 text-[#828282]">
                  Policies
                </p>
              </div>
              <div>
                <h1 className="font-semibold text-xl mt-6 mb-4 md:mb-8">
                  Get involved
                </h1>
                <p
                  onClick={() => {
                    navigate("/Registration-Rider");
                  }}
                  className="text-small cursor-pointer mb-3 text-[#828282]"
                >
                  Volunteer
                </p>
                <p
                  onClick={() => {
                    navigate("/Registration-Donor");
                  }}
                  className="text-small cursor-pointer mb-3 text-[#828282]"
                >
                  Donor
                </p>
                <p
                  onClick={() => {
                    navigate("/Registration-Ngo");
                  }}
                  className="text-small cursor-pointer mb-3 text-[#828282]"
                >
                  Request for food
                </p>
              </div>
            </div>

            <div>
              <h1 className="font-semibold text-xl mt-6 mb-4 md:mb-8">
                Social media
              </h1>
              <div className="flex flex-row gap-1 mt-3">
                <Link to="https://www.facebook.com/" target="_blank" className="text-[#828282]">
                  <Icon
                    icon="entypo-social:facebook-with-circle"
                    height="27"
                    width="27"
                  />
                </Link>
                <Link to="https://www.linkedin.com/" target="_blank" className="text-[#828282]">
                  <Icon
                    icon="entypo-social:linkedin-with-circle"
                    height="27"
                    width="27"
                  />
                </Link>

                <Link to="https://www.instagram.com/" target="_blank" className="text-[#828282]">
                  <Icon
                    icon="entypo-social:instagram-with-circle"
                    height="27"
                    width="27"
                  />
                </Link>

                <Link to="https://twitter.com/" target="_blank" className="text-[#828282]">
                  <Icon
                    icon="entypo-social:twitter-with-circle"
                    height="27"
                    width="27"
                  />
                </Link>
              </div>
            </div>
          </div>

          <hr className="bg-black-900 h-1 px-40 mt-4 md:hidden" />
          <p className="px-10 md:hidden text-small text-[#828282] mb-10">
            Sahaaya is a movement to fight hunger and food waste by connecting
            surplus meals with people who need them the most. With the support
            of volunteers, partners, and compassionate individuals, we strive to
            create a hunger-free India where every plate counts and every hand
            makes a difference.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
