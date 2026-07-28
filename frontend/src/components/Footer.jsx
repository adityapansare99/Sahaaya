import React from "react";
import Logo from "./flow/Logo";
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

  const linkCls =
    "text-sm text-white/55 hover:text-ngo transition-colors cursor-pointer mb-3";
  const colTitle = "font-display font-semibold text-base text-white mb-4";

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8 py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo
              light
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="mb-5"
            />
            <p className="text-sm text-white/55 leading-relaxed max-w-xs">
              Is a movement to fight hunger and food waste by connecting surplus
              meals with people who need them the most. With the support of
              volunteers, partners, and compassionate individuals, we strive to
              create a hunger-free India where every plate counts and every hand
              makes a difference.
            </p>
          </div>

          <div>
            <h1 className={colTitle}>Who we are</h1>
            <p onClick={() => scrollToSection(props.aboutusRef)} className={linkCls}>
              About us
            </p>
            <p onClick={() => scrollToSection(props.ourworkRef)} className={linkCls}>
              Our work
            </p>
            <p onClick={() => scrollToSection(props.partnerwithusRef)} className={linkCls}>
              Partner with us
            </p>
            <p onClick={() => navigate("/Role")} className={linkCls}>
              Join us
            </p>
            <p onClick={() => navigate("/Login")} className={linkCls}>
              Sign in
            </p>
            <p
              onClick={() => (window.location.href = "mailto:support@sahaaya.com")}
              className={linkCls}
            >
              Contact us
            </p>
          </div>

          <div>
            <h1 className={colTitle}>Get involved</h1>
            <p onClick={() => navigate("/Registration-Donor")} className={linkCls}>
              Donate food
            </p>
            <p onClick={() => navigate("/Registration-Ngo")} className={linkCls}>
              Receive food
            </p>
            <p onClick={() => navigate("/Registration-Rider")} className={linkCls}>
              Deliver food
            </p>
            <p onClick={() => navigate("/Registration-Partner")} className={linkCls}>
              Partner restaurant
            </p>
          </div>

          <div>
            <h1 className={colTitle}>Social media</h1>
            <div className="flex flex-row gap-3 mt-2">
              <Link
                to="https://www.facebook.com/"
                target="_blank"
                className="text-white/55 hover:text-ngo transition-colors"
              >
                <Icon icon="entypo-social:facebook-with-circle" height="27" width="27" />
              </Link>
              <Link
                to="https://www.linkedin.com/"
                target="_blank"
                className="text-white/55 hover:text-ngo transition-colors"
              >
                <Icon icon="entypo-social:linkedin-with-circle" height="27" width="27" />
              </Link>
              <Link
                to="https://www.instagram.com/"
                target="_blank"
                className="text-white/55 hover:text-ngo transition-colors"
              >
                <Icon icon="entypo-social:instagram-with-circle" height="27" width="27" />
              </Link>
              <Link
                to="https://twitter.com/"
                target="_blank"
                className="text-white/55 hover:text-ngo transition-colors"
              >
                <Icon icon="entypo-social:twitter-with-circle" height="27" width="27" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
