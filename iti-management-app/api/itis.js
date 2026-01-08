// Vercel Serverless Function for ITI Management API
// MongoDB-backed CRUD operations

import { connectToDatabase } from './_db.js';

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

export default async function handler(req, res) {
  setCORSHeaders(res);

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { db } = await connectToDatabase();
    const itisCollection = db.collection('itis');

    const { method, query, body } = req;

    // Support path-based id: /api/itis/1 -> extract id
    let pathId = null;
    try {
      const rawPath = req.url || '';
      const pathname = rawPath.split('?')[0];
      const match = pathname.match(/\/api\/itis\/(\d+)/);
      if (match) pathId = match[1];
    } catch (err) {
      // ignore
    }
    if (!query.id && pathId) query.id = pathId;

    // GET /api/itis - Get all ITIs
    if (method === 'GET' && !query.id) {
      const itis = await itisCollection.find({}).toArray();
      res.status(200).json(itis);
      return;
    }

    // GET /api/itis?id=1 - Get single ITI
    if (method === 'GET' && query.id) {
      const iti = await itisCollection.findOne({ id: parseInt(query.id) });
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
      
      // Get max id
      const lastIti = await itisCollection.findOne({}, { sort: { id: -1 } });
      const newId = (lastIti?.id || 0) + 1;

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

      const result = await itisCollection.insertOne(newIti);
      res.status(201).json({ id: newId, message: 'ITI created successfully', insertedId: result.insertedId });
      return;
    }

    // PUT /api/itis?id=1 or /api/itis/1 - Update ITI status and remarks
    if (method === 'PUT' && query.id) {
      try {
        const { connected_status, remarks } = body || {};
        const iti_id = parseInt(query.id);
        
        const updateObj = {};
        if (connected_status) updateObj.connected_status = connected_status;
        if (remarks !== undefined) updateObj.remarks = remarks;
        updateObj.updated_at = new Date().toISOString();

        const result = await itisCollection.updateOne(
          { id: iti_id },
          { $set: updateObj }
        );

        if (result.matchedCount > 0) {
          res.status(200).json({ message: 'ITI updated successfully' });
        } else {
          res.status(404).json({ error: 'ITI not found' });
        }
      } catch (err) {
        console.error('Error updating ITI:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
      return;
    }

    // DELETE /api/itis?id=1 - Delete ITI
    if (method === 'DELETE' && query.id) {
      const result = await itisCollection.deleteOne({ id: parseInt(query.id) });
      if (result.deletedCount > 0) {
        res.status(200).json({ message: 'ITI deleted successfully' });
      } else {
        res.status(404).json({ error: 'ITI not found' });
      }
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
}
