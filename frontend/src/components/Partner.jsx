import React from "react";

const Partner = (props) => {
  return (
    <div>
      <div
        ref={props.partnerwithusRef}
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
    </div>
  );
};

export default Partner;
