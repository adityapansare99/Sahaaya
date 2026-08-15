import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";

const FlowSelect = ({
  value,
  onChange,
  options = [],
  placeholder = "Select…",
  ariaLabel,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const triggerRef = useRef(null);
  const popperRef = useRef(null);
  const listRef = useRef(null);

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  const measure = () => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setCoords({
      top: r.bottom + window.scrollY + 6,
      left: r.left + window.scrollX,
      width: r.width,
    });
  };

  const openMenu = () => {
    measure();
    setOpen(true);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
  };

  const selectIndex = (i) => {
    const opt = options[i];
    if (opt) onChange?.(opt.value);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    measure();
    const onAny = () => measure();
    window.addEventListener("scroll", onAny, true);
    window.addEventListener("resize", onAny);
    return () => {
      window.removeEventListener("scroll", onAny, true);
      window.removeEventListener("resize", onAny);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (
        triggerRef.current?.contains(e.target) ||
        popperRef.current?.contains(e.target)
      )
        return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const node = listRef.current?.querySelector(`[data-idx="${activeIndex}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const onTriggerKey = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) openMenu();
        else setActiveIndex((i) => Math.min(i + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) openMenu();
        else setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (!open) openMenu();
        else if (activeIndex >= 0) selectIndex(activeIndex);
        break;
      case "Escape":
        if (open) setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        ref={triggerRef}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onTriggerKey}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="flow-input flex items-center justify-between gap-3 cursor-pointer text-left"
      >
        <span
          className={`flex items-center gap-2 truncate min-w-0 ${selected ? "text-ink" : "text-mute-2"}`}
        >
          {selected?.icon && (
            <span className="w-5 text-center text-base leading-none">
              {selected.icon}
            </span>
          )}
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-mute shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open &&
        createPortal(
          <div
            ref={popperRef}
            role="listbox"
            aria-label={ariaLabel}
            className="z-60 max-h-60 overflow-y-auto p-1.5"
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
              width: coords.width,
              background: "var(--color-surface)",
              border: "1px solid var(--color-line)",
              borderRadius: "var(--r-lg)",
              boxShadow: "var(--sh-md)",
              animation: "d4slidein .14s ease-out",
            }}
          >
            <div ref={listRef}>
              {options.map((o, i) => {
                const isSel = i === selectedIndex;
                const isActive = i === activeIndex;
                return (
                  <button
                    type="button"
                    key={o.value}
                    data-idx={i}
                    role="option"
                    aria-selected={isSel}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => selectIndex(i)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors cursor-pointer ${
                      isActive ? "bg-surface-2" : ""
                    } ${isSel ? "text-ink font-medium" : "text-ink-2"}`}
                  >
                    {o.icon && (
                      <span className="w-5 text-center text-base leading-none">
                        {o.icon}
                      </span>
                    )}
                    <span className="flex-1 truncate">{o.label}</span>
                    {isSel && (
                      <Check
                        className="w-4 h-4 shrink-0"
                        style={{ color: "var(--color-ink)" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default FlowSelect;
