import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const Footer = (props) => {
  const navigate = useNavigate();

  const scrollToSection = (ref) => {
    window.scrollTo({
      top: ref.current.offsetTop,
      behavior: "smooth",
    });
  };

  return (
    <div>
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
                  onClick={() => scrollToSection(props.aboutusRef)}
                  className="text-small cursor-pointer mb-3 text-[#828282] hover:text-red-500"
                >
                  About us
                </p>
                <p
                  onClick={() => scrollToSection(props.ourworkRef)}
                  className="text-small cursor-pointer mb-3 text-[#828282] hover:text-red-500"
                >
                  Our work
                </p>
                <p
                  onClick={() => scrollToSection(props.partnerwithusRef)}
                  className="text-small cursor-pointer mb-3 text-[#828282] hover:text-red-500"
                >
                  Partner with us
                </p>
                <p
                  onClick={() => navigate("/Role")}
                  className="text-small cursor-pointer mb-3 text-[#828282] hover:text-red-500"
                >
                  Join us
                </p>
                <p
                  onClick={() => navigate("/Login")}
                  className="text-small cursor-pointer mb-3 text-[#828282] hover:text-red-500"
                >
                  Sign in
                </p>
                <p
                  onClick={() => window.location.href = "mailto:support@sahaaya.com"}
                  className="text-small cursor-pointer mb-3 text-[#828282] hover:text-red-500"
                >
                  Contact us
                </p>
              </div>
              <div>
                <h1 className="font-semibold text-xl mt-6 mb-4 md:mb-8">
                  Get involved
                </h1>
                <p
                  onClick={() => navigate("/Registration-Donor")}
                  className="text-small cursor-pointer mb-3 text-[#828282] hover:text-red-500"
                >
                  Donate food
                </p>
                <p
                  onClick={() => navigate("/Registration-Ngo")}
                  className="text-small cursor-pointer mb-3 text-[#828282] hover:text-red-500"
                >
                  Receive food
                </p>
                <p
                  onClick={() => navigate("/Registration-Rider")}
                  className="text-small cursor-pointer mb-3 text-[#828282] hover:text-red-500"
                >
                  Deliver food
                </p>
                <p
                  onClick={() => navigate("/Registration-Partner")}
                  className="text-small cursor-pointer mb-3 text-[#828282] hover:text-red-500"
                >
                  Partner restaurant
                </p>
              </div>
            </div>

            <div>
              <h1 className="font-semibold text-xl mt-6 mb-4 md:mb-8">
                Social media
              </h1>
              <div className="flex flex-row gap-1 mt-3">
                <Link
                  to="https://www.facebook.com/"
                  target="_blank"
                  className="text-[#828282] hover:text-red-500"
                >
                  <Icon icon="entypo-social:facebook-with-circle" height="27" width="27" />
                </Link>
                <Link
                  to="https://www.linkedin.com/"
                  target="_blank"
                  className="text-[#828282] hover:text-red-500"
                >
                  <Icon icon="entypo-social:linkedin-with-circle" height="27" width="27" />
                </Link>
                <Link
                  to="https://www.instagram.com/"
                  target="_blank"
                  className="text-[#828282] hover:text-red-500"
                >
                  <Icon icon="entypo-social:instagram-with-circle" height="27" width="27" />
                </Link>
                <Link
                  to="https://twitter.com/"
                  target="_blank"
                  className="text-[#828282] hover:text-red-500"
                >
                  <Icon icon="entypo-social:twitter-with-circle" height="27" width="27" />
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

export default Footer;
