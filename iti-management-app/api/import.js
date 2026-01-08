// Vercel Serverless Function for ITI Import
// Reads data.json and stores in MongoDB

import fs from 'fs';
import path from 'path';
import { connectToDatabase } from './_db.js';

function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version'
  );
}

export default async function handler(req, res) {
  setCORSHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { db } = await connectToDatabase();
    const itisCollection = db.collection('itis');

    // Read data.json
    const dataPath = path.join(process.cwd(), 'data.json');
    if (!fs.existsSync(dataPath)) {
      return res.status(400).json({ error: 'data.json file not found' });
    }

    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    if (!Array.isArray(data)) {
      return res.status(400).json({ error: 'data.json must contain an array' });
    }

    let imported = 0;
    let skipped = 0;

    // Get max existing id
    const lastIti = await itisCollection.findOne({}, { sort: { id: -1 } });
    let nextId = (lastIti?.id || 0) + 1;

    for (const iti of data) {
      const iti_name = iti['ITI Name'] || '';
      
      // Check if already exists
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

    res.status(200).json({
      message: `Imported ${imported} ITIs successfully (${skipped} skipped)`,
      imported,
      skipped
    });
  } catch (err) {
    console.error('Import error:', err);
    res.status(500).json({ error: 'Import failed: ' + err.message });
  }
}
