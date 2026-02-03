# Guide des Styles - Next.js + Tailwind + shadcn/ui

Ce document explique le système de couleurs et de styles utilisé dans les projets Next.js avec Tailwind CSS et shadcn/ui.

---

## 🎨 Vue d'ensemble

shadcn/ui utilise un système de tokens de couleurs basé sur des **variables CSS** définies dans `app/globals.css`. Ces variables sont ensuite exposées à Tailwind via des classes utilitaires.

---

## 📋 Variables de couleurs principales

### **Background & Foreground**

#### `--background` / `bg-background`
- **Usage** : Couleur de fond principale de l'application
- **Exemple** : Arrière-plan de la page, conteneurs principaux
- **Dans votre projet** : `transparent`

#### `--foreground` / `text-foreground`
- **Usage** : Couleur de texte par défaut sur fond `background`
- **Exemple** : Tout le texte principal de l'application
- **Dans votre projet** : Blanc cassé (`oklch(98.511% 0.00011 271.152)`)

---

### **Card**

#### `--card` / `bg-card`
- **Usage** : Fond des composants de type carte
- **Exemple** : Cartes de contenu, panels, conteneurs isolés
- **Dans votre projet** : Noir foncé (`oklch(0.205 0 0)`)

#### `--card-foreground` / `text-card-foreground`
- **Usage** : Texte lisible sur fond `card`
- **Exemple** : Titres et contenu dans les cartes
- **Dans votre projet** : Blanc (`oklch(0.985 0 0)`)

---

### **Popover**

#### `--popover` / `bg-popover`
- **Usage** : Fond des éléments flottants (tooltips, dropdowns, menus)
- **Exemple** : Menus déroulants, suggestions autocomplete
- **Dans votre projet** : Noir foncé (`oklch(0.205 0 0)`)

#### `--popover-foreground` / `text-popover-foreground`
- **Usage** : Texte sur fond `popover`
- **Exemple** : Options de menu, contenu de tooltip
- **Dans votre projet** : Blanc (`oklch(0.985 0 0)`)

---

### **Primary**

#### `--primary` / `bg-primary`
- **Usage** : Couleur d'action principale (CTA, boutons importants)
- **Exemple** : Bouton "Valider", "Enregistrer", liens principaux
- **Dans votre projet** : Vert fluo (`oklch(93.8% 0.127 124.321)`)
- **Bouton** : `<Button>Action principale</Button>`

#### `--primary-foreground` / `text-primary-foreground`
- **Usage** : Texte lisible sur fond `primary`
- **Exemple** : Texte du bouton principal
- **Dans votre projet** : Noir foncé (`oklch(0.205 0 0)`)

---

### **Secondary**

#### `--secondary` / `bg-secondary`
- **Usage** : Couleur pour actions secondaires, moins importantes
- **Exemple** : Bouton "Annuler", "Retour", actions alternatives
- **Dans votre projet** : Gris foncé (`oklch(0.269 0 0)`)
- **Bouton** : `<Button variant="secondary">Action secondaire</Button>`

#### `--secondary-foreground` / `text-secondary-foreground`
- **Usage** : Texte sur fond `secondary`
- **Exemple** : Texte des boutons secondaires
- **Dans votre projet** : Blanc (`oklch(0.985 0 0)`)

---

### **Muted**

#### `--muted` / `bg-muted`
- **Usage** : Arrière-plans atténués, éléments discrets
- **Exemple** : Zones de code, badges informatifs, backgrounds subtils
- **Dans votre projet** : Gris foncé (`oklch(0.269 0 0)`)

#### `--muted-foreground` / `text-muted-foreground`
- **Usage** : Texte secondaire, moins important
- **Exemple** : Descriptions, labels, timestamps, texte désactivé
- **Dans votre projet** : Gris moyen (`oklch(0.708 0 0)`)

---

### **Accent**

#### `--accent` / `bg-accent`
- **Usage** : Mise en évidence au survol, états actifs
- **Exemple** : Items de menu au hover, lignes sélectionnées
- **Dans votre projet** : Gris foncé (`oklch(0.269 0 0)`)

#### `--accent-foreground` / `text-accent-foreground`
- **Usage** : Texte sur fond `accent`
- **Exemple** : Texte d'élément survolé ou actif
- **Dans votre projet** : Blanc (`oklch(0.985 0 0)`)

---

### **Destructive**

#### `--destructive` / `bg-destructive`
- **Usage** : Actions destructives, erreurs, alertes critiques
- **Exemple** : Bouton "Supprimer", messages d'erreur
- **Dans votre projet** : Rouge (`oklch(0.704 0.191 22.216)`)
- **Bouton** : `<Button variant="destructive">Supprimer</Button>`

#### `--destructive-foreground` / `text-destructive-foreground`
- **Usage** : Texte sur fond destructive (implicite : blanc)
- **Exemple** : Texte des boutons de suppression

---

### **Bordures & Inputs**

#### `--border` / `border-border`
- **Usage** : Couleur des bordures par défaut
- **Exemple** : Contours de cartes, séparateurs, bordures d'inputs
- **Dans votre projet** : Blanc à 10% d'opacité (`oklch(1 0 0 / 10%)`)

#### `--input` / `border-input`
- **Usage** : Bordure spécifique aux champs de formulaire
- **Exemple** : `<Input />`, `<Textarea />`
- **Dans votre projet** : Blanc à 15% d'opacité (`oklch(1 0 0 / 15%)`)

