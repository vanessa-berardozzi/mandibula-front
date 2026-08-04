# 🎮 UI Mobile Gaming - Mandibula Shop

Interface mobile avec thème **jungle futuriste post-apocalyptique** et esthétique gaming.

## 📱 Composants

### 1. **MobileNavbar.tsx**
Top bar minimaliste avec :
- **Burger menu** à gauche avec effet néon pulsant
- **Logo** centré avec animation glow
- **Badge panier** à droite avec compteur et bounce effect

### 2. **BottomNav.tsx**
Navigation bar fixe en bas avec :
- **5 icônes principales** : Home, Catégories, Recherche, Panier, Profil
- **Effets néon** au tap avec animations fluides
- **Ligne de scan** animée en haut
- **Indicateur actif** avec glow néon
- **Badge compteur** pour le panier
- **Coins indicators** style gaming UI

### 3. **MobileMenu.tsx**
Menu slide-in depuis la gauche avec :
- **Background** semi-transparent avec blur
- **Bordures hologramme** animées
- **Effet scan lines** en overlay
- **Titre avec glitch text**
- **Sections** avec dividers style circuit électronique
- **Items** avec animations d'entrée séquentielles
- **Footer** avec status système

## 🎨 Effets Visuels Gaming

### Animations CSS
- `animate-glow-pulse` - Pulsation lumineuse pour le logo
- `animate-pulse-slow` - Pulsation lente pour backgrounds
- `animate-pulse-glow` - Pulsation pour éléments actifs
- `animate-bounce-subtle` - Bounce délicat pour badges
- `animate-scan-line` - Ligne de scan horizontale
- `gaming-menu-item` - Slide-in pour items de menu
- `gaming-nav-item` - Apparition pour items de nav

### Classes d'effets
- `.gaming-badge` - Badge avec glow néon
- `.hologram-border` - Bordure holographique
- `.scan-lines` - Effet de lignes de scan
- `.glitch-text` - Texte avec effet glitch
- `.drop-shadow-neon` - Ombre néon pour icônes
- `.text-shadow-neon` - Ombre néon pour texte
- `.shadow-neon-glow` - Glow néon général
- `.icon-neon-hover` - Effet néon au hover sur icônes

## 🔧 Responsive

- **Mobile** (< 768px) : MobileNavbar + BottomNav
- **Desktop** (≥ 768px) : Navbar (plus de Sidebar, navigation entièrement portée par la navbar)

Le layout s'adapte automatiquement via le hook `useIsMobile()`.

## 🎯 Micro-interactions

- **Feedback visuel** à chaque tap (ripple effect)
- **Hover effects** avec glow néon
- **Active states** avec indicateurs lumineux
- **Badges** animés pour notifications
- **Transitions** fluides entre états

## 🌈 Palette de couleurs

- **Primary** : `#cae2c5` (Vert néon)
- **Secondary** : `#00eaff` (Bleu cyan)
- **Accent** : `#0a2e19` (Vert foncé)
- **Background** : Noir semi-transparent avec blur
- **Borders** : Primary avec opacité variable

## 📦 Structure des fichiers

```
components/layout/Header/Mobile/
├── index.ts             # Export centralisé
├── MobileNavbar.tsx     # Top bar mobile
├── BottomNav.tsx        # Navigation bottom bar
└── MobileMenu.tsx       # Menu burger slide-in
```

## 🚀 Améliorations futures

- [ ] Vibration haptique (si supporté par le device)
- [ ] Son au tap (optionnel)
- [ ] Plus d'effets de particules
- [ ] Mode sombre/clair
- [ ] Thèmes personnalisables
- [ ] Animations de transition entre pages
