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
    <section
      ref={props.partnerwithusRef}
      className="mx-auto max-w-[1200px] px-5 md:px-8 py-20 md:py-28"
    >
      <div className="sec-divider">
        <span className="sd-num">02</span>
        <span className="sd-title">Hands Together for a Better Tomorrow</span>
        <span className="sd-rule" />
      </div>

      {partners.length === 0 ? (
        <div
          className="flow-tile p-10 text-center"
          style={{ borderStyle: "dashed" }}
        >
          <p className="text-mute text-lg">No partner restaurants yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {partners.map((p, i) => (
            <div
              key={p._id || i}
              className="flow-tile p-4 md:p-5 flex flex-col items-center text-center"
            >
              <img
                className="rounded-2xl w-20 h-20 md:w-24 md:h-24 object-cover border border-line"
                src={p.logo || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt={p.name}
              />
              <h3 className="font-display text-sm md:text-base font-semibold text-ink mt-3">
                {p.name}
              </h3>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Partner;
