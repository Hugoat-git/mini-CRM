# Outlook CRM Extractor

Application desktop pour extraire automatiquement des contacts depuis vos emails Outlook et les gérer dans un CRM personnel.

## Fonctionnalités

- **Connexion IMAP** : Connexion sécurisée à votre compte Outlook via IMAP
- **Extraction de contacts** : Extraction automatique de contacts depuis vos emails
- **Validation manuelle** : Ajout de notes personnalisées avant de valider un contact
- **Dashboard minimaliste** : Interface simple pour gérer vos contacts
- **Suivi de la source** : Enregistrement de l'expéditeur qui a envoyé le contact
- **Recherche** : Recherche rapide parmi vos contacts

## Prérequis

- Node.js (v18 ou supérieur)
- npm ou yarn
- Compte Outlook/Hotmail avec IMAP activé

## Activation d'IMAP sur Outlook

1. Allez sur https://outlook.live.com/mail/0/options/mail/accounts
2. Cliquez sur "Sync email" (Synchroniser le courrier)
3. Activez "Let devices and apps use IMAP"
4. Utilisez un "App Password" si vous avez l'authentification à deux facteurs

## Installation

1. Clonez le repository :
\`\`\`bash
git clone <votre-repo>
cd mini-CRM
\`\`\`

2. Installez toutes les dépendances :
\`\`\`bash
npm run install:all
\`\`\`

Cela installera les dépendances pour :
- Le projet principal (Electron)
- Le backend (API Node.js)
- Le frontend (React)

## Configuration

1. Créez un fichier `.env` dans le dossier `backend/` :
\`\`\`bash
cp backend/.env.example backend/.env
\`\`\`

2. Le fichier `.env` contient les paramètres par défaut pour Outlook :
\`\`\`env
IMAP_HOST=outlook.office365.com
IMAP_PORT=993
PORT=3001
\`\`\`

Vous n'avez pas besoin de remplir IMAP_USER et IMAP_PASSWORD ici, vous les entrerez dans l'interface lors de la première connexion.

## Démarrage de l'application

En mode développement :
\`\`\`bash
npm run dev
\`\`\`

Cela démarre :
- Le backend sur http://localhost:3001
- Le frontend sur http://localhost:5173
- L'application Electron

## Utilisation

### 1. Première connexion

Au premier lancement, vous verrez l'écran de connexion :

1. Entrez votre email Outlook (ex: votreemail@outlook.com)
2. Entrez votre mot de passe Outlook
   - Si vous avez l'authentification à deux facteurs, utilisez un "App Password"
3. (Optionnel) Cliquez sur "Afficher les paramètres avancés" si vous utilisez un autre serveur IMAP
4. Cliquez sur "Se connecter"

### 2. Extraire des contacts

1. Cliquez sur "Emails" dans la barre latérale
2. Vos 20 derniers emails apparaissent
3. Cliquez sur le bouton "Extraire" à côté d'un email
4. L'application analyse l'email et extrait automatiquement :
   - Les adresses email
   - Les noms associés
   - Les numéros de téléphone
   - Les noms d'entreprises

### 3. Valider et ajouter un contact

1. Après l'extraction, un formulaire apparaît sur la droite
2. Vérifiez/modifiez les informations du contact
3. Ajoutez une note personnelle (optionnel)
4. Cliquez sur "Enregistrer"

Le contact est automatiquement lié à l'expéditeur de l'email.

### 4. Gérer vos contacts

1. Cliquez sur "Dashboard" dans la barre latérale
2. Vous verrez tous vos contacts avec :
   - Nom, email, téléphone, entreprise
   - Note personnelle
   - Expéditeur qui a envoyé ce contact
   - Date d'ajout
3. Utilisez la barre de recherche pour filtrer
4. Cliquez sur l'icône de corbeille pour supprimer un contact

## Architecture du projet

\`\`\`
mini-CRM/
├── electron/           # Application Electron
│   ├── main.js        # Process principal
│   └── preload.js     # Preload script
├── backend/           # API Node.js
│   └── src/
│       ├── routes/    # Routes API
│       ├── database/  # Configuration SQLite
│       └── server.js  # Serveur Express
├── frontend/          # Interface React
│   └── src/
│       ├── components/  # Composants React
│       ├── services/    # Appels API
│       └── App.tsx
└── database.sqlite    # Base de données (créée automatiquement)
\`\`\`

## Sécurité

⚠️ **Important** : Cette version stocke les mots de passe en clair dans la base de données SQLite locale. Pour une utilisation en production, il est recommandé de :
- Chiffrer les credentials avec une clé de chiffrement
- Utiliser un gestionnaire de mots de passe système (Keychain sur macOS, Credential Manager sur Windows)
- Implémenter OAuth 2.0 au lieu de IMAP

## Dépannage

### Erreur de connexion IMAP

- Vérifiez que IMAP est bien activé dans vos paramètres Outlook
- Si vous avez l'authentification à deux facteurs, créez un "App Password"
- Vérifiez que le serveur est bien `outlook.office365.com` et le port `993`

### Aucun email ne s'affiche

- Vérifiez votre connexion Internet
- Essayez de cliquer sur "Actualiser"
- Vérifiez les logs du backend dans le terminal

### Erreur "Contact existe déjà"

- Chaque email est unique dans la base de données
- Modifiez l'email ou supprimez l'ancien contact avant d'ajouter le nouveau

## Technologies utilisées

- **Frontend** : React 18, TypeScript, Vite, TailwindCSS, Lucide Icons
- **Backend** : Node.js, Express, IMAP, MailParser, Better-SQLite3
- **Desktop** : Electron
- **Base de données** : SQLite

## Licence

MIT
