# Scolia — Quickstart

Companion scolaire mobile-first : aide aux devoirs + écoute bien-être, avec vue professeur.

---

## Prérequis

- **Node.js** ≥ 18
- Un compte [OpenRouter](https://openrouter.ai) et une clé API

---

## 1. Installer les dépendances

```bash
cd scolia
npm install
```

## 2. Configurer la clé API

```bash
cp .env.example .env
```

Ouvre `.env` et remplace la valeur :

```
VITE_OPENROUTER_API_KEY=sk-or-VOTRE_CLE_ICI
```

> Le modèle par défaut est `openai/gpt-4o-mini`. Pour en changer, modifie `OPENROUTER_MODEL` dans `src/config.js`.

## 3. Lancer en mode dev (accessible sur le réseau local)

```bash
npm run dev -- --host
```

Le terminal affichera deux URLs :

```
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

Ouvre l'URL **Network** sur un téléphone (même Wi-Fi) pour tester en conditions mobiles réelles.

> Pour une démo rapide sur desktop, active le mode mobile dans Chrome : `F12` → icône téléphone (Toggle device toolbar) → choisir un iPhone ou Pixel.

---

## Routes

| URL | Vue |
|-----|-----|
| `/` | Accueil — saisie du prénom au premier lancement |
| `/homework` | Chat Aide aux devoirs |
| `/feelings` | Chat Bien-être |
| `/teacher` | Vue Professeur |

---

## Build production

```bash
npm run build
npm run preview -- --host
```

---

## Notes

- La clé API est embarquée dans le bundle front-end. Pour un déploiement public, configure une **restriction de domaine** et un **plafond de dépenses** dans le dashboard OpenRouter.
- Aucun contenu de conversation bien-être n'est transmis à la vue professeur — seul le pseudo et l'horodatage sont visibles.
- Les données (signaux, conversations, prénom) sont stockées dans le `localStorage` du navigateur et disparaissent si l'utilisateur vide son cache.
