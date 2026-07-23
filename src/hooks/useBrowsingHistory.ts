/**
 * useBrowsingHistory — tracks product views in localStorage.
 * Key: carve_viewed  Shape: [{ id, category }]  Max: 20 entries, most recent first.
 */

const STORAGE_KEY = "carve_viewed";
const MAX_HISTORY = 20;

export interface ViewedEntry {
  id: number;
  category: string; // slug — used for personalized recommendations
}

function readHistory(): ViewedEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeHistory(entries: ViewedEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {}
}

/**
 * Record a product view. Call once per product detail page mount.
 */
export function trackView(id: number, category = ""): void {
  const history = readHistory();
  const filtered = history.filter((e) => e.id !== id).slice(0, MAX_HISTORY - 1);
  writeHistory([{ id, category }, ...filtered]);
}

/**
 * Return the ordered list of recently viewed product IDs (most recent first).
 */
export function getRecentIds(limit = 8): number[] {
  return readHistory()
    .slice(0, limit)
    .map((e) => e.id);
}

/**
 * Return the last N unique category slugs the user has browsed (most recent first).
 */
export function getRecentCategories(limit = 5): string[] {
  const history = readHistory();
  const seen = new Set<string>();
  const categories: string[] = [];
  for (const entry of history) {
    if (entry.category && !seen.has(entry.category)) {
      seen.add(entry.category);
      categories.push(entry.category);
      if (categories.length >= limit) break;
    }
  }
  return categories;
}
