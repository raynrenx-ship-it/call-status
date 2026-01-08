# ITI Management Application

A full-stack web application for managing ITI (Industrial Training Institute) contacts with connection tracking and remarks management.

## Features

✅ **View ITI List** - Display all ITIs with their details (name, address, phone, email)
✅ **Import Data** - Import ITI data from JSON file
✅ **Contact Management** - Click to call or email ITI contacts directly
✅ **Connection Tracking** - Mark ITIs as Connected, Pending, or Not Connected
✅ **Remarks Field** - Add and update remarks for each ITI
✅ **Search & Filter** - Search by name/address/email and filter by status
✅ **Statistics** - View quick stats on total, connected, and unconnected ITIs
✅ **Responsive Design** - Works on desktop, tablet, and mobile devices

## Tech Stack

**Backend:**
- Node.js & Express
- SQLite3 Database
- CORS enabled for frontend communication

**Frontend:**
- React 18
- Axios for API calls
- Modern CSS with gradients and animations

## Project Structure

```
iti-management-app/
├── backend/
│   ├── server.js          # Express server with API routes
│   ├── package.json       # Backend dependencies
│   └── iti_database.db    # SQLite database (created on first run)
├── frontend/
│   ├── src/
│   │   ├── App.js         # Main React app
│   │   ├── components/
│   │   │   ├── ITIList.js      # ITI list view with filters
│   │   │   ├── ITICard.js      # Individual ITI card component
│   │   │   └── ImportButton.js # Import data button
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   ├── public/
│   │   └── index.html     # HTML template
│   └── package.json       # Frontend dependencies
├── data.json              # Your ITI data file
└── README.md             # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Step 1: Install Backend Dependencies

```bash
cd iti-management-app/backend
npm install
```

### Step 2: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Running the Application

### Option 1: Run in Separate Terminals

**Terminal 1 - Start Backend Server:**
```bash
cd iti-management-app/backend
npm start
# Server runs at http://localhost:5000
```

**Terminal 2 - Start Frontend App:**
```bash
cd iti-management-app/frontend
npm start
# App opens at http://localhost:3000
```

### Option 2: Using concurrently (Optional)

Install concurrently:
```bash
npm install -g concurrently
```

From the root directory:
```bash
concurrently "cd backend && npm start" "cd frontend && npm start"
```

## API Endpoints

### Get all ITIs
```
GET /api/itis
```

### Get single ITI
```
GET /api/itis/:id
```

### Create ITI
```
POST /api/itis
Body: {
  "iti_name": "string",
  "website_url": "string",
  "address": "string",
  "contact_phone": "string",
  "contact_email": "string"
}
```

### Update ITI Status & Remarks
```
PUT /api/itis/:id
Body: {
  "connected_status": "not_connected|pending|connected",
  "remarks": "string"
}
```

### Delete ITI
```
DELETE /api/itis/:id
```

### Import Data from JSON
```
POST /api/import
```

### Health Check
```
GET /api/health
```

## Database Schema

### itis table
```sql
CREATE TABLE itis (
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
```

## Usage Guide

1. **Start the application** (both backend and frontend)
2. **Import Data** - Click "Import Data from JSON" button to load ITI data
3. **Search** - Use the search box to find ITIs by name, address, or email
4. **Filter** - Filter by connection status (All, Connected, Not Connected, Pending)
5. **Update Status** - Expand a card, select connection status, add remarks, and save
6. **Contact** - Click phone/email buttons to call or email directly

## Key Features

### Connection Status Toggle
- **Not Connected** ❌: Initial state, no contact established
- **Pending** ⏳: Contact attempt in progress
- **Connected** ✅: Successfully contacted and connected

### Remarks
- Add detailed notes about your interactions
- Remarks are saved with the ITI record
- Visible in the card footer preview

### Smart Filtering
- Real-time search across multiple fields
- Status-based filtering
- View statistics at a glance

## Troubleshooting

**Backend not starting?**
- Make sure port 5000 is available
- Check if SQLite3 is properly installed: `npm list sqlite3`

**Frontend can't connect to backend?**
- Verify backend is running on http://localhost:5000
- Check browser console for errors
- Ensure CORS is enabled (it is in the current setup)

**Import not working?**
- Make sure data.json is in the root directory of the app
- Check that the JSON format matches the expected structure
- Look at browser console and server logs for errors

## Future Enhancements

- [ ] User authentication & login
- [ ] Call/Email history tracking
- [ ] Export data to CSV/Excel
- [ ] Bulk operations (import, delete, status update)
- [ ] Contact templates for automated messages
- [ ] Analytics dashboard with charts
- [ ] Real-time notifications
- [ ] Mobile app version

## License

MIT

## Support

For issues or feature requests, please create an issue in the repository.
