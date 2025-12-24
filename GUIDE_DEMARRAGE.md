# Guide de Démarrage Rapide - Windows

## Étapes pour lancer l'application

### 1. Vérifier l'installation de Node.js

Ouvrez l'**Invite de commandes** (CMD) ou **PowerShell** et tapez :

```bash
node --version
npm --version
```

Vous devriez voir les numéros de version s'afficher (ex: v22.x.x et 10.x.x).
Si ce n'est pas le cas, redémarrez votre terminal après l'installation de Node.js.

---

### 2. Cloner le projet

Si vous ne l'avez pas encore fait :

```bash
git clone <url-de-votre-repo>
cd mini-CRM
```

---

### 3. Installer toutes les dépendances

Dans le dossier `mini-CRM`, exécutez :

```bash
npm run install:all
```

Cette commande va installer :
- Les dépendances Electron (racine du projet)
- Les dépendances du backend (API Node.js)
- Les dépendances du frontend (React)

Cela peut prendre 2-3 minutes.

---

### 4. Activer IMAP sur votre compte Outlook

**IMPORTANT** : Avant de lancer l'app, activez IMAP sur votre compte Outlook :

1. Allez sur https://outlook.live.com/mail/0/options/mail/accounts
2. Cliquez sur "Sync email"
3. Activez "Let devices and apps use IMAP"
4. Si vous avez l'authentification à 2 facteurs :
   - Allez dans les paramètres de sécurité Microsoft
   - Créez un "App Password" (mot de passe d'application)
   - Utilisez ce mot de passe au lieu de votre mot de passe habituel

---

### 5. Lancer l'application

Dans le dossier `mini-CRM`, exécutez :

```bash
npm run dev
```

Cette commande démarre :
- Le backend (API) sur http://localhost:3001
- Le frontend (React) sur http://localhost:5173
- L'application Electron (fenêtre qui s'ouvre automatiquement)

L'application peut mettre 10-20 secondes à démarrer.

---

### 6. Première connexion

Quand l'application s'ouvre :

1. Entrez votre **email Outlook** (ex: `votreemail@outlook.com`)
2. Entrez votre **mot de passe** (ou App Password si 2FA activé)
3. Cliquez sur **"Se connecter"**

Si la connexion réussit, vous verrez l'interface principale avec :
- **Sidebar gauche** : Navigation Dashboard / Emails
- **Zone principale** : Contenu

---

### 7. Extraire votre premier contact

1. Cliquez sur **"Emails"** dans la sidebar
2. Attendez que vos emails se chargent (peut prendre quelques secondes)
3. Cliquez sur **"Extraire"** à côté d'un email
4. Vérifiez les informations extraites dans le panneau de droite
5. Ajoutez une **note personnelle** si vous voulez
6. Cliquez sur **"Enregistrer"**

Votre contact est maintenant dans le CRM !

---

### 8. Voir vos contacts

1. Cliquez sur **"Dashboard"** dans la sidebar
2. Vous verrez tous vos contacts enregistrés
3. Utilisez la **barre de recherche** pour filtrer
4. Cliquez sur l'**icône corbeille** pour supprimer un contact

---

## Dépannage

### L'application ne se lance pas

- Vérifiez que Node.js est bien installé : `node --version`
- Vérifiez que vous êtes dans le bon dossier : `cd mini-CRM`
- Réinstallez les dépendances : `npm run install:all`

### Erreur de connexion IMAP

- Vérifiez que IMAP est activé dans vos paramètres Outlook
- Vérifiez votre email et mot de passe
- Si vous avez 2FA, utilisez un App Password
- Le serveur doit être `outlook.office365.com` et le port `993`

### Aucun email ne s'affiche

- Vérifiez votre connexion Internet
- Cliquez sur le bouton "Actualiser"
- Vérifiez que votre boîte de réception n'est pas vide
- Regardez les logs dans le terminal pour voir les erreurs

### Erreur "Contact existe déjà"

- Chaque email est unique dans la base de données
- Supprimez l'ancien contact avant d'en ajouter un nouveau avec le même email
- Ou modifiez l'email du nouveau contact

---

## Arrêter l'application

Dans le terminal, appuyez sur `Ctrl + C` pour arrêter l'application.

Ou fermez simplement la fenêtre Electron.

---

## Pour les développeurs

### Lancer uniquement le backend

```bash
cd backend
npm run dev
```

Backend disponible sur http://localhost:3001

### Lancer uniquement le frontend

```bash
cd frontend
npm run dev
```

Frontend disponible sur http://localhost:5173

### Structure de la base de données

La base de données SQLite est créée automatiquement dans :
```
mini-CRM/database.sqlite
```

Vous pouvez l'ouvrir avec un outil comme DB Browser for SQLite.

---

## Support

En cas de problème, vérifiez :
1. Les logs dans le terminal
2. La console développeur Electron (F12 dans l'app)
3. Le fichier `backend/.env` pour la configuration
