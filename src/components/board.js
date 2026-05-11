/**
 * Board component — owns the full layout below the header.
 *
 * Responsibilities:
 *  - Wire up all control inputs (search, filters, collapse button, reset)
 *  - Render category sections, subgroups and tile grids
 *  - Update stat counters and results bar
 */

import { state, saveState } from "../state.js";
import { getFilteredMaterials, allCategories, materials } from "../data.js";
import { escapeHtml } from "../utils.js";
import { createTile } from "./tile.js";
import { openViewer, closeViewer, isViewerOpen } from "./viewer.js";
import { resetPreloadQueue, startPreloadObserver } from "../hydration.js";

// ─── DOM handles ──────────────────────────────────────────────────────────────

const boardEl = document.getElementById("materialsBoard");
const searchInput = /** @type {HTMLInputElement} */ (document.getElementById("searchInput"));
const categoryFiltersEl = document.getElementById("categoryFilters");
const toggleCollapseButton = document.getElementById("toggleCollapseButton");
const resetFiltersButton = document.getElementById("resetFiltersButton");
const resultsCountLabel = document.getElementById("resultsCountLabel");
const resultsHint = document.getElementById("resultsHint");
const visibleMaterialsCountEl = document.getElementById("visibleMaterialsCount");
const visibleCategoriesCountEl = document.getElementById("visibleCategoriesCount");
const totalMaterialsCountEl = document.getElementById("totalMaterialsCount");

// ─── Internal helpers ─────────────────────────────────────────────────────────

function updateStats(filteredMaterials) {
  const visibleCategories = new Set(filteredMaterials.map((item) => item.category));
  visibleMaterialsCountEl.textContent = String(filteredMaterials.length);
  visibleCategoriesCountEl.textContent = String(visibleCategories.size);
  totalMaterialsCountEl.textContent = String(materials.length);

  const n = filteredMaterials.length;
  resultsCountLabel.textContent = `${n} resultat${n > 1 ? "s" : ""}`;

  if (state.category === "all" && !state.query) {
    resultsHint.textContent = "Toutes les categories";
    return;
  }
  const parts = [];
  if (state.category !== "all") parts.push(state.category);
  if (state.query) parts.push(`Recherche : ${state.query}`);
  resultsHint.textContent = parts.join(" • ");
}

function renderFilters(filteredMaterials) {
  const totalCounts = materials.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + 1;
    return acc;
  }, {});
  const visibleCounts = filteredMaterials.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + 1;
    return acc;
  }, {});

  categoryFiltersEl.innerHTML = "";

  const allChip = document.createElement("button");
  allChip.type = "button";
  allChip.className = `chip${state.category === "all" ? " is-active" : ""}`;
  allChip.innerHTML = `<span>Toutes</span> <small>${filteredMaterials.length}/${materials.length}</small>`;
  allChip.addEventListener("click", () => {
    state.category = "all";
    saveState();
    renderBoard();
  });
  categoryFiltersEl.appendChild(allChip);

  for (const category of allCategories) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `chip${state.category === category ? " is-active" : ""}`;
    chip.innerHTML = `<span>${escapeHtml(category)}</span> <small>${visibleCounts[category] ?? 0}/${totalCounts[category] ?? 0}</small>`;
    chip.addEventListener("click", () => {
      state.category = state.category === category ? "all" : category;
      saveState();
      renderBoard();
    });
    categoryFiltersEl.appendChild(chip);
  }
}

