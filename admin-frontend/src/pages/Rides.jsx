import { useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext.jsx";
import AdminLayout from "../components/AdminLayout.jsx";
import Reveal from "../components/flow/Reveal.jsx";
import StatusPill from "../components/flow/StatusPill.jsx";
import { Bike, Route } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const RouteMini = ({ pickup, destination }) => (
  <div className="flow-route-mini">
    <span className="pt a" title={pickup}>
      {pickup || "—"}
    </span>
    <span className="lane">
      <span className="flow" />
      <span className="bead" />
    </span>
    <span className="pt b" title={destination}>
      {destination || "—"}
    </span>
  </div>
);

const Rides = () => {
  const { backendurl, token } = useAdmin();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${backendurl}admin/rides`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setData(res.data.data);
      } catch {
        toast.error("Error fetching rides");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [backendurl, token]);

  return (
    <AdminLayout
      title="Rides"
      sub="Delivery runs from donor pickup to NGO drop-off"
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
                {[...Array(6)].map((_, c) => (
                  <div
                    key={c}
                    className="flow-skel skel-line"
                    style={{ flex: c === 3 ? 2 : 1, height: 14 }}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flow-empty" style={{ margin: 18, border: "none" }}>
            <div className="ei">
              <Route />
            </div>
            <div>
              <div className="et">No rides found</div>
              <div className="ed">
                Rides are created when a rider accepts a delivery for an
                accepted donation.
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
                  <th>Rider</th>
                  <th>Route</th>
                  <th>Status</th>
                  <th>Distance</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item._id}>
                    <td style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                      {item.donor?.name || "—"}
                    </td>
                    <td>{item.receiver?.name || "—"}</td>
                    <td>
                      <span className="inline-flex items-center gap-1.5">
                        <Bike
                          style={{
                            width: 14,
                            height: 14,
                            color: "var(--color-rider)",
                          }}
                        />
                        {item.rider?.name || "—"}
                      </span>
                    </td>
                    <td>
                      <RouteMini
                        pickup={item.pickup}
                        destination={item.destination}
                      />
                    </td>
                    <td>
                      <StatusPill status={item.status} />
                    </td>
                    <td className="nums" style={{ color: "var(--color-mute)" }}>
                      {item.distance || "—"}
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

export default Rides;
