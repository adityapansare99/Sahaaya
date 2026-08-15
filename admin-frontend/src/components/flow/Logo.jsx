import { Heart } from "lucide-react";

const SIZES = {
  sm: { mark: 26, name: "text-[15px]", sub: "text-[7px]" },
  md: { mark: 34, name: "text-xl", sub: "text-[8px]" },
  lg: { mark: 46, name: "text-3xl", sub: "text-[10px]" },
};

const Logo = ({
  size = "md",
  light = false,
  subtitle = true,
  onClick,
  className = "",
}) => {
  const s = SIZES[size] || SIZES.md;
  const nameColor = light ? "text-white" : "text-ink";
  const subColor = light ? "text-white/55" : "text-mute";
  return (
    <span
      onClick={onClick}
      className={
        "inline-flex items-center gap-2.5 " +
        (onClick ? "cursor-pointer " : "") +
        className
      }
    >
      <span
        className="flow-logo-mark"
        style={{ width: s.mark, height: s.mark }}
      >
        <Heart />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={
            "font-display font-bold tracking-tight " + s.name + " " + nameColor
          }
        >
          Sahaaya
        </span>
        {subtitle ? (
          <span
            className={
              "font-display font-semibold uppercase tracking-[0.22em] mt-1.5 " +
              s.sub +
              " " +
              subColor
            }
          >
            A Helping Hand
          </span>
        ) : null}
      </span>
    </span>
  );
};

export default Logo;
