import { useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext.jsx";
import AdminLayout from "./AdminLayout.jsx";
import Reveal from "./flow/Reveal.jsx";
import StatusPill from "./flow/StatusPill.jsx";
import { Search, CheckCircle2, XCircle, Trash2, Inbox } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const tdName = { style: { color: "var(--color-ink)", fontWeight: 600 } };
const tdMute = { style: { color: "var(--color-mute)" } };
const tdNum = {
  className: "nums",
  style: { color: "var(--color-ink)", fontWeight: 600 },
};

export { tdName, tdMute, tdNum };

const SkeletonRows = ({ rows = 6, cols = 5 }) => (
  <div style={{ padding: "6px 0" }}>
    {[...Array(rows)].map((_, r) => (
      <div
        key={r}
        style={{
          display: "flex",
          gap: 16,
          padding: "15px 18px",
          borderBottom: "1px solid var(--color-line-2)",
        }}
      >
        {[...Array(cols)].map((_, c) => (
          <div
            key={c}
            className="flow-skel skel-line"
            style={{ flex: c === 0 ? 1.6 : 1, height: 14 }}
          />
        ))}
      </div>
    ))}
  </div>
);

const Empty = ({ label }) => (
  <div className="flow-empty" style={{ margin: 18, border: "none" }}>
    <div className="ei">
      <Inbox />
    </div>
    <div>
      <div className="et">No {label.toLowerCase()} found</div>
      <div className="ed">
        Try a different search, or check back once new records are created.
      </div>
    </div>
  </div>
);

const EntityPage = ({
  title,
  sub,
  apiPath,
  columns,
  renderRow,
  searchPlaceholder,
}) => {
  const { backendurl, token } = useAdmin();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetch = async (q) => {
    try {
      const res = await axios.get(
        `${backendurl}admin/${apiPath}${q ? `?search=${q}` : ""}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.data.success) setData(res.data.data);
      else toast.error("Failed to fetch data");
    } catch {
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await axios.put(
        `${backendurl}admin/${apiPath}/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        fetch(search);
      }
    } catch {
      toast.error("Error toggling approval");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await axios.delete(`${backendurl}admin/${apiPath}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        toast.success("Deleted successfully");
        fetch(search);
      }
    } catch {
      toast.error("Error deleting");
    }
  };

  const searchEl = (
    <div className="admin-search">
      <Search />
      <input
        type="text"
        className="flow-input"
        placeholder={searchPlaceholder || "Search by name or email…"}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          fetch(e.target.value);
        }}
      />
    </div>
  );

  return (
    <AdminLayout title={title} sub={sub} actions={searchEl}>
      <Reveal spring className="admin-panel">
        {loading ? (
          <SkeletonRows cols={columns.length} />
        ) : data.length === 0 ? (
          <Empty label={title} />
        ) : (
          <div className="flow-table-scroll">
            <table className="flow-table">
              <thead>
                <tr>
                  {columns.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item) =>
                  renderRow(
                    item,
                    () => handleApprove(item._id),
                    () => handleDelete(item._id),
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </Reveal>
    </AdminLayout>
  );
};

const Badge = ({
  condition,
  trueLabel = "Approved",
  falseLabel = "Pending",
}) => (
  <StatusPill status={condition ? "approved" : "pending"}>
    {condition ? trueLabel : falseLabel}
  </StatusPill>
);

const ActionButtons = ({ approved, onApprove, onDelete }) => (
  <div className="flex items-center gap-1">
    <button
      onClick={onApprove}
      title={approved ? "Disapprove" : "Approve"}
      className={"icon-btn " + (approved ? "unapprove" : "approve")}
    >
      {approved ? <XCircle /> : <CheckCircle2 />}
    </button>
    <button onClick={onDelete} title="Delete" className="icon-btn delete">
      <Trash2 />
    </button>
  </div>
);

export { EntityPage, Badge, ActionButtons };
