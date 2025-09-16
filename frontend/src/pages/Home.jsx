import React from "react";

const Home = () => {
  return (
    <div>
      <div className="w-full h-screen relative">
        <img
          className="w-full h-full object-fit"
          src="https://res.cloudinary.com/dvdwjzjvf/image/upload/v1757965856/project/Sahaaya/image_ipc2mm.png"
          alt=""
          srcset=""
        />

        <div className="absolute py-1 -mt-6 top-0 left-[20vw] z-10 flex flex-row justify-center items-center gap-6">
          <img
            className="w-70"
            src="https://res.cloudinary.com/dvdwjzjvf/image/upload/v1757965849/project/Sahaaya/logo_ogqpfq.png"
            alt=""
          />
          <div className="flex flex-row justify-between items-center gap-12">
            <h1 className="text-lg text-white">ABOUT US</h1>
            <h1 className="text-lg text-white">OUR WORK</h1>
            <h1 className="text-lg text-white">PARTNER WITH US</h1>
            <hr className="w-1 h-10 bg-white" />
            <button
              type="button"
              className="text-lg py-3 px-6   bg-[#EF4F5F] text-white rounded-lg"
            >
              JOIN US
            </button>
          </div>
        </div>

        <div className="absolute bottom-[10vh] left-[20vw] z-10">
          <h2 className="text-white text-5xl mb-2 font-bold">
            Hunger Free India
          </h2>
          <p className="text-white text-2xl font-medium">
            Serving meals daily to those in need, everywhere in India.
          </p>
          <button
            type="button"
            className="text-lg py-3 px-6 mt-4 bg-[#EF4F5F] text-white rounded-lg"
          >
            JOIN US
          </button>
        </div>
      </div>

      {/* about us */}
      <div className="h-screen flex flex-col px-[20vw] mt-40">
        <div className="flex flex-row align-center justify-between gap-6 mb-20">
          <div className="w-1/2 flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-6">Mission</h1>
            <p className="text-lg">
              To reduce food waste and fight hunger by connecting restaurants,
              event organizers, and individuals with leftover food to verified
              NGOs who can distribute it to those in need.
            </p>
          </div>
          <img
            className="w-1/2 h-70 rounded-xl"
            src="https://media.cntraveller.in/wp-content/uploads/2020/02/Feeding-India-Zomato.jpg"
            alt=""
          />
        </div>

        <div className="flex flex-row align-center justify-between gap-6 mt-20">
          <img
            className="w-1/2 h-70 rounded-xl"
            src="https://tatsatchronicle.com/wp-content/uploads/2022/01/Akshaya-Patra-Foundation-.jpg"
            alt=""
          />
          <div className="w-1/2 flex flex-col justify-center ml-5">
            <h1 className="text-4xl font-bold mb-6">Vision</h1>
            <p className="text-lg">
              To build a sustainable ecosystem where no edible food goes to
              waste and every extra meal becomes a lifeline for someone in need
              — creating a hunger-free and compassionate India.
            </p>
          </div>
        </div>
      </div>

      {/* our work */}

      <div className="flex flex-col px-[20vw] h-screen">
        <h1 className="text-4xl font-bold text-center mt-20">
          The Journey So Far
        </h1>

        <div className="mt-15 bg-[#f8f8f8] h-40 rounded-lg px-10 flex flex-col justify-center items-center tracking-wider">
          <p className="text-4xl font-semibold">Total meals served: <span className="text-[#EF4F5F]">20 crores</span> and counting....</p>
        </div>

      </div>

    </div>
  );
};

export default Home;
