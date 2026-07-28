import React from "react";
import Logo from "./flow/Logo";
import { useNavigate } from "react-router-dom";

const Navbar = (props) => {
  const navigate = useNavigate();
  const scrollToSection = (ref) => {
    window.scrollTo({
      top: ref.current.offsetTop,
      behavior: "smooth",
    });
  };

  const linkCls =
    "text-sm font-medium tracking-wide text-white/80 hover:text-white transition-colors cursor-pointer";

  return (
    <div className="absolute top-0 left-0 right-0 z-20">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-4 flex items-center justify-between gap-4 flex-wrap">
        <Logo light />
        <div className="flex items-center gap-5 md:gap-8 flex-wrap">
          <h1 onClick={() => scrollToSection(props.aboutusRef)} className={linkCls}>
            About us
          </h1>
          <h1 onClick={() => scrollToSection(props.ourworkRef)} className={linkCls}>
            Our work
          </h1>
          <h1 onClick={() => scrollToSection(props.partnerwithusRef)} className={linkCls}>
            Partner with us
          </h1>
          <button
            onClick={() => {
              navigate("/Role");
            }}
            type="button"
            className="fbtn fbtn-flow fbtn-sm"
          >
            Join us
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
