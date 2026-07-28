import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Partner from "../components/Partner";
import Footer from "../components/Footer";
import FlowRibbon from "../components/flow/FlowRibbon";
import CountUp from "../components/flow/CountUp";
import LiveChip from "../components/flow/LiveChip";
import axios from "axios";

const Home = () => {
  const aboutusRef = useRef(null);
  const ourworkRef = useRef(null);
  const partnerwithusRef = useRef(null);
  const [totalMeals, setTotalMeals] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}stats`)
      .then((res) => {
        if (res.data.success) setTotalMeals(res.data.data.totalMealsServed);
      })
      .catch(() => {});
  }, []);

  const formatNumber = (num) => {
    if (num === null) return "Loading...";
    if (num >= 10000000) return (num / 10000000).toFixed(1) + " crores";
    if (num >= 100000) return (num / 100000).toFixed(1) + " lakhs";
    return num.toLocaleString();
  };

  const scrollToSection = (ref) => {
    window.scrollTo({
      top: ref.current.offsetTop,
      behavior: "smooth",
    });
  };

  const navigate = useNavigate();

  return (
    <div className="bg-canvas">
      {/* ===================== HERO ===================== */}
      <section className="flow-hero">
        <Navbar
          aboutusRef={aboutusRef}
          ourworkRef={ourworkRef}
          partnerwithusRef={partnerwithusRef}
        />

        <div className="relative z-10 mx-auto max-w-[1200px] px-5 md:px-8 pt-32 md:pt-44">
          <div className="max-w-2xl">
            <LiveChip dark>Live · food on the move</LiveChip>
            <h1 className="fh-stmt mt-5">
              Hunger Free <span className="flow-grad-text">India</span>
            </h1>
            <p className="fh-sub mt-4">
              Serving meals daily to those in need, everywhere in India.
            </p>
            <div className="mt-7">
              <button
                onClick={() => {
                  navigate("/Role");
                }}
                type="button"
                className="fbtn fbtn-flow"
              >
                Join us
              </button>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-[1200px] px-5 md:px-8 pt-14 pb-16 md:pb-24">
          <div className="flow-ribbon-scroll">
            <FlowRibbon />
          </div>
        </div>
      </section>

      {/* ===================== ABOUT (Mission / Vision) ===================== */}
      <section
        ref={aboutusRef}
        className="mx-auto max-w-[1200px] px-5 md:px-8 py-20 md:py-28"
      >
        <div className="sec-divider">
          <span className="sd-num">01</span>
          <span className="sd-title">Who we are</span>
          <span className="sd-rule" />
        </div>

        <div className="grid gap-5 md:gap-6 md:grid-cols-2">
          <div className="flow-tile p-6 md:p-8 flex flex-col">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">
              Mission
            </h2>
            <span className="inline-block w-10 h-1 rounded-full bg-donor mt-3" />
            <p className="text-ink-2 leading-relaxed mt-4">
              To reduce food waste and fight hunger by connecting restaurants,
              event organizers, and individuals with leftover food to verified
              NGOs who can distribute it to those in need.
            </p>
            <img
              className="mt-5 rounded-xl h-40 md:h-48 w-full object-cover"
              src="https://media.cntraveller.in/wp-content/uploads/2020/02/Feeding-India-Zomato.jpg"
              alt=""
            />
          </div>

          <div className="flow-tile p-6 md:p-8 flex flex-col">
            <img
              className="rounded-xl h-40 md:h-48 w-full object-cover"
              src="https://tatsatchronicle.com/wp-content/uploads/2022/01/Akshaya-Patra-Foundation-.jpg"
              alt=""
            />
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mt-5">
              Vision
            </h2>
            <span className="inline-block w-10 h-1 rounded-full bg-ngo mt-3" />
            <p className="text-ink-2 leading-relaxed mt-4">
              To build a sustainable ecosystem where no edible food goes to
              waste and every extra meal becomes a lifeline for someone in need
              — creating a hunger-free and compassionate India.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== OUR WORK (impact typo-band) ===================== */}
      <section ref={ourworkRef} className="typo-band">
        <LiveChip dark>The journey so far</LiveChip>
        <div className="tb-num">
          <CountUp value={totalMeals} />
        </div>
        <p className="tb-sub">total meals served · and counting</p>
        <p className="mt-2 text-sm text-white/60 nums">
          {formatNumber(totalMeals)}
        </p>
      </section>

      {/* PARTNER WITH US */}
      <Partner partnerwithusRef={partnerwithusRef} />

      {/* Footer */}
      <Footer
        aboutusRef={aboutusRef}
        ourworkRef={ourworkRef}
        partnerwithusRef={partnerwithusRef}
      />
    </div>
  );
};

export default Home;
