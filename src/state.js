/**
 * Shared application state with localStorage persistence.
 *
 * Persisted fields : category, collapsedCategories
 * Transient fields : query (always starts empty on page load)
 */

const STORAGE_KEY = "deco3d-ui-state-v1";

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

const persisted = loadPersisted();

export const state = {
  /** Live search query — always starts empty. */
  query: "",

  /** Active category filter ("all" or a category name). */
  category: typeof persisted.category === "string" ? persisted.category : "all",

  /** Set of category names that the user has manually collapsed. */
  collapsedCategories: new Set(Array.isArray(persisted.collapsedCategories) ? persisted.collapsedCategories : []),
};

/** Persist the durable parts of state to localStorage. */
export function saveState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        category: state.category,
        collapsedCategories: Array.from(state.collapsedCategories),
      }),
    );
  } catch {
    // Private browsing or quota exceeded — silently ignore.
  }
}
