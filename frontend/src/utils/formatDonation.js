// Compact, consistent display of a donation's weight + serving size.
// Replaces the old free-text "Quantity" string shown across the donor/NGO UI.
// Accepts either a full donation object or { weightKg, serves } directly.
export const formatAmount = ({ weightKg, serves } = {}) => {
  const w = Number(weightKg);
  const s = Number(serves);
  const parts = [];
  if (Number.isFinite(s) && s > 0) parts.push(`${s} serving${s === 1 ? "" : "s"}`);
  if (Number.isFinite(w) && w > 0) parts.push(`${w} kg`);
  return parts.length ? parts.join(" · ") : "—";
};
