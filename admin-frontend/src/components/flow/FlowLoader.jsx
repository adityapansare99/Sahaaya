const FlowLoader = ({ label = "Loading…", fullScreen = false }) => {
  return (
    <div
      className={fullScreen ? "flow-loader flow-loader--fs" : "flow-loader"}
      role="status"
      aria-live="polite"
    >
      <div className="flow-loader-ring" />
      {label && <span className="flow-loader-label">{label}</span>}
    </div>
  );
};

export default FlowLoader;
