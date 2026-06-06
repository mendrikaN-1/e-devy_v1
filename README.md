# E-DEVY — Plateforme Pédagogique

> Algorithmique, MATLAB et Méthodes Numériques  
> Pour les étudiants de l'Université d'Antananarivo — S3

---

## 📌 Description

E-DEVY est une plateforme web éducative statique (aucun backend, aucune base de données) dédiée aux étudiants de l'Université d'Antananarivo.

Le contenu pédagogique est basé **strictement** sur le support de cours S3 officiel.

---

## 🚀 Installation et lancement

```bash
# 1. Cloner le dépôt
git clone https://github.com/votre-repo/e-devy.git
cd e-devy

# 2. Installer les dépendances
npm install

# 3. Lancer en mode développement
npm run dev
# → Ouvrir http://localhost:3000

# 4. Build de production
npm run build

# 5. Lancer la version production
npm run start
```

---

## 📁 Structure du projet

```
e-devy/
├── app/
│   ├── page.tsx                    # Accueil
│   ├── layout.tsx                  # Layout global + Navbar + Footer
│   ├── globals.css                 # Styles globaux (W3Schools-inspired)
│   ├── cours/
│   │   ├── page.tsx                # Index des cours
│   │   ├── algorithmique/page.tsx  # Cours algorithmique complet
│   │   ├── organigrammes/page.tsx  # Cours organigrammes avec SVG
│   │   └── matlab/page.tsx         # Cours MATLAB complet
│   ├── methodes/
│   │   ├── page.tsx                # Index méthodes numériques
│   │   ├── dichotomie/
│   │   │   ├── page.tsx            # Théorie + démo + algo
│   │   │   └── DichotomieSimulator.tsx  # Simulateur interactif
│   │   ├── newton/
│   │   │   ├── page.tsx
│   │   │   └── NewtonSimulator.tsx
│   │   ├── rectangles/page.tsx
│   │   ├── trapezes/page.tsx
│   │   └── simpson/page.tsx
│   ├── pratique/
│   │   ├── page.tsx                # Page simulateur algo
│   │   └── AlgoSimulator.tsx       # Simulateur pseudo-code pas à pas
│   ├── exercices/page.tsx          # 50 exercices avec filtres
│   └── apropos/page.tsx            # À propos + installation
├── components/
│   ├── Navbar.tsx                  # Navigation responsive
│   ├── Footer.tsx                  # Pied de page
│   ├── CodeBlock.tsx               # Blocs de code algo/MATLAB
│   ├── Sidebar.tsx                 # Navigation latérale
│   └── IntegSimulator.tsx          # Simulateur intégration numérique
├── data/
│   ├── courses.json                # Contenu des cours (algo + MATLAB)
│   ├── exercises.json              # 50 exercices progressifs
│   └── numerical_methods.json      # Méthodes numériques détaillées
└── public/
    └── favicon.ico
```

---

## 📚 Contenu pédagogique

### Cours (basés strictement sur le support S3)

| Module | Chapitres |
|--------|-----------|
| **Algorithmique** | Introduction, SI/SELON, TANTQUE, REPETER, POUR |
| **Organigrammes** | Symboles normalisés, schémas SVG interactifs |
| **MATLAB** | Variables/matrices, opérateurs, input/disp, scripts/functions, structures de contrôle |
| **Méthodes numériques** | Dichotomie, Newton, Rectangles, Trapèzes, Simpson |

### Simulateur Pseudo-Code

- Zone de saisie de pseudo-code
- Bouton **Exécuter** (toutes les étapes)
- Bouton **Pas à Pas** (étape par étape)
- Tableau mémoire des variables
- Historique des calculs
- Explication logique en langage naturel

### Méthodes Numériques — 5 parties par méthode

1. **Théorie** : objectif, principe, hypothèses, avantages, limites
2. **Démonstration** : origine de la formule, pas à pas mathématique
3. **Visualisation** : schémas SVG explicatifs
4. **Algorithme pas à pas** : tableau d'itérations interactif
5. **Explication logique** : résumé en langage naturel pour débutants

### Exercices

- **50 exercices** répartis en 4 niveaux : Débutant / Intermédiaire / Avancé / Expert
- **7 catégories** : Variables, Conditions, Boucles, Fonctions, Tableaux, Matrices, Méthodes numériques
- Chaque exercice contient : énoncé, pseudo-code, solution, explication détaillée

---

## 🌐 Déploiement gratuit

### Vercel (recommandé)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Uploader le dossier "out/" sur netlify.com
```

### GitHub Pages
```bash
# Dans next.config.ts, output: "export" est déjà configuré
npm run build
# Le dossier "out/" contient le site statique
# Activer GitHub Pages sur le dépôt → branch gh-pages → dossier /out
```

---

## 🛠 Technologies

- **Next.js 15** (App Router, Static Export)
- **TypeScript**
- **TailwindCSS v4**
- **React 19**
- Aucune dépendance externe de rendu (pas de Chart.js, SVG natif)

---

## 📝 Données

Toutes les données sont dans `/data/` au format JSON :

| Fichier | Contenu |
|---------|---------|
| `courses.json` | Contenu algorithmique + MATLAB |
| `exercises.json` | 50 exercices avec solutions |
| `numerical_methods.json` | 5 méthodes numériques détaillées |

---

## 👥 Public cible

Étudiants de l'Université d'Antananarivo — S3  
Cours : Algorithmique, Organigrammes, MATLAB, Méthodes Numériques

---

*E-DEVY — L'apprentissage avant tout*
