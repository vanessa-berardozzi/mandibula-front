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
- **Usage** : Fond des composants de type carte, panels isolés du fond principal
- **Exemples d'usage** :
  - Cartes de produits (fiche isopode, blatte, accessoires)
  - Panels d'information (encarts de conseils, fiches techniques)
  - Conteneurs de formulaires (zone d'inscription, de contact)
  - Cards de blog ou articles
  - Boîtes de dialogue personnalisées
  - Sections isolées dans une page (zones de FAQ, témoignages)
  - Conteneurs de galerie d'images
- **Dans votre projet** : Noir foncé (`oklch(0.205 0 0)`)

#### `--card-foreground` / `text-card-foreground`
- **Usage** : Texte lisible sur fond `card`, garantit un bon contraste
- **Exemples d'usage** :
  - Titres de cartes de produits
  - Descriptions et contenus textuels dans les cards
  - Labels et informations dans les panels
  - Texte des boutons dans les cartes
  - Prix, quantités, métadonnées
- **Dans votre projet** : Blanc (`oklch(0.985 0 0)`)

---

### **Popover**

#### `--popover` / `bg-popover`
- **Usage** : Fond des éléments flottants superposés au contenu principal
- **Exemples d'usage** :
  - Menus déroulants (sélection de catégories, filtres, options)
  - Tooltips informatifs (infos bulles au survol)
  - Suggestions d'autocomplete (recherche de produits, tags)
  - Menus contextuels (clic droit, actions secondaires)
  - Dropdowns de navigation
  - Calendriers (date pickers)
  - Sélecteurs de couleurs ou options avancées
  - Sous-menus dans la navigation
- **Dans votre projet** : Noir foncé (`oklch(0.205 0 0)`)

#### `--popover-foreground` / `text-popover-foreground`
- **Usage** : Texte sur fond `popover`, lisible dans les éléments flottants
- **Exemples d'usage** :
  - Texte des options de menu
  - Contenu des tooltips
  - Labels dans les dropdowns
  - Texte des suggestions autocomplete
  - Descriptions dans les menus contextuels
- **Dans votre projet** : Blanc (`oklch(0.985 0 0)`)

---

### **Primary**

#### `--primary` / `bg-primary`
- **Usage** : Couleur d'action principale, CTA (Call-To-Action), éléments demandant l'attention
- **Exemples d'usage** :
  - Boutons d'action principale ("Ajouter au panier", "Commander", "S'inscrire", "Valider")
  - Liens importants et CTA textuels
  - Badges "Nouveau", "Offre spéciale", "Tendance"
  - Indicateurs de progression (barres de chargement)
  - Icônes d'état actif ou validé
  - Bordures d'éléments sélectionnés ou en focus
  - Highlights dans le texte
  - Boutons flottants d'action (FAB)
  - Indicateurs de notifications importantes
  - Accents sur les éléments interactifs principaux
- **Dans votre projet** : Vert fluo (`oklch(93.8% 0.127 124.321)`), couleur signature du thème jungle futuriste

#### `--primary-foreground` / `text-primary-foreground`
- **Usage** : Texte lisible sur fond `primary`, assure le contraste optimal
- **Exemples d'usage** :
  - Texte des boutons principaux
  - Labels dans les badges primary
  - Texte sur fond vert fluo
  - Icônes sur fond primary
- **Dans votre projet** : Noir foncé (`oklch(0.205 0 0)`)

---

### **Secondary**

#### `--secondary` / `bg-secondary`
- **Usage** : Couleur pour actions secondaires, moins prioritaires que primary
- **Exemples d'usage** :
  - Boutons d'action secondaire ("Annuler", "Retour", "Fermer", "Ignorer")
  - Boutons de navigation alternative
  - Tags et labels informatifs ("Intermédiaire", "Niveau 2", "En cours")
  - Badges de catégorie secondaires
  - Boutons de filtres non actifs
  - Actions alternatives dans les formulaires
  - Boutons d'export, d'impression
  - Liens secondaires moins critiques
  - Éléments d'interface neutres
  - Boutons d'options dans les modales
- **Dans votre projet** : Gris foncé (`oklch(0.269 0 0)`)

#### `--secondary-foreground` / `text-secondary-foreground`
- **Usage** : Texte sur fond `secondary`, contraste suffisant pour la lisibilité
- **Exemples d'usage** :
  - Texte des boutons secondaires
  - Labels dans les badges secondaires
  - Texte sur fond gris foncé
- **Dans votre projet** : Blanc (`oklch(0.985 0 0)`)

---

### **Muted**

#### `--muted` / `bg-muted`
- **Usage** : Arrière-plans atténués, éléments discrets qui ne doivent pas attirer l'attention
- **Exemples d'usage** :
  - Zones de code (snippets, exemples de configuration)
  - Badges informatifs subtils ("En stock", "Disponible", "Actif")
  - Backgrounds de sections discrètes
  - Footers de page
  - Sections de FAQ ou d'aide
  - Zones de texte non éditables ou en lecture seule
  - Backgrounds d'inputs désactivés
  - Bandes d'information secondaires
  - Zones de citation ou de notes
  - Barres latérales d'information contextuelle
- **Dans votre projet** : Gris foncé (`oklch(0.269 0 0)`)

#### `--muted-foreground` / `text-muted-foreground`
- **Usage** : Texte secondaire, moins important, discret
- **Exemples d'usage** :
  - Descriptions et sous-titres
  - Labels de formulaire
  - Timestamps ("Publié le...", "Mis à jour il y a...")
  - Métadonnées (auteur, catégorie, durée de lecture)
  - Texte d'aide ou d'instructions
  - Placeholders d'inputs
  - Texte désactivé ou non interactif
  - Légendes d'images
  - Informations complémentaires
  - Notes de bas de page
  - Statuts neutres ("En attente", "Non spécifié")
- **Dans votre projet** : Gris moyen (`oklch(0.708 0 0)`)

---

### **Accent**

#### `--accent` / `bg-accent`
- **Usage** : Mise en évidence au survol, états actifs, highlightage sans être aussi fort que primary
- **Exemples d'usage** :
  - Items de menu au survol (hover state)
  - Lignes sélectionnées dans des listes ou tableaux
  - Éléments actifs dans la navigation
  - Catégories sélectionnées dans la sidebar
  - Onglets actifs
  - Items de liste au focus clavier
  - Highlights discrets (moins intenses que primary)
  - Backgrounds de boutons tertiaires
  - Zones interactives au hover
  - États de sélection dans des filtres
  - Rangées alternées dans des tableaux (zebra striping)
  - Zones d'interaction subtiles
- **Dans votre projet** : Gris foncé (`oklch(0.269 0 0)`)

#### `--accent-foreground` / `text-accent-foreground`
- **Usage** : Texte sur fond `accent`, garanti lisible sur fond accentué
- **Exemples d'usage** :
  - Texte d'élément survolé
  - Labels sur fond accent
  - Texte d'items actifs dans les menus
  - Contenu des onglets actifs
- **Dans votre projet** : Blanc (`oklch(0.985 0 0)`)

---

### **Destructive**

#### `--destructive` / `bg-destructive`
- **Usage** : Actions destructives, erreurs, alertes critiques, situations dangereuses
- **Exemples d'usage** :
  - Boutons de suppression ("Supprimer", "Effacer", "Retirer définitivement")
  - Messages d'erreur ("Erreur de connexion", "Échec de l'opération")
  - Alertes critiques ("Action irréversible", "Attention : données perdues")
  - Badges d'alerte ("Rupture de stock", "Expiré", "Invalide")
  - Notifications d'échec
  - Indicateurs d'erreur de validation de formulaire
  - Boutons de confirmation d'actions dangereuses
  - Messages d'avertissement sévères
  - États d'erreur critiques
  - Icônes d'alerte ou de danger
  - Bordures d'inputs invalides
  - Texte d'erreur dans les formulaires ("Mot de passe incorrect", "Email déjà utilisé")
- **Dans votre projet** : Rouge (`oklch(0.704 0.191 22.216)`)

#### `--destructive-foreground` / `text-destructive-foreground`
- **Usage** : Texte sur fond destructive, contraste maximal pour les situations critiques
- **Exemples d'usage** :
  - Texte des boutons de suppression
  - Labels dans les alertes critiques
  - Contenu des messages d'erreur sur fond rouge
- **Dans votre projet** : Blanc (implicite)

---

### **Bordures & Inputs**

#### `--border` / `border-border`
- **Usage** : Couleur des bordures par défaut pour tous les éléments nécessitant un contour subtil
- **Exemples d'usage** :
  - Contours de cartes de produits
  - Bordures de conteneurs et sections
  - Séparateurs horizontaux (dividers, `<hr>`)
  - Bordures de tableaux
  - Contours de modales et dialogues
  - Bordures de la navigation
  - Séparations dans les menus
  - Bordures d'images ou de vignettes
  - Encadrements de zones de contenu
  - Bordures de panels latéraux
- **Dans votre projet** : Blanc à 10% d'opacité (`oklch(1 0 0 / 10%)`), discret sur fond sombre

#### `--input` / `border-input`
- **Usage** : Bordure spécifique aux champs de formulaire, légèrement plus visible que border
- **Exemples d'usage** :
  - Bordures des champs de texte (`<Input />`)
  - Contours des textareas
  - Bordures des selects et dropdowns
  - Encadrements des champs de formulaire
  - Bordures des date pickers
  - Contours des champs de recherche
  - Bordures des inputs de nombre, email, password
  - Contours des zones de téléchargement de fichiers
- **Dans votre projet** : Blanc à 15% d'opacité (`oklch(1 0 0 / 15%)`), un peu plus visible pour guider l'utilisateur

#### `--ring` / `ring-ring`
- **Usage** : Anneau de focus (accessibilité), visible au focus clavier pour la navigation
- **Exemples d'usage** :
  - Contour de focus sur les boutons (navigation clavier)
  - Ring autour des inputs au focus clavier
  - Indication de focus sur les liens
  - Contour de focus sur les éléments interactifs (checkboxes, radios)
  - Anneau de sélection au clavier
  - Highlight d'accessibilité sur les cartes cliquables
  - Focus sur les éléments de menu
- **Dans votre projet** : Gris moyen (`oklch(0.556 0 0)`), visible mais non intrusif

---

## 🗂️ Variables Sidebar (personnalisées)

#### `--sidebar` / `bg-sidebar`
- **Usage** : Fond de la barre latérale, palette spécifique pour l'identité visuelle
- **Exemples d'usage** :
  - Fond de la sidebar principale
  - Background de navigation latérale
  - Fond de menu de catégories
  - Zone de filtres latéraux
- **Dans votre projet** : Blanc cassé semi-transparent (`rgba(245, 234, 234, 0.041)`), effet jungle discret

#### `--sidebar-foreground` / `text-sidebar-foreground`
- **Usage** : Texte par défaut dans la sidebar, couleur signature de l'interface
- **Exemples d'usage** :
  - Texte des items de menu
  - Labels de catégories
  - Liens de navigation latérale
  - Descriptions dans la sidebar
- **Dans votre projet** : Vert-bleu clair (`#b5cccb`), évoque l'ambiance jungle post-apo

#### `--sidebar-primary` / `bg-sidebar-primary`
- **Usage** : Couleur primaire spécifique à la sidebar, élément actif ou important
- **Exemples d'usage** :
  - Fond de l'item de menu actif
  - Highlight de la catégorie sélectionnée
  - Badge de niveau ("Débutant", "Expert")
  - Indicateur de section active
  - Accent fort dans la navigation
- **Dans votre projet** : Rose/magenta (`oklch(63.635% 0.20093 338.708 / 0.623)`), contraste vibrant

#### `--sidebar-primary-foreground` / `text-sidebar-primary-foreground`
- **Usage** : Texte sur fond primaire sidebar, lisible sur le rose/magenta
- **Exemples d'usage** :
  - Texte de l'item actif
  - Label sur badge primaire sidebar
  - Contenu sur fond rose
- **Dans votre projet** : Vert (`oklch(66.987% 0.20089 144.837)`), harmonie végétale

#### `--sidebar-accent` / `bg-sidebar-accent`
- **Usage** : Accentuation sidebar au survol ou pour les états intermédiaires
- **Exemples d'usage** :
  - Fond d'item de menu au hover
  - Background de catégorie survolée
  - Highlight subtil dans la navigation
  - Zone d'interaction dans les filtres
  - État de pre-selection
- **Dans votre projet** : Vert clair (`oklch(69.376% 0.14892 160.686)`), continuité du thème

#### `--sidebar-accent-foreground` / `text-sidebar-accent-foreground`
- **Usage** : Texte sur fond accent sidebar
- **Exemples d'usage** :
  - Texte d'item survolé
  - Labels sur fond vert clair
  - Contenu des zones accentuées
- **Dans votre projet** : Vert plus clair (`oklch(75.46% 0.17043 159.133)`), gradient végétal

#### `--sidebar-border` / `border-sidebar-border`
- **Usage** : Bordures et séparateurs dans la sidebar
- **Exemples d'usage** :
  - Séparateurs entre sections de menu
  - Bordures d'items
  - Contours de zones de navigation
  - Dividers dans les listes de catégories
- **Dans votre projet** : Vert foncé semi-transparent (`rgba(11, 44, 30, 0.212)`), discrétion jungle

#### `--sidebar-ring` / `ring-sidebar-ring`
- **Usage** : Focus ring spécifique à la sidebar pour l'accessibilité
- **Exemples d'usage** :
  - Ring de focus sur les items de menu au clavier
  - Contour d'accessibilité sur les liens
  - Indication de focus dans la navigation latérale
- **Dans votre projet** : Vert subtil (`oklch(65.645% 0.21343 142.434 / 0.014)`), visible sans être intrusif

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
