// ─── Local videos ─────────────────────────────────────────────────────────────

export const localVideos = [
  "1.mp4",
  "2.mp4",
  "3.mp4",
  "4.mp4",
  "5.mp4",
  "6.mp4",
  "7.mp4",
  "8.mp4",
];

// ─── Materials catalogue ───────────────────────────────────────────────────────

export const materials = [
  { id: "walls-silex", category: "Murs", subgroup: "Mineraux", name: "Silex" },
  { id: "walls-briques", category: "Murs", subgroup: "Mineraux", name: "Briques" },
  { id: "walls-pierre-calcaire-taille", category: "Murs", subgroup: "Mineraux", name: "Pierre calcaire taillee" },
  { id: "walls-moellon-calcaire", category: "Murs", subgroup: "Mineraux", name: "Moellon calcaire" },
  { id: "walls-ardoise", category: "Murs", subgroup: "Mineraux", name: "Ardoise" },
  { id: "walls-colombage", category: "Murs", subgroup: "Bois", name: "Colombage" },
  { id: "walls-bardeaux", category: "Murs", subgroup: "Bois", name: "Bardeaux" },
  { id: "walls-tuile-sable", category: "Murs", subgroup: "Tuile de pays", name: "Tuile de pays - sable champagne" },
  { id: "walls-tuile-rouge", category: "Murs", subgroup: "Tuile de pays", name: "Tuile de pays - rouge vieilli" },
  { id: "walls-tuile-brun", category: "Murs", subgroup: "Tuile de pays", name: "Tuile de pays - brun vieilli" },
  { id: "walls-chaume", category: "Murs", subgroup: "Vegetal", name: "Chaume" },

  { id: "floors-parquet", category: "Sols", subgroup: "Bois", name: "Parquet bois" },

  { id: "roof-ardoise", category: "Couverture", subgroup: "Mineraux", name: "Ardoise" },
  { id: "roof-tuile-sable", category: "Couverture", subgroup: "Tuile de pays", name: "Tuile de pays - sable champagne" },
  { id: "roof-tuile-rouge", category: "Couverture", subgroup: "Tuile de pays", name: "Tuile de pays - rouge vieilli" },
  { id: "roof-tuile-brun", category: "Couverture", subgroup: "Tuile de pays", name: "Tuile de pays - brun vieilli" },
  { id: "roof-chaume", category: "Couverture", subgroup: "Vegetal", name: "Chaume" },
  { id: "roof-bois", category: "Couverture", subgroup: "Bois", name: "Bois couverture" },
  { id: "roof-bardeaux", category: "Couverture", subgroup: "Bois", name: "Bardeaux" },

  { id: "linteau-bois", category: "Linteaux", subgroup: "Structure", name: "Linteau bois" },
  { id: "linteau-pierre", category: "Linteaux", subgroup: "Structure", name: "Linteau pierre" },
  { id: "linteau-brique", category: "Linteaux", subgroup: "Structure", name: "Linteau brique" },
  { id: "linteau-ipn", category: "Linteaux", subgroup: "Structure", name: "Linteau IPN" },

  { id: "menuiserie-bois-naturel", category: "Menuiseries", subgroup: "Bois naturel", name: "Bois naturel" },
  { id: "menuiserie-bois-peint-bleu", category: "Menuiseries", subgroup: "Bois peint", name: "Bois peint - bleu" },
  { id: "menuiserie-bois-peint-rouge", category: "Menuiseries", subgroup: "Bois peint", name: "Bois peint - rouge" },
  { id: "menuiserie-bois-peint-vert", category: "Menuiseries", subgroup: "Bois peint", name: "Bois peint - vert" },
  { id: "menuiserie-bois-peint-beige", category: "Menuiseries", subgroup: "Bois peint", name: "Bois peint - beige" },
  { id: "menuiserie-alu-brut", category: "Menuiseries", subgroup: "Aluminium", name: "Aluminium brut" },
  { id: "menuiserie-alu-teinte-bleu", category: "Menuiseries", subgroup: "Aluminium teinte", name: "Aluminium teinte - bleu" },
  { id: "menuiserie-alu-teinte-rouge", category: "Menuiseries", subgroup: "Aluminium teinte", name: "Aluminium teinte - rouge" },
  { id: "menuiserie-alu-teinte-vert", category: "Menuiseries", subgroup: "Aluminium teinte", name: "Aluminium teinte - vert" },
  { id: "menuiserie-alu-teinte-beige", category: "Menuiseries", subgroup: "Aluminium teinte", name: "Aluminium teinte - beige" },
];

// ─── Derived / helpers ────────────────────────────────────────────────────────

export const allCategories = Array.from(new Set(materials.map((item) => item.category)));

export function pickRandomVideo() {
  return localVideos[Math.floor(Math.random() * localVideos.length)];
}

export function buildVideoUrl(filename) {
  return `${import.meta.env.BASE_URL}Videos/${filename}`;
}

/**
 * Return materials matching the current state (search query + category filter).
 * @param {{ query: string, category: string }} state
 */
export function getFilteredMaterials(state) {
  const query = state.query.trim().toLowerCase();
  return materials.filter((item) => {
    if (state.category !== "all" && item.category !== state.category) return false;
    if (!query) return true;
    const haystack = [item.name, item.category, item.subgroup ?? "Autres", item.id].join(" ").toLowerCase();
    return haystack.includes(query);
  });
}
