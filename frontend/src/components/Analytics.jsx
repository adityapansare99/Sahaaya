import React, { useContext, useEffect, useState } from 'react';
import { TrendingUp, Package, Award, Users, Calendar, ChevronUp, ChevronDown, Recycle } from 'lucide-react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import CountUp from './flow/CountUp';

// Role-tinted stat tile (Flow).
const TINT = {
  people: { bg: 'rgba(var(--people-rgb),.12)', fg: 'var(--color-people)' },
  ngo: { bg: 'var(--color-ngo-soft)', fg: 'var(--color-ngo-2)' },
  rider: { bg: 'var(--color-rider-soft)', fg: 'var(--color-rider-2)' },
  donor: { bg: 'var(--color-donor-soft)', fg: 'var(--color-donor-2)' },
  urgent: { bg: 'rgba(var(--urgent-rgb),.1)', fg: 'var(--color-urgent)' },
};

const StatTile = ({ icon: Icon, tint, value, suffix, label, sub, footer }) => {
  const t = TINT[tint];
  return (
    <div className="flow-tile p-5">
      <div
        className="inline-grid place-items-center w-10 h-10 rounded-xl mb-3"
        style={{ background: t.bg, color: t.fg }}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="font-display text-3xl font-bold text-ink nums">
        {typeof value === 'number' ? <CountUp value={value} /> : value}
        {suffix}
      </div>
      <div className="text-sm font-semibold text-ink-2 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-mute mt-1">{sub}</div>}
      {footer && <div className="mt-2 text-xs" style={{ color: t.fg }}>{footer}</div>}
    </div>
  );
};

// Completion-rate ring (Flow gradient stroke) — reused for the success rate.
const SuccessRing = ({ completed, total }) => {
  const pct = total > 0 ? Math.min(1, completed / total) : 0;
  const R = 52;
  const C = 2 * Math.PI * R;
  const off = C * (1 - pct);
  return (
    <div className="shrink-0 flex flex-col items-center justify-center" style={{ width: 124, height: 124 }}>
      <svg width="124" height="124" viewBox="0 0 124 124" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle cx="62" cy="62" r={R} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="9" />
        <circle
          cx="62" cy="62" r={R} fill="none" stroke="url(#angrad)" strokeWidth="9" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C}
          style={{ '--off': off, animation: 'd4fillring 1.5s var(--ease-out) .2s forwards' }}
        />
      </svg>
      <div className="flex flex-col items-center justify-center h-full">
        <span className="font-display font-bold text-2xl text-white nums">{Math.round(pct * 100)}%</span>
        <span className="text-[10px] text-white/55">success</span>
      </div>
    </div>
  );
};

