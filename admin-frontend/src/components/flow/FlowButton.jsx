import { useRef } from "react";

const FlowButton = ({
  variant = "p",
  size,
  type = "button",
  className = "",
  children,
  onClick,
  ...rest
}) => {
  const ref = useRef(null);
  const variantClass =
    variant === "flow" ? "fbtn-flow" : variant === "g" ? "fbtn-g" : "fbtn-p";
  const sizeClass = size === "sm" ? "fbtn-sm" : "";

  const handleClick = (e) => {
    const b = ref.current;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (b && !reduce) {
      const r = b.getBoundingClientRect();
      const s = document.createElement("span");
      s.className = "rip";
      const sz = Math.max(r.width, r.height) * 1.2;
      s.style.width = s.style.height = sz + "px";
      s.style.left = e.clientX - r.left - sz / 2 + "px";
      s.style.top = e.clientY - r.top - sz / 2 + "px";
      b.appendChild(s);
      setTimeout(() => {
        if (s.parentNode) s.parentNode.removeChild(s);
      }, 560);
    }
    onClick?.(e);
  };

  const handleMove = (e) => {
    const b = ref.current;
    if (!b) return;
    if (variant !== "p" && variant !== "flow") return;
    const r = b.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / r.width;
    const y = (e.clientY - r.top - r.height / 2) / r.height;
    b.style.setProperty("--mx", (x * 8).toFixed(2) + "px");
    b.style.setProperty("--my", (y * 10 - 1.5).toFixed(2) + "px");
  };

  const handleLeave = () => {
    const b = ref.current;
    if (!b) return;
    b.style.setProperty("--mx", "");
    b.style.setProperty("--my", "");
  };

  return (
    <button
      ref={ref}
      type={type}
      onClick={handleClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={
        "fbtn " +
        variantClass +
        (sizeClass ? " " + sizeClass : "") +
        (className ? " " + className : "")
      }
      {...rest}
    >
      {children}
    </button>
  );
};

export default FlowButton;
