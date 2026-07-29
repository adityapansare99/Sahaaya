import React, { useContext, useEffect, useState } from 'react';
import { Heart, Users, Building, Recycle, Award, Calendar, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { formatAmount } from '../utils/formatDonation';
import CountUp from './flow/CountUp';

// Flow status pill — pipeline-stage colours (shared mapping with MyDonations).
const StatusPill = ({ status }) => {
  if (status === 'Cancelled') {
    return (
      <span
        className="text-[11px] font-semibold capitalize nums whitespace-nowrap px-2 py-0.5 rounded-full"
        style={{ background: 'rgba(var(--urgent-rgb),.12)', color: 'var(--color-urgent)' }}
      >
        {status}
      </span>
    );
  }
  const cls = {
    Pending: 'bg-donor-soft text-donor-2',
    Accepted: 'bg-rider-soft text-rider-2',
    Completed: 'bg-ngo-soft text-ngo-2',
  }[status];
  return (
    <span className={`text-[11px] font-semibold capitalize nums whitespace-nowrap px-2 py-0.5 rounded-full ${cls || 'bg-surface-2 text-mute'}`}>
      {status}
    </span>
  );
};

const TINT = {
  people: { bg: 'rgba(var(--people-rgb),.12)', fg: 'var(--color-people)' },
  ngo: { bg: 'var(--color-ngo-soft)', fg: 'var(--color-ngo-2)' },
  rider: { bg: 'var(--color-rider-soft)', fg: 'var(--color-rider-2)' },
};

const StatTile = ({ icon: Icon, tint, value, suffix, label, sub }) => {
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
        <CountUp value={value} />
        {suffix}
      </div>
      <div className="text-sm font-semibold text-ink-2 mt-0.5">{label}</div>
      <div className="text-xs text-mute mt-1">{sub}</div>
    </div>
  );
};

// Completion-rate ring (completed / total donations), Flow gradient stroke.
const CompletionRing = ({ completed, total }) => {
  const pct = total > 0 ? Math.min(1, completed / total) : 0;
  const R = 52;
  const C = 2 * Math.PI * R;
  const off = C * (1 - pct);
  return (
    <div className="shrink-0 flex flex-col items-center" style={{ width: 124, height: 124 }}>
      <svg width="124" height="124" viewBox="0 0 124 124" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle cx="62" cy="62" r={R} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="9" />
        <circle
          cx="62"
          cy="62"
          r={R}
          fill="none"
          stroke="url(#d4flowgrad)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C}
          style={{ '--off': off, animation: 'd4fillring 1.5s var(--ease-out) .2s forwards' }}
        />
      </svg>
      <div className="flex flex-col items-center justify-center h-full">
        <span className="font-display font-bold text-2xl text-white nums">{Math.round(pct * 100)}%</span>
        <span className="text-[10px] text-white/55">completed</span>
      </div>
    </div>
  );
};

