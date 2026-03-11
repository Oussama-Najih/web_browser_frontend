# Web Browser Frontend

Interface web d'un mini navigateur développée avec **Next.js** et **TypeScript**. Elle permet de gérer plusieurs onglets, visiter des URLs et naviguer dans l'historique.

> Ce frontend fonctionne en tandem avec le backend C disponible ici :  
> [**Oussama-Najih/web_browser_backend**](https://github.com/Oussama-Najih/web_browser_backend)

---

## Installation et lancement

### 1. Cloner le dépôt

```bash
git clone https://github.com/Oussama-Najih/web_browser_frontend.git
cd web_browser_frontend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## Fonctionnalités

- **Gestion des onglets** — créer, fermer et basculer entre les onglets
- **Navigation par URL** — saisir une URL et la visiter (touche `Entrée` ou bouton **Visit**)
- **Navigation avant / arrière** — boutons **Back** et **Forward**
- **Historique par onglet** — afficher / masquer l'historique de chaque onglet

---

## Structure du projet

```
web_browser_frontend/
├── app/
│   └── page.tsx                  # Page principale
├── components/
│   ├── TabList.tsx               # Gestion des onglets et barre d'URL
│   ├── HistoryList.tsx           # Affichage de l'historique et contrôles de navigation
│   └── ui/
│       └── button.tsx            # Composant Button (shadcn/ui)
├── lib/
│   ├── api.ts                    # Instance Axios configurée
│   └── types.ts                  # Types partagés (Tab, HistoryEntry)
├── public/
├── package.json
└── tsconfig.json
```

---

## Aperçu des composants

### `TabList.tsx` — Gestion des onglets
Orchestre l'ensemble de l'application : état actif des onglets, URL courante, historique et navigation.

| Fonction              | Description                                              |
|-----------------------|----------------------------------------------------------|
| `visitUrl()`          | Envoie une URL au backend et met à jour l'historique     |
| `navigate()`          | Déclenche la navigation avant ou arrière                 |
| `handleCreate()`      | Crée un nouvel onglet vide                               |
| `handleDelete()`      | Ferme un onglet et sélectionne le suivant s'il existe, sinon le précédent  |
| `onSelectTab()`       | Bascule vers un onglet et charge son historique          |
| `updateHistoryList()` | Met à jour la liste des URLs visitées pour l'onglet actif |
| `updateCurrentTab()`  | Met à jour les propriétés d'un onglet donné             |

---

### `HistoryList.tsx` — Historique et navigation
Affiche la liste des URLs visitées pour l'onglet actif et les boutons de navigation.

| Prop           | Type                                    | Description                                |
|----------------|-----------------------------------------|--------------------------------------------|
| `tabId`        | `number`                                | Identifiant de l'onglet actif              |
| `history`      | `HistoryEntry[]`                        | Liste des URLs visitées                    |
| `currentIndex` | `number`                                | Index de la page courante dans l'historique|
| `navigate`     | `(direction: "back" \| "forward") => void` | Callback de navigation                  |

---

## Connexion au backend

Le frontend communique avec le backend via `lib/api.ts` :

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
```


---

## API consommée

| Méthode  | Endpoint              | Description                          |
|----------|-----------------------|--------------------------------------|
| `GET`    | `/tabs`               | Récupère tous les onglets            |
| `POST`   | `/tabs`               | Crée un nouvel onglet                |
| `DELETE` | `/tab/:id`            | Supprime un onglet                   |
| `POST`   | `/tab/:id/visit`      | Visite une URL dans un onglet        |
| `POST`   | `/tab/:id/navigate`   | Navigation avant / arrière           |

---

## Backend

> Ce frontend est conçu pour fonctionner avec le backend C disponible ici :
>
> [**Oussama-Najih/web_browser_backend**](https://github.com/Oussama-Najih/web_browser_backend)
>
> Le backend expose une API REST sur `http://localhost:3001` et gère la persistance des onglets et de l'historique.

---

# Contexte

Ce projet représente le projet de fin de ma deuxième année et se concentre sur l’implémentation de structures de données en langage C.