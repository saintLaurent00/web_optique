# web_optique

Site vitrine d'un cabinet d'optique — refonte UX/UI et système motion **Precision in Motion**.

## Aperçu

**Preview en ligne :** https://saintlaurent00.github.io/web_optique/

Le preview est déployé automatiquement via GitHub Pages à chaque push sur `main`.

## Motion system

- Entrées section par section via IntersectionObserver
- Scroll progress global + progression narrative des sections
- Hero iris/pupil avec suivi du pointeur sur desktop
- Micro-interactions hover avec timings et easing centralisés
- Timeline et parcours patient animés
- Services horizontaux avec interaction drag desktop
- Scanner visuel de la section technologie
- Parcours de prise de rendez-vous avec progression d'étapes
- Confirmation avec animation de validation
- Adaptation mobile sans curseur custom, tilt ou parallax lourd
- Support `prefers-reduced-motion`

## Architecture motion

```
css/
└── motion.css

js/
└── motion.js

.github/
└── workflows/
    └── deploy-pages.yml
```

## Principes

**Precision in Motion** : chaque mouvement doit guider l'œil, expliquer une relation, confirmer une interaction ou renforcer la sensation de précision. Les animations décoratives sans fonction sont limitées.

## Local

Ouvrir `index.html` via un serveur statique local, par exemple :

```bash
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000`.
