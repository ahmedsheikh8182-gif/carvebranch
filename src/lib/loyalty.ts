/**
 * Carve Loyalty & Rewards — client-side stub.
 *
 * Points are computed from the user's order history.
 * PKR 100 spent = 1 point.
 *
 * Tiers:
 *   Ivory  —      0–999 pts
 *   Pearl  — 1000–4999 pts
 *   Gold   —   5000+ pts
 *
 * The UI marks this feature "Launching Soon" — no backend changes needed yet.
 */

export type LoyaltyTier = "Ivory" | "Pearl" | "Gold";

export interface LoyaltyStatus {
  points: number;
  tier: LoyaltyTier;
  nextTier: LoyaltyTier | null;
  pointsToNext: number;
  progressPercent: number;
}

const TIERS: { tier: LoyaltyTier; min: number; max: number | null }[] = [
  { tier: "Ivory", min: 0, max: 999 },
  { tier: "Pearl", min: 1000, max: 4999 },
  { tier: "Gold", min: 5000, max: null },
];

function computeStatus(totalSpend: number): LoyaltyStatus {
  const points = Math.floor(totalSpend / 100);
  const currentTierDef = TIERS.find((t) => points >= t.min && (t.max === null || points <= t.max))!;
  const nextTierDef = TIERS.find((t) => t.min > currentTierDef.min) ?? null;

  const pointsToNext = nextTierDef ? nextTierDef.min - points : 0;
  const rangeSize = nextTierDef
    ? nextTierDef.min - currentTierDef.min
    : 1;
  const progressInTier = points - currentTierDef.min;
  const progressPercent = nextTierDef
    ? Math.min(100, Math.round((progressInTier / rangeSize) * 100))
    : 100;

  return {
    points,
    tier: currentTierDef.tier,
    nextTier: nextTierDef?.tier ?? null,
    pointsToNext,
    progressPercent,
  };
}

/**
 * Returns the user's loyalty status computed from their order history totals.
 * Pass the orders array from `useGetMyOrders()`.
 */
export function useLoyalty(orders?: { total: number }[]): LoyaltyStatus {
  const totalSpend = (orders ?? []).reduce((sum, o) => sum + (o.total ?? 0), 0);
  return computeStatus(totalSpend);
}
