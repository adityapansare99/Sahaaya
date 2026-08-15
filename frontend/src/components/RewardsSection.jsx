import React, { useContext, useEffect, useState } from "react";
import { Award, Star, Target, Trophy, Package } from "lucide-react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import CountUp from "./flow/CountUp";

const PointsRing = ({ points, redeemGoal = 500 }) => {
  const pct = redeemGoal > 0 ? Math.min(1, (points % redeemGoal) / redeemGoal) : 0;
  const R = 52;
  const C = 2 * Math.PI * R;
  const off = C * (1 - pct);
  return (
    <div className="shrink-0 flex flex-col items-center justify-center" style={{ width: 124, height: 124 }}>
      <svg width="124" height="124" viewBox="0 0 124 124" style={{ transform: "rotate(-90deg)", position: "absolute" }}>
        <circle cx="62" cy="62" r={R} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="9" />
        <circle
          cx="62" cy="62" r={R} fill="none" stroke="url(#rwgrad)" strokeWidth="9" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C}
          style={{ "--off": off, animation: "d4fillring 1.5s var(--ease-out) .2s forwards" }}
        />
      </svg>
      <div className="flex flex-col items-center justify-center h-full">
        <span className="font-display font-bold text-2xl text-white nums"><CountUp value={points} /></span>
        <span className="text-[10px] text-white/55">points</span>
      </div>
    </div>
  );
};

const TINT = {
  rider: { bg: "var(--color-rider-soft)", fg: "var(--color-rider-2)" },
  donor: { bg: "var(--color-donor-soft)", fg: "var(--color-donor-2)" },
};
const StatTile = ({ icon: Icon, tint, value, label, sub }) => {
  const t = TINT[tint];
  return (
    <div className="flow-tile p-5">
      <div className="inline-grid place-items-center w-10 h-10 rounded-xl mb-3" style={{ background: t.bg, color: t.fg }}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="font-display text-3xl font-bold text-ink nums">{value}</div>
      <div className="text-sm font-semibold text-ink-2 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-mute mt-1">{sub}</div>}
    </div>
  );
};

