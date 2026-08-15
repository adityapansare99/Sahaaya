const LiveChip = ({ tone = "ngo", dark = false, children, className = "" }) => {
  const toneClass = dark ? " dark" : tone && tone !== "ngo" ? " " + tone : "";
  return (
    <span
      className={"livechip" + toneClass + (className ? " " + className : "")}
    >
      <span className="lc-dot" />
      {children}
    </span>
  );
};

export default LiveChip;