#### `--ring` / `ring-ring`
- **Usage** : Anneau de focus (accessibilité)
- **Exemple** : Contour bleu au focus clavier sur un bouton/input
- **Dans votre projet** : Gris moyen (`oklch(0.556 0 0)`)

---

## 🗂️ Variables Sidebar (personnalisées)

#### `--sidebar` / `bg-sidebar`
- **Usage** : Fond de la sidebar
- **Dans votre projet** : Blanc cassé semi-transparent (`rgba(245, 234, 234, 0.041)`)

#### `--sidebar-foreground` / `text-sidebar-foreground`
- **Usage** : Texte dans la sidebar
- **Dans votre projet** : Vert-bleu clair (`#b5cccb`)

#### `--sidebar-primary` / `bg-sidebar-primary`
- **Usage** : Couleur primaire de la sidebar
- **Dans votre projet** : Rose/magenta (`oklch(63.635% 0.20093 338.708 / 0.623)`)

#### `--sidebar-primary-foreground` / `text-sidebar-primary-foreground`
- **Usage** : Texte sur fond primaire sidebar
- **Dans votre projet** : Vert (`oklch(66.987% 0.20089 144.837)`)

#### `--sidebar-accent` / `bg-sidebar-accent`
- **Usage** : Couleur d'accentuation sidebar (hover, actif)
- **Dans votre projet** : Vert clair (`oklch(69.376% 0.14892 160.686)`)

#### `--sidebar-accent-foreground` / `text-sidebar-accent-foreground`
- **Usage** : Texte sur fond accent sidebar
- **Dans votre projet** : Vert plus clair (`oklch(75.46% 0.17043 159.133)`)

#### `--sidebar-border` / `border-sidebar-border`
- **Usage** : Bordures dans la sidebar
- **Dans votre projet** : Vert foncé semi-transparent (`rgba(11, 44, 30, 0.212)`)

#### `--sidebar-ring` / `ring-sidebar-ring`
- **Usage** : Focus ring dans la sidebar
- **Dans votre projet** : Vert subtil (`oklch(65.645% 0.21343 142.434 / 0.014)`)

---

## 🛠️ Utilisation dans Tailwind

### Classes de couleur
```tsx
// Background
<div className="bg-background">...</div>
<div className="bg-card">...</div>
<div className="bg-primary">...</div>

// Texte
<p className="text-foreground">Texte principal</p>
<p className="text-muted-foreground">Texte secondaire</p>

// Bordures
<div className="border border-border">...</div>
<Input className="border-input" />

// Focus ring
<button className="focus:ring-2 ring-ring">...</button>
```

### Avec shadcn/ui
Les composants shadcn utilisent automatiquement ces variables :
```tsx
<Button variant="default">Primary (utilise bg-primary)</Button>
<Button variant="secondary">Secondaire</Button>
<Button variant="destructive">Danger</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Transparent</Button>

<Card>Utilise bg-card et text-card-foreground</Card>
```

---

## 🎯 Cas d'usage courants

### 1. Créer un bouton d'action principale
```tsx
<Button>Envoyer</Button> 
// Utilise automatiquement bg-primary + text-primary-foreground
```

### 2. Texte discret (label, date, etc.)
```tsx
<span className="text-muted-foreground text-sm">
  Publié le 27 janvier 2026
</span>
```

### 3. Carte de contenu
```tsx
<div className="bg-card text-card-foreground rounded-lg border border-border p-4">
  <h3 className="font-bold">Titre</h3>
  <p className="text-muted-foreground">Description</p>
</div>
```

### 4. Item de menu actif
```tsx
<div className="bg-accent text-accent-foreground px-3 py-2 rounded">
  Item sélectionné
</div>
```

### 5. Message d'erreur
```tsx
<Alert variant="destructive">
  <AlertTitle>Erreur</AlertTitle>
  <AlertDescription>Quelque chose s'est mal passé</AlertDescription>
</Alert>
```

---

## 📐 Radius

#### `--radius`
- **Valeur** : `0.625rem` (10px)
- **Usage** : Border-radius par défaut des composants
- **Classe Tailwind** : Utiliser `rounded-[--radius]` ou les composants shadcn l'appliquent automatiquement

---

## 🌈 Format de couleur : OKLCH

Votre projet utilise **OKLCH** (meilleur que HSL pour la perception humaine).

**Structure** : `oklch(Lightness% Chroma Hue / Alpha)`
- **Lightness** : 0-100% (luminosité)
- **Chroma** : intensité de la couleur
- **Hue** : 0-360 (teinte)
- **Alpha** : 0-1 (opacité, optionnel)

---

## ✅ Bonnes pratiques

1. **Toujours utiliser les variables sémantiques** au lieu de couleurs hardcodées
   - ✅ `text-foreground`
   - ❌ `text-white`

2. **Respecter les paires foreground/background**
   - `bg-card` → `text-card-foreground`
   - `bg-primary` → `text-primary-foreground`

3. **Utiliser les variants de boutons shadcn** plutôt que créer des styles custom

4. **Pour du texte secondaire**, utiliser `text-muted-foreground`

5. **Pour les bordures**, utiliser `border-border` ou `border-input`

---

## 🔄 Adapter pour d'autres projets

Pour réutiliser ce système :

1. Copier les variables CSS de `:root` dans `globals.css`
2. Copier la section `@theme inline` si nécessaire
3. Ajuster les valeurs OKLCH selon votre charte graphique
4. Garder les noms de variables identiques pour la compatibilité shadcn

---

## 📚 Ressources

- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
- [Tailwind CSS Variables](https://tailwindcss.com/docs/customizing-colors#using-css-variables)
- [OKLCH Color Picker](https://oklch.com)
