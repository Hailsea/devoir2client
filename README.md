# SR03 — Client de messagerie (Chat)

Application web de chat développée dans le cadre de SR03.

Ce dépôt contient le front-end en React. Il communique avec un
back-end fait en Spring Boot séparé qui expose une API REST et un serveur WebSocket.

---

## Fonctionnalités

- Authentification des utilisateurs
- Gestion des chats :
  - création et modification d'un chat avec une période d'ouverture/fermeture
  - suppression, uniquement possible par le propriétaire
  - possibilité de quitter un salon que l'on a rejoint
- Messagerie via WebSocket
- Système d'invitations :
  - inviter un utilisateur dans un chat
  - consulter, accepter ou refuser les invitations reçues
  - suivre l'état des invitations envoyées
- Pagination des listes des chats.

---

## Stack technique

| Outil | Rôle |
|-----|------|
| React| Bibliothèque d'interface |
| Vite| Serveur de développement et build |

---

## Structure du projet

```
sr03-client/
├── public/                 # Fichiers statiques
├── src/
│   ├── assets/             # Images
│   ├── components/         
│   │   ├── Chat/           # Chat
│   │   ├── Dashboard/      # Liste des chat, cartes et popUp
│   │   ├── Formulaire/     # Création / modification d'un salon
│   │   ├── Invitations/    # Invitations reçues, envoyées et envoi d'invitation
│   │   ├── Layout/         # Header / Nav / Aside / Footer
│   │   └── Login/          
│   ├── services/
│   │   └── api.js          # Centralise tous les appels API
│   ├── utils/              # Fonctions utilitaires
│   ├── App.jsx             
│   └── main.jsx            
├── .env                    # Variables d'environnement (url de l'API)
├── index.html
├── vite.config.js
└── package.json
```

## Prérequis

- [Node.js](https://nodejs.org) **20 ou supérieur** (requis par Vite 8) et `npm`.
- Le **back-end** doit être démarré et accessible (par défaut
  sur le port `8080`) pour que l'application soit fonctionnelle

---

## Lancer le projet

```bash
# version de developpement
npm run dev

# version de production 
npm run build

```
Le serveur de développement est  accessible à l'adresse par défaut `http://localhost:5173`

---

## Auteurs

Projet réalisé par Laurent CHEN GI04 et Eloise LAUNAY GI04