const Analytics = () => {
  const { backendurl, token } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`${backendurl}ngo/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setData(response.data.data);
        } else {
          toast.error('Failed to load analytics');
        }
      } catch (error) {
        toast.error('Error fetching analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [backendurl, token]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-2">
          <div className="flow-skel skel-line w-48 mb-2" style={{ height: 30 }} />
          <div className="flow-skel skel-line w-64" />
        </div>
        <div className="flow-panel p-8" style={{ height: 180 }} />
        <div className="grid md:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
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
          <h2 className="font-display text-3xl font-bold text-ink mb-2">Reports & Analytics</h2>
          <p className="text-mute">Your organization at a glance</p>
        </div>
        <div className="flow-empty flex-col items-center text-center py-14">
          <div className="ei"><Package className="w-6 h-6" /></div>
          <div>
            <div className="et">No data yet</div>
            <div className="ed">Start receiving donations to see your analytics here.</div>
          </div>
        </div>
      </div>
    );
  }

  const { total, completed, accepted, cancelled, pending, topDonors, monthlyTrend, peopleServed, wasteReduced, avgServes, avgWeight, momChange } = data;
  const activeNow = accepted + pending;
  const maxDonation = monthlyTrend && monthlyTrend.length > 0
    ? Math.max(...monthlyTrend.map(m => m.donations), 1)
    : 1;

  return (
    <div className="space-y-6">
      {/* SVG gradient def */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="angrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#0fa968" />
          </linearGradient>
        </defs>
      </svg>

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-3xl font-bold text-ink mb-2">Dashboard</h2>
          <p className="text-mute">Your organization at a glance</p>
        </div>
        <span className="livechip">
          {completed}/{total} completed
        </span>
      </div>

      {/* Hero — total received + success ring */}
      <div
        className="relative overflow-hidden rounded-[var(--r-xl)]"
        style={{ background: 'linear-gradient(162deg,#0e1f1a 0%,#122821 55%,#0b1a15 100%)', color: '#eaf3ee' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)',
            backgroundSize: '30px 30px',
            maskImage: 'radial-gradient(120% 120% at 30% 0%,#000,transparent 75%)',
            WebkitMaskImage: 'radial-gradient(120% 120% at 30% 0%,#000,transparent 75%)',
          }}
        />
        <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="font-display text-[11px] font-bold tracking-[0.18em] uppercase text-white/55 mb-2">
              Total Donations Received
            </div>
            <div
              className="font-display font-bold nums"
              style={{ fontSize: 'clamp(40px,6vw,64px)', lineHeight: 0.9, letterSpacing: '-2px', color: '#fff' }}
            >
              <CountUp value={total} />
            </div>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-white/60 pt-3 border-t border-white/10">
              <span className="nums"><b className="text-ngo-soft font-display font-bold">{completed}</b> completed</span>
              <span className="nums"><b className="text-white/85 font-display font-bold">{pending}</b> pending</span>
              <span className="nums"><b className="text-white/85 font-display font-bold">{cancelled || 0}</b> cancelled</span>
            </div>
          </div>
          <SuccessRing completed={completed} total={total} />
        </div>
      </div>

      {/* Impact — real-world effect */}
      <div className="grid md:grid-cols-2 gap-5">
        <StatTile icon={Users} tint="people" value={peopleServed} label="People Served" sub={`Across ${completed} completed ${completed === 1 ? 'delivery' : 'deliveries'}`} />
        <StatTile icon={Recycle} tint="rider" value={wasteReduced} suffix=" kg" label="Food Waste Reduced" sub="Diverted from landfill" />
      </div>

      {/* 3 stat cards */}
      <div className="grid md:grid-cols-3 gap-5">
        <StatTile
          icon={Package} tint="ngo" value={completed} label="Delivered"
          footer={`${total > 0 ? Math.round((completed / total) * 100) : 0}% of all donations`}
        />
        <StatTile
          icon={TrendingUp} tint="donor" value={activeNow} label="Active Now"
          footer={<span className="nums">{accepted} accepted · {pending} pending</span>}
        />
        <StatTile
          icon={Award} tint="ngo" value={topDonors && topDonors.length > 0 ? topDonors[0].name : '—'} label="Top Donor"
          sub={topDonors && topDonors.length > 0 ? `${topDonors[0].donations} donations` : 'No donors yet'}
        />
      </div>

      {/* Per-delivery averages */}
      <div className="grid md:grid-cols-2 gap-5">
        <StatTile icon={Users} tint="donor" value={avgServes} label="Avg People / Delivery" sub="Per completed donation" />
        <StatTile icon={Recycle} tint="rider" value={avgWeight} suffix=" kg" label="Avg Waste / Delivery" sub="Per completed donation" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Monthly Trend — 3/5 */}
        <div className="lg:col-span-3 flow-panel p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5 shrink-0">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-mute" />
              <h3 className="font-display text-base font-semibold text-ink">Monthly Trend</h3>
            </div>
            {momChange !== null && momChange !== undefined ? (
              <span
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full nums"
                style={
                  momChange > 0
                    ? { background: 'rgba(var(--ngo-rgb),.12)', color: 'var(--color-ngo-2)' }
                    : momChange < 0
                      ? { background: 'rgba(var(--urgent-rgb),.1)', color: 'var(--color-urgent)' }
                      : { background: 'var(--color-surface-2)', color: 'var(--color-mute)' }
                }
              >
                {momChange > 0 ? <ChevronUp className="w-3.5 h-3.5" /> : momChange < 0 ? <ChevronDown className="w-3.5 h-3.5" /> : null}
                {momChange > 0 ? `+${momChange}%` : `${momChange}%`} vs last month
              </span>
            ) : null}
          </div>
          {monthlyTrend && monthlyTrend.length > 0 ? (
            <div className="flex-1 flex flex-col justify-center min-h-0">
              <div className="flow-bars" style={{ height: 140 }}>
                {monthlyTrend.map((item, index) => {
                  const pct = maxDonation > 0 ? (item.donations / maxDonation) * 100 : 0;
                  const isHighest = item.donations === maxDonation;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-xs font-semibold text-ink-2 nums">{item.donations}</span>
                      <div
                        className={`flow-bar ${isHighest ? 'max' : ''}`}
                        style={{ height: `${Math.max(pct, 4)}%`, animationDelay: `${index * 60}ms` }}
                      />
                      <span className="text-[10px] text-mute">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-mute text-center py-8 text-sm">No data yet</p>
          )}
        </div>

        {/* Top Donors — 2/5 */}
        <div className="lg:col-span-2 flow-panel p-6">
          <div className="flex items-center gap-2 mb-5">
            <Award className="w-4 h-4 text-mute" />
            <h3 className="font-display text-base font-semibold text-ink">Top Donors</h3>
          </div>
          {topDonors && topDonors.length > 0 ? (
            <div className="space-y-1">
              {topDonors.map((donor, index) => {
                const isPodium = index < 3;
                const medalColor = ['var(--color-donor)', 'var(--color-mute-2)', 'var(--color-rider)'][index];
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-2 transition-colors"
                  >
                    <span
                      className="grid place-items-center w-7 h-7 rounded-full font-display font-bold text-xs nums shrink-0"
                      style={isPodium ? { background: 'var(--color-ink)', color: '#fff' } : { background: 'var(--color-surface-2)', color: 'var(--color-mute)' }}
                    >
                      {isPodium ? (
                        <span style={{ color: medalColor }}>{index + 1}</span>
                      ) : (
                        index + 1
                      )}
                    </span>
                    <p className="font-medium text-ink truncate flex-1">{donor.name}</p>
                    <span className="font-display font-bold text-sm text-ngo-2 nums shrink-0">{donor.donations}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-mute text-center py-8 text-sm">No donors yet</p>
          )}
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="flow-panel p-6">
        <h3 className="font-display text-base font-semibold text-ink mb-5">Donation Status Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Completed', value: completed, tint: 'ngo' },
            { label: 'Accepted', value: accepted, tint: 'rider' },
            { label: 'Pending', value: pending, tint: 'donor' },
            { label: 'Cancelled', value: cancelled || 0, tint: 'urgent' },
          ].map((item) => {
            const t = TINT[item.tint];
            const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
            return (
              <div key={item.label} className="rounded-xl p-5" style={{ background: t.bg }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display font-bold nums" style={{ color: t.fg }}>{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.5)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: t.fg, transition: 'width 1s var(--ease-out)' }}
                  />
                </div>
                <div className="mt-3">
                  <div className="font-display text-lg font-bold nums" style={{ color: t.fg }}>{item.value}</div>
                  <div className="text-xs text-mute mt-0.5">{item.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
