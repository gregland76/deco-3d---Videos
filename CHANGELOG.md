# Historique des modifications

## 2026-05-11

### Galerie video - performance plein ecran
- Optimisation du passage en plein ecran: reutilisation de l'iframe de la tuile au lieu de recreer un player a chaque clic.
- Preconnexion aux hotes video (`youtube.com`, `i.ytimg.com`, `google.com`) des l'initialisation pour reduire la latence reseau.
- Prechargement prioritaire des 3 premieres tuiles visibles (hydration `eager` + priorite haute) pour accelerer les premieres ouvertures.
- Ajout d'un indicateur de chargement dans la modale plein ecran tant que l'iframe n'a pas emis son evenement `load`.
- Hydratation anticipee conservee au survol/focus/touch pour limiter les ouvertures a froid.