const RewardsSection = () => {
  const { backendurl, token } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await axios.get(`${backendurl}rider/rewards`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setData(response.data.data);
        } else {
          toast.error("Failed to load rewards");
        }
      } catch (error) {
        toast.error("Error fetching rewards");
      } finally {
        setLoading(false);
      }
    };
    fetchRewards();
  }, [backendurl, token]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-2">
          <div className="flow-skel skel-line w-48 mb-2" style={{ height: 30 }} />
          <div className="flow-skel skel-line w-64" />
        </div>
        <div className="flow-panel" style={{ height: 180 }} />
        <div className="grid md:grid-cols-2 gap-5">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flow-panel p-6 space-y-3">
              <div className="flow-skel" style={{ width: 40, height: 40, borderRadius: 12 }} />
              <div className="flow-skel skel-line w-20" style={{ height: 26 }} />
              <div className="flow-skel skel-line w-28" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="mb-7">
          <h2 className="font-display text-3xl font-bold text-ink mb-2">Rewards & Impact</h2>
          <p className="text-mute">Track your contributions and achievements</p>
        </div>
        <div className="flow-empty flex-col items-center text-center py-14">
          <div className="ei"><Award className="w-6 h-6" /></div>
          <div>
            <div className="et">No rewards data yet</div>
            <div className="ed">Complete deliveries to start earning points and rewards.</div>
          </div>
        </div>
      </div>
    );
  }

  const {
    points = 0,
    redeemedPoints = 0,
    totalDeliveries = 0,
    rating = 0,
    milestones = [],
  } = data;

  const badges = [
    { title: "First Delivery", desc: "Complete your first delivery", current: totalDeliveries, target: 1, unit: "", icon: Package },
    { title: "Century Rider", desc: "Complete 100 deliveries", current: totalDeliveries, target: 100, unit: "", icon: Trophy },
    { title: "Point Collector", desc: "Earn 500 points", current: points + redeemedPoints, target: 500, unit: " pts", icon: Award },
    { title: "Top Rated", desc: "Maintain a 4.5+ rating", current: rating, target: 4.5, unit: "★", icon: Star },
  ].map((b) => {
    const current = b.current || 0;
    const unlocked = current >= b.target;
    const progress = Math.min(100, Math.round((current / b.target) * 100));
    return { ...b, current, unlocked, progress };
  });

  return (
    <div className="space-y-6">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <linearGradient id="rwgrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#0fa968" />
          </linearGradient>
        </defs>
      </svg>

      <div className="mb-2">
        <h2 className="font-display text-3xl font-bold text-ink mb-2">Rewards & Impact</h2>
        <p className="text-mute">Track your contributions and achievements</p>
      </div>

      {/* Hero — points balance + ring */}
      <div
        className="relative overflow-hidden rounded-[var(--r-xl)]"
        style={{ background: "linear-gradient(162deg,#0e1f1a 0%,#122821 55%,#0b1a15 100%)", color: "#eaf3ee" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)",
            backgroundSize: "30px 30px",
            maskImage: "radial-gradient(120% 120% at 30% 0%,#000,transparent 75%)",
            WebkitMaskImage: "radial-gradient(120% 120% at 30% 0%,#000,transparent 75%)",
          }}
        />
        <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="font-display text-[11px] font-bold tracking-[0.18em] uppercase text-white/55 mb-2">
              Points Balance
            </div>
            <div
              className="font-display font-bold nums"
              style={{ fontSize: "clamp(40px,6vw,64px)", lineHeight: 0.9, letterSpacing: "-2px", color: "#fff" }}
            >
              <CountUp value={points} />
            </div>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-white/60 pt-3 border-t border-white/10">
              <span className="nums"><b className="text-white/85 font-display font-bold">{redeemedPoints}</b> redeemed</span>
              <span className="nums"><b className="text-white/85 font-display font-bold">{totalDeliveries}</b> deliveries</span>
            </div>
          </div>
          <PointsRing points={points} />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid md:grid-cols-2 gap-5">
        <StatTile icon={Package} tint="rider" value={totalDeliveries} label="Total Deliveries" sub="Lifetime deliveries completed" />
        <StatTile icon={Star} tint="donor" value={rating ? rating.toFixed(1) : "—"} label="Rating" sub="Average service rating" />
      </div>

      {/* Badges — trophy milestone cards */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-mute" />
          <h3 className="font-display text-base font-semibold text-ink">Achievement Badges</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {badges.map((b, i) => {
            const Icon = b.icon;
            const unlocked = b.unlocked;
            const left = b.target - Math.min(b.current, b.target);
            return (
              <div
                key={i}
                className="relative overflow-hidden"
                style={{
                  borderRadius: "var(--r-lg)",
                  background: unlocked ? "linear-gradient(135deg,#f8fbf9 0%,#edf7f0 100%)" : "var(--color-surface)",
                  border: "1px solid",
                  borderColor: unlocked ? "rgba(var(--ngo-rgb),.2)" : "var(--color-line)",
                  boxShadow: unlocked ? "0 4px 20px -8px rgba(var(--ngo-rgb),.18)" : "0 1px 3px rgba(14,31,26,.04)",
                  transition: "transform .25s var(--ease-spring), box-shadow .35s var(--ease-out)",
                }}
              >
                {unlocked && (
                  <div
                    className="pointer-events-none absolute top-0 right-0"
                    style={{
                      width: 100, height: 100,
                      borderRadius: "0 var(--r-lg) 0 50%",
                      background: "radial-gradient(circle at 100% 0%, rgba(var(--ngo-rgb),.08), transparent 70%)",
                    }}
                  />
                )}
                <div className="p-5 relative z-[1]">
                  <div className="flex items-center gap-3.5 mb-3">
                    <div
                      className="shrink-0 grid place-items-center"
                      style={{
                        width: 42, height: 42, borderRadius: 11,
                        background: unlocked ? "linear-gradient(145deg,var(--color-ngo),var(--color-ngo-2))" : "var(--color-surface-2)",
                        color: unlocked ? "#fff" : "var(--color-mute-2)",
                        boxShadow: unlocked ? "0 4px 10px -4px rgba(var(--ngo-rgb),.5)" : "none",
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-bold" style={{ fontSize: 14, color: unlocked ? "var(--color-ngo-2)" : "var(--color-ink)" }}>
                        {b.title}
                      </div>
                      <div className="text-[11px] text-mute mt-px">{b.desc}</div>
                    </div>
                    {unlocked ? (
                      <span
                        className="shrink-0 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                        style={{ background: "rgba(var(--ngo-rgb),.1)", color: "var(--color-ngo-2)", letterSpacing: ".06em" }}
                      >
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Earned
                      </span>
                    ) : (
                      <div className="shrink-0 font-display font-bold nums text-right" style={{ color: "var(--color-mute-2)" }}>
                        <div style={{ fontSize: 20, lineHeight: 1 }}>{b.progress}%</div>
                      </div>
                    )}
                  </div>
                  <div className="rounded-full overflow-hidden" style={{ height: 6, background: unlocked ? "rgba(var(--ngo-rgb),.12)" : "var(--color-surface-2)" }}>
                    <div
                      className="h-full rounded-full relative"
                      style={{
                        width: `${b.progress}%`,
                        background: unlocked ? "linear-gradient(90deg,var(--color-ngo),var(--color-ngo-2))" : "linear-gradient(90deg,var(--color-rider),var(--color-ngo))",
                        transition: "width 1.2s var(--ease-out)",
                        transitionDelay: `${i * 0.1}s`,
                      }}
                    >
                      {unlocked && (
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: "linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent)",
                            animation: "d4sheen 2.2s var(--ease-flow) infinite",
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-semibold nums" style={{ color: unlocked ? "var(--color-ngo-2)" : "var(--color-ink-2)" }}>
                      {b.current}{b.unit} <span style={{ color: "var(--color-mute-2)", fontWeight: 500 }}>/ {b.target}{b.unit}</span>
                    </span>
                    {!unlocked && left > 0 && (
                      <span className="text-[10px]" style={{ color: "var(--color-mute-2)" }}>
                        <span className="font-semibold nums">{Math.round(left * 10) / 10}</span> to go
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestones */}
      <div className="flow-panel p-6">
        <div className="flex items-center gap-2 mb-5">
          <Trophy className="w-4 h-4 text-mute" />
          <h3 className="font-display text-base font-semibold text-ink">Delivery Milestones</h3>
        </div>
        <div className="space-y-3">
          {milestones.length > 0 ? (
            milestones.map((m, i) => {
              const completed = m.status === "completed";
              const inProgress = m.status === "in-progress";
              const tint = completed
                ? { bg: "rgba(var(--ngo-rgb),.07)", fg: "var(--color-ngo)", fg2: "var(--color-ngo-2)" }
                : inProgress
                  ? { bg: "rgba(var(--rider-rgb),.07)", fg: "var(--color-rider)", fg2: "var(--color-rider-2)" }
                  : { bg: "var(--color-surface-2)", fg: "var(--color-mute-2)", fg2: "var(--color-mute)" };
              return (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl" style={{ background: tint.bg }}>
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: tint.fg, color: completed || inProgress ? "#fff" : "var(--color-mute)" }}
                    >
                      {completed ? <Trophy className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display font-bold text-ink truncate">{m.milestone}</h4>
                      <p className="text-mute text-sm truncate">{m.reward}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-4">
                    {completed && (
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ background: "var(--color-ngo)", color: "#fff" }}>
                        Done
                      </span>
                    )}
                    {inProgress && (
                      <div className="w-28">
                        <span className="text-xs font-semibold nums block mb-1" style={{ color: tint.fg2 }}>{m.progress}%</span>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,.5)" }}>
                          <div className="h-full rounded-full" style={{ width: `${m.progress}%`, background: tint.fg, transition: "width 1s var(--ease-out)" }} />
                        </div>
                      </div>
                    )}
                    {m.status === "upcoming" && (
                      <span className="text-xs text-mute">Upcoming</span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-mute text-center py-6 text-sm">No milestones yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardsSection;
