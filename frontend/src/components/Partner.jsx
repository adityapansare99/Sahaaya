import React, { useEffect, useState } from "react";

const Partner = (props) => {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}partner/list`
        );
        const data = await res.json();
        if (data.success) setPartners(data.data);
      } catch (err) {
        // silently fail
      }
    };
    fetchPartners();
  }, []);

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
          {partners.length === 0 ? (
            <p className="col-span-full text-center text-gray-400 py-10 text-lg">
              No partner restaurants yet
            </p>
          ) : (
            partners.map((p, i) => (
              <div key={p._id || i} className="flex flex-col items-center gap-2 md:gap-4 mb-6 md:mb-10">
                <img
                  className="rounded-full w-24 h-24 md:w-32 md:h-32 object-cover border border-gray-200"
                  src={p.logo || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt={p.name}
                />
                <h1 className="text-sm md:text-lg font-semibold text-center text-gray-800 mt-2">
                  {p.name}
                </h1>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Partner;
