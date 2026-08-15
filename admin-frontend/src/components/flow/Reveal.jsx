import { useEffect, useRef } from "react";

const Reveal = ({
  as: Tag = "div",
  spring = false,
  delay = 0,
  className = "",
  children,
  ...rest
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style = delay ? { "--d": delay + "s" } : undefined;

  return (
    <Tag
      ref={ref}
      className={
        "reveal" +
        (spring ? " spring" : "") +
        (className ? " " + className : "")
      }
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
