const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI environment variable not set');
  process.exit(1);
}

let db;
const mongoOptions = {
  retryWrites: true,
  w: 'majority',
  // Temporarily allow insecure TLS for testing network connectivity
  // Remove this in production or once network access is confirmed
  tls: true,
  tlsInsecure: false
};

const client = new MongoClient(MONGODB_URI, mongoOptions);

async function connectDB() {
  try {
    await client.connect();
    db = client.db();
    console.log('Connected to MongoDB Atlas');
    
    // Ensure collection exists with indexes
    const itisCollection = db.collection('itis');
    await itisCollection.createIndex({ id: 1 }, { unique: true }).catch(() => {});
    
    return true;
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

// Middleware to ensure DB is connected
app.use((req, res, next) => {
  if (!db) {
    return res.status(500).json({ error: 'Database not connected' });
  }
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', db: 'MongoDB Atlas' });
});

// Get all ITIs
app.get('/api/itis', async (req, res) => {
  try {
    const itisCollection = db.collection('itis');
    const itis = await itisCollection.find({}).sort({ id: 1 }).toArray();
    res.json(itis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single ITI by ID
app.get('/api/itis/:id', async (req, res) => {
  try {
    const itisCollection = db.collection('itis');
    const iti = await itisCollection.findOne({ id: parseInt(req.params.id) });
    if (iti) {
      res.json(iti);
    } else {
      res.status(404).json({ error: 'ITI not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new ITI
app.post('/api/itis', async (req, res) => {
  try {
    const { iti_name, website_url, address, contact_phone, contact_email } = req.body;
    const itisCollection = db.collection('itis');
    
    // Get max id
    const last = await itisCollection.findOne({}, { sort: { id: -1 } });
    const newId = (last?.id || 0) + 1;
    
    const newIti = {
      id: newId,
      iti_name,
      website_url: website_url || '',
      address: address || '',
      contact_phone: contact_phone || '',
      contact_email: contact_email || '',
      connected_status: 'not_connected',
      remarks: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const result = await itisCollection.insertOne(newIti);
    res.status(201).json({ id: newId, message: 'ITI created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update ITI status and remarks
app.put('/api/itis/:id', async (req, res) => {
  try {
    const { connected_status, remarks } = req.body;
    const itisCollection = db.collection('itis');
    const id = parseInt(req.params.id);
    
    const updateObj = { updated_at: new Date().toISOString() };
    if (connected_status) updateObj.connected_status = connected_status;
    if (remarks !== undefined) updateObj.remarks = remarks;
    
    const result = await itisCollection.updateOne(
      { id },
      { $set: updateObj }
    );
    
    if (result.matchedCount > 0) {
      res.json({ message: 'ITI updated successfully' });
    } else {
      res.status(404).json({ error: 'ITI not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete ITI
app.delete('/api/itis/:id', async (req, res) => {
  try {
    const itisCollection = db.collection('itis');
    const id = parseInt(req.params.id);
    
    const result = await itisCollection.deleteOne({ id });
    
    if (result.deletedCount > 0) {
      res.json({ message: 'ITI deleted successfully' });
    } else {
      res.status(404).json({ error: 'ITI not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Import data from data.json
app.post('/api/import', async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const dataPath = path.join(__dirname, '../data.json');
    
    if (!fs.existsSync(dataPath)) {
      return res.status(400).json({ error: 'data.json not found' });
    }
    
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);
    
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: 'data.json must contain an array' });
    }
    
    const itisCollection = db.collection('itis');
    let imported = 0;
    let skipped = 0;
    
    // Get max existing id
    const last = await itisCollection.findOne({}, { sort: { id: -1 } });
    let nextId = (last?.id || 0) + 1;
    
    for (const iti of data) {
      const iti_name = iti['ITI Name'] || '';
      if (!iti_name) continue;
      
      // Check if exists
      const exists = await itisCollection.findOne({ iti_name });
      if (exists) {
        skipped++;
        continue;
      }
      
      const newIti = {
        id: nextId,
        iti_name,
        website_url: iti['Website URL'] || '',
        address: iti['Address'] || '',
        contact_phone: iti['Contact Phone Number'] || '',
        contact_email: iti['Contact Email'] || '',
        connected_status: 'not_connected',
        remarks: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      await itisCollection.insertOne(newIti);
      imported++;
      nextId++;
    }
    
    res.json({ 
      message: `Imported ${imported} ITIs (${skipped} skipped)`, 
      imported, 
      skipped 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload endpoint - accept JSON body with data array
app.post('/api/upload', async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Request body must contain "data" array' });
    }
    
    const itisCollection = db.collection('itis');
    let imported = 0;
    let skipped = 0;
    
    const last = await itisCollection.findOne({}, { sort: { id: -1 } });
    let nextId = (last?.id || 0) + 1;
    
    for (const iti of data) {
      const iti_name = iti['ITI Name'] || iti.iti_name || '';
      if (!iti_name) continue;
      
      const exists = await itisCollection.findOne({ iti_name });
      if (exists) {
        skipped++;
        continue;
      }
      
      const newIti = {
        id: nextId,
        iti_name,
        website_url: iti['Website URL'] || iti.website_url || '',
        address: iti['Address'] || iti.address || '',
        contact_phone: iti['Contact Phone Number'] || iti.contact_phone || '',
        contact_email: iti['Contact Email'] || iti.contact_email || '',
        connected_status: 'not_connected',
        remarks: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      await itisCollection.insertOne(newIti);
      imported++;
      nextId++;
    }
    
    res.json({ 
      message: `Uploaded ${imported} ITIs (${skipped} skipped)`, 
      imported, 
      skipped 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
async function start() {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down...');
  await client.close();
  process.exit(0);
});
