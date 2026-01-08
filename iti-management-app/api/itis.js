// Vercel Serverless Function for ITI Management API
// This replaces the Express backend

import fs from 'fs';
import path from 'path';

// Simple in-memory store for demo (use a database in production)
let itisData = [];
let initialized = false;

// Initialize with data.json on first load
function initializeData() {
  if (initialized) return;
  try {
    const dataPath = path.join(process.cwd(), 'data.json');
    if (fs.existsSync(dataPath)) {
      const rawData = fs.readFileSync(dataPath, 'utf8');
      const data = JSON.parse(rawData);
      itisData = data.map((iti, idx) => ({
        id: idx + 1,
        iti_name: iti['ITI Name'] || '',
        website_url: iti['Website URL'] || '',
        address: iti['Address'] || '',
        contact_phone: iti['Contact Phone Number'] || '',
        contact_email: iti['Contact Email'] || '',
        connected_status: 'not_connected',
        remarks: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      initialized = true;
    }
  } catch (err) {
    console.error('Error initializing data:', err);
  }
}

// Enable CORS
function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version'
  );
}

export default function handler(req, res) {
  setCORSHeaders(res);

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  initializeData();

  const { method, query, body } = req;

  // GET /api/itis - Get all ITIs
  if (method === 'GET' && !query.id) {
    res.status(200).json(itisData);
    return;
  }

  // GET /api/itis?id=1 - Get single ITI
  if (method === 'GET' && query.id) {
    const iti = itisData.find(i => i.id === parseInt(query.id));
    if (iti) {
      res.status(200).json(iti);
    } else {
      res.status(404).json({ error: 'ITI not found' });
    }
    return;
  }

  // POST /api/itis - Create new ITI
  if (method === 'POST' && !query.action) {
    const { iti_name, website_url, address, contact_phone, contact_email } = body;
    const newId = Math.max(...itisData.map(i => i.id), 0) + 1;
    const newIti = {
      id: newId,
      iti_name,
      website_url,
      address,
      contact_phone,
      contact_email,
      connected_status: 'not_connected',
      remarks: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    itisData.push(newIti);
    res.status(201).json({ id: newId, message: 'ITI created successfully' });
    return;
  }

  // POST /api/itis?action=import - Import from JSON
  if (method === 'POST' && query.action === 'import') {
    try {
      const dataPath = path.join(process.cwd(), 'data.json');
      const rawData = fs.readFileSync(dataPath, 'utf8');
      const data = JSON.parse(rawData);
      
      let imported = 0;
      data.forEach((iti) => {
        const exists = itisData.some(i => i.iti_name === (iti['ITI Name'] || ''));
        if (!exists) {
          const newId = Math.max(...itisData.map(i => i.id), 0) + 1;
          itisData.push({
            id: newId,
            iti_name: iti['ITI Name'] || '',
            website_url: iti['Website URL'] || '',
            address: iti['Address'] || '',
            contact_phone: iti['Contact Phone Number'] || '',
            contact_email: iti['Contact Email'] || '',
            connected_status: 'not_connected',
            remarks: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          imported++;
        }
      });
      
      res.status(200).json({ 
        message: `Imported ${imported} ITIs successfully`,
        imported: imported 
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  // PUT /api/itis?id=1 - Update ITI status and remarks
  if (method === 'PUT' && query.id) {
    const { connected_status, remarks } = body;
    const iti = itisData.find(i => i.id === parseInt(query.id));
    if (iti) {
      iti.connected_status = connected_status || iti.connected_status;
      iti.remarks = remarks !== undefined ? remarks : iti.remarks;
      iti.updated_at = new Date().toISOString();
      res.status(200).json({ message: 'ITI updated successfully' });
    } else {
      res.status(404).json({ error: 'ITI not found' });
    }
    return;
  }

  // DELETE /api/itis?id=1 - Delete ITI
  if (method === 'DELETE' && query.id) {
    const index = itisData.findIndex(i => i.id === parseInt(query.id));
    if (index > -1) {
      itisData.splice(index, 1);
      res.status(200).json({ message: 'ITI deleted successfully' });
    } else {
      res.status(404).json({ error: 'ITI not found' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
