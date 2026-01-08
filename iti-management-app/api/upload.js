// Vercel Serverless Function for ITI Upload
// Accepts JSON file upload, reads data, and stores in MongoDB (does not persist file)

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

// Parse multipart form data (simple parser for single file)
async function parseFormData(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    
    req.on('data', (chunk) => {
      data += chunk.toString();
    });

    req.on('end', () => {
      try {
        // Simple extraction of JSON from multipart data
        // Look for the file content between boundaries
        const match = data.match(/Content-Type: application\/json.*?\r?\n\r?\n([\s\S]*?)\r?\n--/);
        if (match && match[1]) {
          resolve(JSON.parse(match[1]));
        } else {
          reject(new Error('Could not parse JSON from multipart data'));
        }
      } catch (err) {
        reject(err);
      }
    });

    req.on('error', reject);
  });
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

    // Parse multipart form data
    let data;
    try {
      data = await parseFormData(req);
    } catch (err) {
      return res.status(400).json({ error: 'Failed to parse uploaded file: ' + err.message });
    }

    // Validate data
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: 'File must contain a JSON array' });
    }

    let imported = 0;
    let skipped = 0;

    // Get max existing id
    const lastIti = await itisCollection.findOne({}, { sort: { id: -1 } });
    let nextId = (lastIti?.id || 0) + 1;

    // Process each record
    for (const iti of data) {
      const iti_name = iti['ITI Name'] || iti.iti_name || '';
      
      if (!iti_name) {
        skipped++;
        continue;
      }

      // Check if already exists
      const exists = await itisCollection.findOne({ iti_name });
      if (exists) {
        skipped++;
        continue;
      }

      // Create new ITI record
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

    // File is automatically cleaned up (not stored anywhere)
    res.status(200).json({
      message: `Uploaded ${imported} ITIs successfully (${skipped} skipped)`,
      imported,
      skipped
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
}
