import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAdmin } from "../context/AdminContext.jsx";
import AdminLayout from "../components/AdminLayout.jsx";
import CountUp from "../components/flow/CountUp.jsx";
import FlowRibbon from "../components/flow/FlowRibbon.jsx";
import Reveal from "../components/flow/Reveal.jsx";
import StatusPill from "../components/flow/StatusPill.jsx";
import FlowLoader from "../components/flow/FlowLoader.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Heart,
  Users,
  Bike,
  Store,
  Package,
  Truck,
  ArrowRight,
  PackageOpen,
} from "lucide-react";

const ROLE_GRAD = {
  ngo: "linear-gradient(140deg,var(--color-ngo),var(--color-ngo-2))",
  donor: "linear-gradient(140deg,var(--color-donor),var(--color-donor-2))",
  rider: "linear-gradient(140deg,var(--color-rider),var(--color-rider-2))",
  partner:
    "linear-gradient(140deg,var(--color-partner),var(--color-partner-2))",
};

const StatTile = ({ card, index }) => {
  const Icon = card.icon;
  return (
    <Reveal spring delay={index * 0.05}>
      <div className={"stat-tile role-" + card.role}>
        <div className="st-top">
          <div className="st-icon" style={{ background: ROLE_GRAD[card.role] }}>
            <Icon />
          </div>
        </div>
        <div className="st-value">
          <CountUp value={card.value} />
        </div>
        <div className="st-label">{card.title}</div>
        {card.split ? (
          <div className="st-split">
            <span className="ok">{card.split.ok} approved</span>
            {card.split.pend != null && (
              <span className="pend">{card.split.pend} pending</span>
            )}
          </div>
        ) : null}
      </div>
    </Reveal>
  );
};

const SkeletonTile = () => (
  <div className="stat-tile">
    <div className="st-top">
      <div
        className="flow-skel"
        style={{ width: 40, height: 40, borderRadius: 12 }}
      />
    </div>
    <div
      className="flow-skel skel-line"
      style={{ height: 30, width: "55%", marginTop: 4 }}
    />
    <div
      className="flow-skel skel-line"
      style={{ height: 13, width: "40%", marginTop: 12 }}
    />
    <div
      className="flow-skel skel-line"
      style={{ height: 11, width: "60%", marginTop: 14 }}
    />
  </div>
);

const Dashboard = () => {
  const { backendurl, token } = useAdmin();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${backendurl}admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setData(res.data.data);
        else toast.error("Failed to load dashboard");
      } catch {
        toast.error("Error loading dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [backendurl, token]);

  const cards = [
    {
      title: "NGOs",
      icon: Heart,
      role: "ngo",
      value: data?.ngos?.total,
      split: { ok: data?.ngos?.approved || 0, pend: data?.ngos?.pending },
    },
    {
      title: "Donors",
      icon: Users,
      role: "donor",
      value: data?.donors?.total,
      split: { ok: data?.donors?.approved || 0, pend: data?.donors?.pending },
    },
    {
      title: "Delivery Partners",
      icon: Bike,
      role: "rider",
      value: data?.delivery?.total,
      split: {
        ok: data?.delivery?.approved || 0,
        pend: data?.delivery?.pending,
      },
    },
    {
      title: "Restaurant Partners",
      icon: Store,
      role: "partner",
      value: data?.partners?.total,
      split: {
        ok: data?.partners?.approved || 0,
        pend: data?.partners?.pending,
      },
    },
    {
      title: "Donations",
      icon: Package,
      role: "donor",
      value: data?.donations?.total,
      split: {
        ok: data?.donations?.approved || 0,
        pend: data?.donations?.pending,
      },
    },
    { title: "Rides", icon: Truck, role: "rider", value: data?.rides?.total },
  ];

  const impact = [
    { v: data?.donors?.total, l: "Donors" },
    { v: data?.ngos?.total, l: "NGOs" },
    { v: data?.delivery?.total, l: "Delivery partners" },
    { v: data?.partners?.total, l: "Restaurant partners" },
    { v: data?.rides?.total, l: "Rides" },
  ];

  return (
    <AdminLayout title="Dashboard" sub="Platform-wide overview at a glance">
      {/* Hero — dark pipeline band */}
      <Reveal spring className="admin-hero-reveal">
        <section className="flow-hero admin-hero">
          <div className="admin-hero-inner">
            <div className="admin-hero-grid">
              <div>
                <div className="ah-greet">Operations overview</div>
                <h1 className="ah-stmt">
                  <CountUp value={data?.donations?.total} />
                  <span className="flow-grad-text">donations</span> routed
                  across the platform.
                </h1>
                <div className="admin-impact">
                  {impact.map((it) => (
                    <div className="ai" key={it.l}>
                      <div className="aiv">
                        <CountUp value={it.v} />
                      </div>
                      <div className="ail">{it.l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="admin-hero-ribbon">
                <FlowRibbon />
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Bento — one role-accented tile per entity */}
      <div className="admin-bento">
        {loading
          ? [...Array(6)].map((_, i) => <SkeletonTile key={i} />)
          : cards.map((c, i) => <StatTile key={c.title} card={c} index={i} />)}
      </div>

      {/* Recent donations */}
      <Reveal spring className="admin-panel" delay={0.05}>
        <div className="admin-panel-head">
          <span className="aph-title">Recent donations</span>
          <Link to="/donations" className="fbtn fbtn-g fbtn-sm">
            View all <ArrowRight />
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: 24 }}>
            {[...Array(4)].map((_, i) => (
              <div
                className="flow-skel skel-line"
                key={i}
                style={{ height: 16, marginBottom: 16 }}
              />
            ))}
          </div>
        ) : data?.recentDonations?.length > 0 ? (
          <div className="flow-table-scroll">
            <table className="flow-table">
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>NGO</th>
                  <th>Food type</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recentDonations.map((d) => (
                  <tr key={d._id}>
                    <td style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                      {d.Donor?.name || "—"}
                    </td>
                    <td>{d.Ngo?.name || "—"}</td>
                    <td>{d.FoodType}</td>
                    <td>
                      <StatusPill status={d.Status} />
                    </td>
                    <td style={{ color: "var(--color-mute)" }}>
                      {d.createdAt
                        ? new Date(d.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flow-empty" style={{ margin: 16, border: "none" }}>
            <div className="ei">
              <PackageOpen />
            </div>
            <div>
              <div className="et">No donations yet</div>
              <div className="ed">
                Donations will appear here as soon as donors start posting
                surplus.
              </div>
            </div>
          </div>
        )}
      </Reveal>
    </AdminLayout>
  );
};

export default Dashboard;
