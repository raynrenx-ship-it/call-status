const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const dbPath = path.join(__dirname, 'iti_database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error(err.message);
  else console.log('Connected to SQLite database');
});

// Initialize database
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS itis (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      iti_name TEXT NOT NULL,
      website_url TEXT,
      address TEXT,
      contact_phone TEXT,
      contact_email TEXT,
      connected_status TEXT DEFAULT 'not_connected',
      remarks TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Routes

// Get all ITIs
app.get('/api/itis', (req, res) => {
  db.all('SELECT * FROM itis ORDER BY updated_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single ITI
app.get('/api/itis/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM itis WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// Create ITI
app.post('/api/itis', (req, res) => {
  const { iti_name, website_url, address, contact_phone, contact_email } = req.body;
  
  db.run(
    `INSERT INTO itis (iti_name, website_url, address, contact_phone, contact_email)
     VALUES (?, ?, ?, ?, ?)`,
    [iti_name, website_url, address, contact_phone, contact_email],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'ITI created successfully' });
    }
  );
});

// Update ITI status and remarks
app.put('/api/itis/:id', (req, res) => {
  const { id } = req.params;
  const { connected_status, remarks } = req.body;
  
  db.run(
    `UPDATE itis SET connected_status = ?, remarks = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [connected_status, remarks, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'ITI updated successfully' });
    }
  );
});

// Delete ITI
app.delete('/api/itis/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM itis WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'ITI deleted successfully' });
  });
});

// Import data from JSON
app.post('/api/import', (req, res) => {
  try {
    const dataPath = path.join(__dirname, '../data.json');
    const rawData = fs.readFileSync(dataPath);
    const data = JSON.parse(rawData);

    let imported = 0;
    data.forEach((iti) => {
      db.run(
        `INSERT OR IGNORE INTO itis (iti_name, website_url, address, contact_phone, contact_email)
         VALUES (?, ?, ?, ?, ?)`,
        [
          iti['ITI Name'] || '',
          iti['Website URL'] || '',
          iti['Address'] || '',
          iti['Contact Phone Number'] || '',
          iti['Contact Email'] || ''
        ],
        (err) => {
          if (!err) imported++;
        }
      );
    });

    setTimeout(() => {
      res.json({ 
        message: `Imported ${imported} ITIs successfully`,
        imported: imported 
      });
    }, 1000);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
