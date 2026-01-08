import fs from 'fs';
import path from 'path';

// Very small import handler that mirrors logic in itis.js
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const dataPath = path.join(process.cwd(), 'data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);

    // Write to data_loaded.json so api/itis will load it on next invocation
    const loadPath = path.join(process.cwd(), 'data_loaded.json');
    fs.writeFileSync(loadPath, JSON.stringify(data, null, 2), 'utf8');

    const imported = data.length;
    res.status(200).json({ message: `Imported ${imported} ITIs successfully`, imported });
  } catch (err) {
    console.error('Import error:', err);
    res.status(500).json({ error: err.message });
  }
}
