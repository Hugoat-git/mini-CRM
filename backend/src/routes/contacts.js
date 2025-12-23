const express = require('express');
const router = express.Router();
const { getDB } = require('../database/db');

// Récupérer tous les contacts
router.get('/', (req, res) => {
  const db = getDB();
  const contacts = db.prepare(`
    SELECT * FROM contacts
    ORDER BY created_at DESC
  `).all();

  res.json(contacts);
});

// Ajouter un nouveau contact
router.post('/', (req, res) => {
  const {
    name,
    email,
    phone,
    company,
    note,
    sender_email,
    sender_name,
    source_email_subject,
    source_email_date
  } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Nom et email requis' });
  }

  const db = getDB();

  try {
    const stmt = db.prepare(`
      INSERT INTO contacts (
        name, email, phone, company, note,
        sender_email, sender_name, source_email_subject, source_email_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name,
      email,
      phone || null,
      company || null,
      note || null,
      sender_email || null,
      sender_name || null,
      source_email_subject || null,
      source_email_date || null
    );

    res.json({
      success: true,
      id: result.lastInsertRowid,
      message: 'Contact ajouté avec succès'
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(409).json({ error: 'Ce contact existe déjà' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Mettre à jour un contact
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone, company, note } = req.body;

  const db = getDB();

  try {
    const stmt = db.prepare(`
      UPDATE contacts
      SET name = ?, email = ?, phone = ?, company = ?, note = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(name, email, phone, company, note, id);

    res.json({ success: true, message: 'Contact mis à jour' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer un contact
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const db = getDB();

  try {
    const stmt = db.prepare('DELETE FROM contacts WHERE id = ?');
    stmt.run(id);

    res.json({ success: true, message: 'Contact supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rechercher des contacts
router.get('/search', (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.json([]);
  }

  const db = getDB();
  const contacts = db.prepare(`
    SELECT * FROM contacts
    WHERE name LIKE ? OR email LIKE ? OR company LIKE ?
    ORDER BY created_at DESC
  `).all(`%${q}%`, `%${q}%`, `%${q}%`);

  res.json(contacts);
});

module.exports = router;
