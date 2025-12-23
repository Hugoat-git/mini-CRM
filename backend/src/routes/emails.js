const express = require('express');
const router = express.Router();
const Imap = require('imap');
const { simpleParser } = require('mailparser');
const { getDB } = require('../database/db');

// Fonction pour obtenir la config IMAP
function getImapConfig() {
  const db = getDB();
  const config = db.prepare('SELECT * FROM imap_config LIMIT 1').get();

  if (!config) {
    throw new Error('Configuration IMAP non trouvée');
  }

  return {
    user: config.email,
    password: config.password,
    host: config.host,
    port: config.port,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
  };
}

// Récupérer les emails récents
router.get('/recent', async (req, res) => {
  try {
    const imapConfig = getImapConfig();
    const imap = new Imap(imapConfig);
    const emails = [];

    imap.once('ready', () => {
      imap.openBox('INBOX', true, (err, box) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        // Chercher les 20 derniers emails
        const searchCriteria = ['ALL'];
        const fetchOptions = {
          bodies: ['HEADER', 'TEXT'],
          struct: true
        };

        imap.search(searchCriteria, (err, results) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          if (!results || !results.length) {
            imap.end();
            return res.json([]);
          }

          // Prendre les 20 derniers
          const recentResults = results.slice(-20);
          const f = imap.fetch(recentResults, fetchOptions);

          f.on('message', (msg, seqno) => {
            let buffer = '';
            let attributes = null;

            msg.on('body', (stream, info) => {
              stream.on('data', (chunk) => {
                buffer += chunk.toString('utf8');
              });
            });

            msg.once('attributes', (attrs) => {
              attributes = attrs;
            });

            msg.once('end', async () => {
              try {
                const parsed = await simpleParser(buffer);
                emails.push({
                  id: attributes.uid,
                  subject: parsed.subject || 'Sans sujet',
                  from: parsed.from?.text || 'Inconnu',
                  fromAddress: parsed.from?.value?.[0]?.address || '',
                  fromName: parsed.from?.value?.[0]?.name || '',
                  date: parsed.date || new Date(),
                  text: parsed.text?.substring(0, 500) || '',
                  html: parsed.html || ''
                });
              } catch (e) {
                console.error('Error parsing email:', e);
              }
            });
          });

          f.once('error', (err) => {
            console.error('Fetch error:', err);
          });

          f.once('end', () => {
            imap.end();
            // Trier par date décroissante
            emails.sort((a, b) => new Date(b.date) - new Date(a.date));
            res.json(emails);
          });
        });
      });
    });

    imap.once('error', (err) => {
      res.status(500).json({ error: err.message });
    });

    imap.connect();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Extraire les contacts d'un email spécifique
router.post('/extract-contacts', async (req, res) => {
  const { emailId } = req.body;

  if (!emailId) {
    return res.status(400).json({ error: 'Email ID requis' });
  }

  try {
    const imapConfig = getImapConfig();
    const imap = new Imap(imapConfig);

    imap.once('ready', () => {
      imap.openBox('INBOX', true, (err, box) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        const f = imap.fetch([emailId], {
          bodies: ['HEADER', 'TEXT'],
          struct: true
        });

        let buffer = '';

        f.on('message', (msg) => {
          msg.on('body', (stream) => {
            stream.on('data', (chunk) => {
              buffer += chunk.toString('utf8');
            });
          });

          msg.once('end', async () => {
            try {
              const parsed = await simpleParser(buffer);
              const extractedContacts = extractContactsFromEmail(parsed);

              imap.end();
              res.json({
                contacts: extractedContacts,
                sender: {
                  email: parsed.from?.value?.[0]?.address || '',
                  name: parsed.from?.value?.[0]?.name || ''
                },
                subject: parsed.subject || '',
                date: parsed.date || new Date()
              });
            } catch (e) {
              imap.end();
              res.status(500).json({ error: 'Erreur lors du parsing: ' + e.message });
            }
          });
        });

        f.once('error', (err) => {
          imap.end();
          res.status(500).json({ error: err.message });
        });
      });
    });

    imap.once('error', (err) => {
      res.status(500).json({ error: err.message });
    });

    imap.connect();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fonction d'extraction de contacts depuis le contenu de l'email
function extractContactsFromEmail(parsed) {
  const contacts = [];
  const text = parsed.text || '';
  const html = parsed.html || '';
  const combinedText = text + ' ' + html;

  // Regex pour emails
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
  const emails = [...new Set(combinedText.match(emailRegex) || [])];

  // Regex pour téléphones (formats français et internationaux)
  const phoneRegex = /(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}/g;
  const phones = [...new Set(combinedText.match(phoneRegex) || [])];

  // Pour chaque email trouvé, essayer d'extraire le nom associé
  emails.forEach((email, index) => {
    // Chercher un nom avant l'email (format: "John Doe <john@example.com>")
    const nameMatch = combinedText.match(new RegExp(`([A-Z][a-z]+\\s+[A-Z][a-z]+)\\s*<?${email.replace('.', '\\.')}>?`));

    contacts.push({
      email: email,
      name: nameMatch?.[1] || email.split('@')[0],
      phone: phones[index] || '',
      company: extractCompanyFromEmail(email, combinedText)
    });
  });

  return contacts;
}

// Fonction pour extraire le nom de l'entreprise
function extractCompanyFromEmail(email, text) {
  // Essayer d'extraire depuis le domaine
  const domain = email.split('@')[1];
  if (domain && !['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com'].includes(domain)) {
    return domain.split('.')[0];
  }

  // Chercher des patterns comme "Entreprise SARL", "Company Inc"
  const companyRegex = /(?:from|de|chez)\s+([A-Z][a-zA-Z\s&]+(?:SARL|SAS|Inc|Ltd|LLC|GmbH))/i;
  const match = text.match(companyRegex);

  return match?.[1]?.trim() || '';
}

module.exports = router;
