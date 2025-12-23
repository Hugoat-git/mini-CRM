const express = require('express');
const router = express.Router();
const { getDB } = require('../database/db');
const Imap = require('imap');

// Tester la connexion IMAP
router.post('/test-imap', async (req, res) => {
  const { email, password, host, port } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  const imapConfig = {
    user: email,
    password: password,
    host: host || 'outlook.office365.com',
    port: port || 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
  };

  const imap = new Imap(imapConfig);

  return new Promise((resolve) => {
    imap.once('ready', () => {
      imap.end();
      res.json({ success: true, message: 'Connexion réussie' });
      resolve();
    });

    imap.once('error', (err) => {
      res.status(401).json({
        success: false,
        error: 'Échec de connexion IMAP',
        details: err.message
      });
      resolve();
    });

    imap.connect();
  });
});

// Sauvegarder la configuration IMAP
router.post('/save-config', (req, res) => {
  const { email, password, host, port } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  const db = getDB();

  // Supprimer l'ancienne config
  db.prepare('DELETE FROM imap_config').run();

  // Insérer la nouvelle config
  const stmt = db.prepare(`
    INSERT INTO imap_config (email, host, port, password)
    VALUES (?, ?, ?, ?)
  `);

  stmt.run(
    email,
    host || 'outlook.office365.com',
    port || 993,
    password // En production, il faudrait chiffrer le mot de passe
  );

  res.json({ success: true, message: 'Configuration sauvegardée' });
});

// Récupérer la configuration IMAP
router.get('/config', (req, res) => {
  const db = getDB();
  const config = db.prepare('SELECT email, host, port FROM imap_config LIMIT 1').get();

  if (!config) {
    return res.json({ configured: false });
  }

  res.json({
    configured: true,
    email: config.email,
    host: config.host,
    port: config.port
  });
});

module.exports = router;