const Impact = () => {
  const { backendurl, token } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchImpact = async () => {
      try {
        const response = await axios.get(`${backendurl}donor/impact`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setData(response.data.data);
        } else {
          toast.error('Failed to load impact data');
        }
      } catch (error) {
        toast.error('Error fetching impact data');
      } finally {
        setLoading(false);
      }
    };
    fetchImpact();
  }, [backendurl, token]);

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="flow-skel skel-line w-48 mb-2" style={{ height: 30 }} />
          <div className="flow-skel skel-line w-64" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
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
      <div>
        <div className="mb-7">
          <h2 className="font-display text-3xl font-bold text-ink mb-2">Your Impact</h2>
          <p className="text-mute">See the difference you're making in the community</p>
        </div>
        <div className="flow-empty flex-col items-center text-center py-14">
          <div className="ei">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="et">No donations yet</div>
            <div className="ed">Create your first donation to start making an impact.</div>
          </div>
        </div>
      </div>
    );
  }

  const { totalDonations, completed, accepted, pending, ngosConnected, totalMealsDonated, wasteReduced, peopleServed, recentActivity, monthlyTrend } = data;

  const achievements = [
    { title: 'First Donation', desc: 'Made your first food donation', unlocked: totalDonations >= 1, current: totalDonations, target: 1, icon: Award },
    { title: 'Generous Giver', desc: 'Completed 10+ food donations', unlocked: completed >= 10, current: completed, target: 10, icon: Heart },
    { title: 'Community Hero', desc: 'Served 100+ people', unlocked: peopleServed >= 100, current: peopleServed, target: 100, icon: Users },
    { title: 'Eco Warrior', desc: 'Reduced 50kg+ food waste', unlocked: wasteReduced >= 50, current: wasteReduced, target: 50, icon: Recycle },
  ];

  const statusIcon = (s) => {
    if (s === 'Completed') return <CheckCircle className="w-4 h-4 shrink-0" style={{ color: 'var(--color-ngo)' }} />;
    if (s === 'Accepted') return <Clock className="w-4 h-4 shrink-0" style={{ color: 'var(--color-rider)' }} />;
    return <Clock className="w-4 h-4 shrink-0" style={{ color: 'var(--color-donor)' }} />;
  };

  const maxTrend = monthlyTrend && monthlyTrend.length > 0
    ? Math.max(...monthlyTrend.map(m => m.donations), 1) : 1;

  return (
    <div>
      {/* SVG gradient def for the completion ring */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="d4flowgrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#0fa968" />
          </linearGradient>
        </defs>
      </svg>

      <div className="mb-7">
        <h2 className="font-display text-3xl font-bold text-ink mb-2">Your Impact</h2>
        <p className="text-mute">See the difference you're making in the community</p>
      </div>

      {/* Hero — total meals donated + completion ring */}
      <div
        className="relative overflow-hidden rounded-[var(--r-xl)] mb-6"
        style={{ background: 'linear-gradient(162deg,#0e1f1a 0%,#122821 55%,#0b1a15 100%)', color: '#eaf3ee' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)',
            backgroundSize: '30px 30px',
            maskImage: 'radial-gradient(120% 120% at 30% 0%,#000,transparent 75%)',
            WebkitMaskImage: 'radial-gradient(120% 120% at 30% 0%,#000,transparent 75%)',
          }}
        />
        <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="font-display text-[11px] font-bold tracking-[0.18em] uppercase text-white/55 mb-2">
              Total meals donated
            </div>
            <div
              className="font-display font-bold nums"
              style={{ fontSize: 'clamp(40px,6vw,64px)', lineHeight: 0.9, letterSpacing: '-2px', color: '#fff' }}
            >
              <CountUp value={totalMealsDonated} />
            </div>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-white/60 pt-3 border-t border-white/10">
              <span className="nums">
                <b className="text-ngo-soft font-display font-bold">{completed}</b> completed
              </span>
              <span className="nums">
                <b className="text-white/85 font-display font-bold">{accepted}</b> accepted
              </span>
              <span className="nums">
                <b className="text-white/85 font-display font-bold">{pending}</b> pending
              </span>
            </div>
          </div>
          <CompletionRing completed={completed} total={totalDonations} />
        </div>
      </div>

      {/* 3 pillar stat tiles */}
      <div className="grid md:grid-cols-3 gap-5 mb-6">
        <StatTile icon={Users} tint="people" value={peopleServed} label="People Served" sub="Lives touched through your generosity" />
        <StatTile icon={Building} tint="ngo" value={ngosConnected} label="NGOs Partnered" sub="Organizations you've supported" />
        <StatTile icon={Recycle} tint="rider" value={wasteReduced} suffix=" kg" label="Waste Reduced" sub="Environmental impact saved" />
      </div>

      {/* Monthly trend + Recent activity */}
      <div className="grid lg:grid-cols-5 gap-5 mb-6">
        <div className="lg:col-span-3 flow-panel p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-5 shrink-0">
            <Calendar className="w-4 h-4 text-mute" />
            <h3 className="font-display text-base font-semibold text-ink">Monthly Donations</h3>
          </div>
          {monthlyTrend && monthlyTrend.length > 0 ? (
            <div className="flex-1 flex flex-col justify-center min-h-0">
              <div className="flow-bars" style={{ height: 100 }}>
                {monthlyTrend.map((item, i) => {
                  const pct = maxTrend > 0 ? (item.donations / maxTrend) * 100 : 0;
                  const isMax = item.donations === maxTrend;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-xs font-semibold text-ink-2 nums">{item.donations}</span>
                      <div
                        className={`flow-bar ${isMax ? 'max' : ''}`}
                        style={{ height: `${Math.max(pct, 4)}%`, animationDelay: `${i * 60}ms` }}
                      />
                      <span className="text-[10px] text-mute">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-mute text-center py-6 text-sm">No monthly data yet</p>
          )}
        </div>

        <div className="lg:col-span-2 flow-panel p-6">
          <div className="flex items-center gap-2 mb-5">
            <Clock className="w-4 h-4 text-mute" />
            <h3 className="font-display text-base font-semibold text-ink">Recent Activity</h3>
          </div>
          {recentActivity && recentActivity.length > 0 ? (
            <div className="space-y-2">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-2">
                  {statusIcon(a.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{a.foodType}</p>
                    <p className="text-xs text-mute truncate">
                      {formatAmount(a)}{a.ngo ? ` → ${a.ngo}` : ''}
                    </p>
                  </div>
                  <StatusPill status={a.status} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-mute text-center py-6 text-sm">No activity yet</p>
          )}
        </div>
      </div>

      {/* Achievements — milestone badges */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-4 h-4 text-mute" />
          <h3 className="font-display text-base font-semibold text-ink">Achievements</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {achievements.map((a, i) => {
            const Icon = a.icon;
            const pct = a.target > 0 ? Math.min(100, Math.round((a.current / a.target) * 100)) : 0;
            const unlocked = a.unlocked;
            const left = a.target - Math.min(a.current, a.target);
            return (
              <div
                key={i}
                className="relative overflow-hidden"
                style={{
                  borderRadius: 'var(--r-xl)',
                  background: unlocked
                    ? 'linear-gradient(162deg, #0e1f1a 0%, #122821 55%, #0b1a15 100%)'
                    : 'var(--color-surface)',
                  border: '1px solid',
                  borderColor: unlocked
                    ? 'rgba(255,255,255,.08)'
                    : 'var(--color-line)',
                  boxShadow: unlocked
                    ? '0 8px 30px -12px rgba(14,31,26,.5), inset 0 1px 0 rgba(255,255,255,.06)'
                    : 'var(--sh-sm)',
                  transition: 'transform .3s var(--ease-out), box-shadow .35s var(--ease-out)',
                }}
              >
                {/* Dark card grid overlay */}
                {unlocked && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage:
                        'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                      maskImage: 'radial-gradient(100% 100% at 50% 0%, #000, transparent 70%)',
                      WebkitMaskImage: 'radial-gradient(100% 100% at 50% 0%, #000, transparent 70%)',
                    }}
                  />
                )}

                {/* Green radial glow */}
                {unlocked && (
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      width: 200,
                      height: 200,
                      borderRadius: '50%',
                      background: 'radial-gradient(closest-side, rgba(var(--ngo-rgb),.12), transparent 70%)',
                      top: '-60%',
                      right: '-30%',
                    }}
                  />
                )}

                <div className="p-5 md:p-6 relative z-[1]">
                  {/* Top section: badge + status */}
                  <div className="flex items-center gap-4 mb-4">
                    {/* Badge icon */}
                    <div
                      className="shrink-0 grid place-items-center"
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        background: unlocked
                          ? 'linear-gradient(140deg, var(--color-donor), var(--color-donor-2))'
                          : 'var(--color-surface-2)',
                        color: unlocked ? '#fff' : 'var(--color-mute-2)',
                        boxShadow: unlocked
                          ? '0 8px 18px -6px rgba(var(--donor-rgb),.5), inset 0 1px 0 rgba(255,255,255,.25)'
                          : 'none',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Gloss */}
                      {unlocked && (
                        <div
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(180deg, rgba(255,255,255,.3) 0%, transparent 55%)',
                            borderRadius: 14,
                          }}
                        />
                      )}
                      <Icon className="w-[22px] h-[22px] relative" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div
                        className="font-display font-bold"
                        style={{
                          fontSize: 15,
                          color: unlocked ? '#fff' : 'var(--color-ink)',
                        }}
                      >
                        {a.title}
                      </div>
                      <div
                        className="text-xs mt-0.5"
                        style={{
                          color: unlocked ? 'rgba(234,243,238,.6)' : 'var(--color-mute)',
                        }}
                      >
                        {a.desc}
                      </div>
                    </div>

                    {unlocked ? (
                      <div
                        className="shrink-0 flex items-center gap-1.5 font-display text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
                        style={{
                          background: 'rgba(var(--ngo-rgb),.15)',
                          color: 'var(--color-ngo)',
                          border: '1px solid rgba(var(--ngo-rgb),.2)',
                          letterSpacing: '.06em',
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Earned
                      </div>
                    ) : (
                      <div
                        className="shrink-0 font-display font-bold nums text-right"
                        style={{ color: 'var(--color-mute-2)' }}
                      >
                        <div style={{ fontSize: 22, lineHeight: 1 }}>{pct}%</div>
                        <div style={{ fontSize: 9, fontWeight: 500, opacity: .6 }}>progress</div>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div
                    style={{
                      height: 1,
                      marginBottom: 14,
                      background: unlocked
                        ? 'linear-gradient(90deg, rgba(255,255,255,.08), transparent)'
                        : 'linear-gradient(90deg, var(--color-line-2), transparent)',
                    }}
                  />

                  {/* Progress */}
                  <div className="flex items-center gap-3">
                    {/* Ring indicator */}
                    <div className="shrink-0 relative" style={{ width: 36, height: 36 }}>
                      <svg width="36" height="36" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                        <circle
                          cx="18" cy="18" r="15"
                          fill="none"
                          stroke={unlocked ? 'rgba(255,255,255,.08)' : 'var(--color-line-2)'}
                          strokeWidth="3"
                        />
                        <circle
                          cx="18" cy="18" r="15"
                          fill="none"
                          stroke={unlocked ? 'var(--color-ngo)' : 'rgba(var(--rider-rgb),.5)'}
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 15}
                          strokeDashoffset={2 * Math.PI * 15 * (1 - pct / 100)}
                          style={{ transition: 'stroke-dashoffset 1.2s var(--ease-out)' }}
                        />
                      </svg>
                      <div
                        className="absolute inset-0 grid place-items-center font-display font-bold nums"
                        style={{
                          fontSize: 9,
                          color: unlocked ? 'rgba(234,243,238,.7)' : 'var(--color-mute-2)',
                        }}
                      >
                        {pct}
                      </div>
                    </div>

                    {/* Track + label */}
                    <div className="flex-1 min-w-0">
                      <div
                        className="rounded-full overflow-hidden"
                        style={{
                          height: 4,
                          background: unlocked ? 'rgba(255,255,255,.08)' : 'var(--color-surface-2)',
                        }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background: unlocked
                              ? 'linear-gradient(90deg, var(--color-ngo), #2fc98a)'
                              : 'linear-gradient(90deg, var(--color-rider), var(--color-ngo))',
                            transition: 'width 1s var(--ease-out)',
                            transitionDelay: `${i * 0.08}s`,
                          }}
                        />
                      </div>
                      <div
                        className="flex justify-between mt-1.5"
                        style={{ color: unlocked ? 'rgba(234,243,238,.5)' : 'var(--color-mute-2)' }}
                      >
                        <span className="text-[10px] font-semibold nums">
                          <span
                            className="font-display font-bold"
                            style={{ color: unlocked ? 'var(--color-ngo)' : 'var(--color-ink-2)' }}
                          >
                            {a.current}
                          </span>
                          <span style={{ opacity: .5 }}> / {a.target}</span>
                        </span>
                        {!unlocked && left > 0 && (
                          <span className="text-[10px]">
                            <span className="font-semibold nums">{left}</span> needed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Impact;
