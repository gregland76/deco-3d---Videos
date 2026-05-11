# Galerie Video Matieres

Application front statique basee sur Vite.

La page principale affiche une grille de videos YouTube en boucle. Chaque video represente une matiere.

Un clic sur le nom d'une matiere ouvre un lecteur grand format dans une modale.

## Optimisations de performance

- Chargement progressif des iframes par lots pour limiter le cout initial.
- Preconnexion aux domaines YouTube pour reduire le temps de premiere lecture.
- Hydratation anticipee au survol, au focus clavier et au toucher.
- Reutilisation de l'iframe deja hydratee lors de l'ouverture plein ecran (moins de recreations de player).
- Prechargement prioritaire des 3 premieres tuiles visibles.
- Indicateur visuel de chargement dans la modale tant que l'iframe plein ecran n'est pas prete.

## Demarrage

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