function syncCollapseButton(filteredMaterials) {
  const visibleCategories = Array.from(new Set(filteredMaterials.map((item) => item.category)));
  const allCollapsed =
    visibleCategories.length > 0 &&
    visibleCategories.every((c) => state.collapsedCategories.has(c));
  toggleCollapseButton.textContent = allCollapsed ? "Tout ouvrir" : "Tout replier";
  toggleCollapseButton.classList.toggle("is-active", allCollapsed);
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function renderBoard() {
  if (isViewerOpen()) closeViewer();

  resetPreloadQueue();

  const filteredMaterials = getFilteredMaterials(state);
  const categories = Array.from(new Set(filteredMaterials.map((item) => item.category)));

  boardEl.innerHTML = "";
  renderFilters(filteredMaterials);
  updateStats(filteredMaterials);
  syncCollapseButton(filteredMaterials);

  if (filteredMaterials.length === 0) {
    boardEl.innerHTML =
      '<div class="empty-state">Aucune matiere ne correspond aux filtres actuels. Essayez une autre recherche ou reinitialisez les filtres.</div>';
    return;
  }

  for (const category of categories) {
    const itemsInCategory = filteredMaterials.filter((item) => item.category === category);
    const collapsed = state.collapsedCategories.has(category);

    const categoryEl = document.createElement("section");
    categoryEl.className = `category${collapsed ? " is-collapsed" : ""}`;
    categoryEl.innerHTML = `
      <button class="category-toggle" type="button" aria-expanded="${collapsed ? "false" : "true"}">
        <span class="category-main">
          <span class="category-title">${escapeHtml(category)}</span>
          <span class="category-caption">${itemsInCategory.length} matiere${itemsInCategory.length > 1 ? "s" : ""} dans cette section</span>
        </span>
        <span class="category-meta">
          <span class="category-count">${itemsInCategory.length}</span>
          <span class="category-state">${collapsed ? "Fermee" : "Ouverte"}</span>
        </span>
      </button>
      <div class="subgroups"></div>
    `;

    const categoryToggle = categoryEl.querySelector(".category-toggle");
    const subgroupsWrap = categoryEl.querySelector(".subgroups");
    const subgroups = Array.from(new Set(itemsInCategory.map((item) => item.subgroup ?? "Autres")));

    categoryToggle.addEventListener("click", () => {
      if (state.collapsedCategories.has(category)) {
        state.collapsedCategories.delete(category);
      } else {
        state.collapsedCategories.add(category);
      }
      saveState();
      renderBoard();
    });

    for (const subgroup of subgroups) {
      const subgroupEl = document.createElement("section");
      subgroupEl.className = "subgroup";
      const subgroupItems = itemsInCategory.filter((item) => (item.subgroup ?? "Autres") === subgroup);
      subgroupEl.innerHTML = `
        <div class="subgroup-head">
          <h3 class="subgroup-title">${escapeHtml(subgroup)}</h3>
          <span class="subgroup-count">${subgroupItems.length}</span>
        </div>
        <div class="grid"></div>
      `;
      const subgroupGrid = subgroupEl.querySelector(".grid");
      for (const item of subgroupItems) {
        subgroupGrid.appendChild(createTile(item, { onOpenViewer: openViewer }));
      }
      subgroupsWrap.appendChild(subgroupEl);
    }

    boardEl.appendChild(categoryEl);
  }

  startPreloadObserver();
}

/** Register event listeners for all control inputs. Call once at startup. */
export function initControls() {
  // Restore persisted search value (empty for now, kept for future extension)
  searchInput.value = state.query;

  searchInput.addEventListener("input", (event) => {
    state.query = /** @type {HTMLInputElement} */ (event.target).value;
    renderBoard();
  });

  toggleCollapseButton.addEventListener("click", () => {
    const filtered = getFilteredMaterials(state);
    const visibleCategories = Array.from(new Set(filtered.map((item) => item.category)));
    const allCollapsed =
      visibleCategories.length > 0 &&
      visibleCategories.every((c) => state.collapsedCategories.has(c));

    if (allCollapsed) {
      for (const c of visibleCategories) state.collapsedCategories.delete(c);
    } else {
      for (const c of visibleCategories) state.collapsedCategories.add(c);
    }
    saveState();
    renderBoard();
  });

  resetFiltersButton.addEventListener("click", () => {
    state.query = "";
    state.category = "all";
    state.collapsedCategories.clear();
    searchInput.value = "";
    saveState();
    renderBoard();
  });
}
