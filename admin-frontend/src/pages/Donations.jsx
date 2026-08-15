import { useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext.jsx";
import AdminLayout from "../components/AdminLayout.jsx";
import Reveal from "../components/flow/Reveal.jsx";
import FlowSelect from "../components/flow/FlowSelect.jsx";
import StatusPill from "../components/flow/StatusPill.jsx";
import { SlidersHorizontal, PackageOpen } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "Pending", label: "Pending" },
  { value: "Accepted", label: "Accepted" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
];

const Donations = () => {
  const { backendurl, token } = useAdmin();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");

  const fetch = async (s) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${backendurl}admin/donations${s && s !== "all" ? `?status=${s}` : ""}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success) setData(res.data.data);
    } catch {
      toast.error("Error fetching donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const filterEl = (
    <div className="flex items-center gap-2" style={{ minWidth: 200 }}>
      <SlidersHorizontal
        style={{ width: 16, height: 16, color: "var(--color-mute)" }}
      />
      <FlowSelect
        value={status}
        onChange={(v) => {
          setStatus(v);
          fetch(v);
        }}
        options={STATUS_OPTIONS}
        ariaLabel="Filter by status"
      />
    </div>
  );

  return (
    <AdminLayout
      title="Donations"
      sub="Every surplus listing, across all statuses"
      actions={filterEl}
    >
      <Reveal spring className="admin-panel">
        {loading ? (
          <div style={{ padding: "6px 0" }}>
            {[...Array(6)].map((_, r) => (
              <div
                key={r}
                style={{
                  display: "flex",
                  gap: 16,
                  padding: "15px 18px",
                  borderBottom: "1px solid var(--color-line-2)",
                }}
              >
                {[...Array(7)].map((_, c) => (
                  <div
                    key={c}
                    className="flow-skel skel-line"
                    style={{ flex: c === 0 ? 1.6 : 1, height: 14 }}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flow-empty" style={{ margin: 18, border: "none" }}>
            <div className="ei">
              <PackageOpen />
            </div>
            <div>
              <div className="et">No donations found</div>
              <div className="ed">
                Try a different status filter, or check back once donors post
                surplus.
              </div>
            </div>
          </div>
        ) : (
          <div className="flow-table-scroll">
            <table className="flow-table">
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>NGO</th>
                  <th>Food type</th>
                  <th>Quantity</th>
                  <th>Weight</th>
                  <th>Serves</th>
                  <th>Status</th>
                  <th>Expiry</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item._id}>
                    <td style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                      {item.Donor?.name || "—"}
                    </td>
                    <td>{item.Ngo?.name || "—"}</td>
                    <td>{item.FoodType}</td>
                    <td style={{ color: "var(--color-mute)" }}>
                      {item.Quantity}
                    </td>
                    <td className="nums" style={{ color: "var(--color-mute)" }}>
                      {item.weightKg || 0} kg
                    </td>
                    <td className="nums" style={{ color: "var(--color-mute)" }}>
                      {item.serves || 0}
                    </td>
                    <td>
                      <StatusPill status={item.Status} />
                    </td>
                    <td style={{ color: "var(--color-mute)" }}>
                      {item.ExpiryDate
                        ? new Date(item.ExpiryDate).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Reveal>
    </AdminLayout>
  );
};

export default Donations;
