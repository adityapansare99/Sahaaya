const TONE = {
  completed: "t-completed",
  accepted: "t-accepted",
  "picked up": "t-picked",
  pickedup: "t-picked",
  pending: "t-pending",
  cancelled: "t-cancelled",
  canceled: "t-cancelled",
  approved: "t-approved",
};

const StatusPill = ({ status, children, className = "" }) => {
  const key = String(status || "")
    .toLowerCase()
    .trim();
  const tone = TONE[key] || "t-pending";
  return (
    <span
      className={"status-pill " + tone + (className ? " " + className : "")}
    >
      {children || status}
    </span>
  );
};

export default StatusPill;
