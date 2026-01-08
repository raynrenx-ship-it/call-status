# Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User's Browser                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              React Frontend (Port 3000)                  │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  App.js (Main Component)                         │   │   │
│  │  │  - Manages global state                          │   │   │
│  │  │  - API integration                               │   │   │
│  │  │  - Data fetching                                 │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  Components                                      │   │   │
│  │  │  ├─ ITIList.js (Search & Filter)                │   │   │
│  │  │  │   ├─ Search functionality                     │   │   │
│  │  │  │   ├─ Status filtering                         │   │   │
│  │  │  │   └─ Stats display                            │   │   │
│  │  │  │                                                │   │   │
│  │  │  ├─ ITICard.js (Individual Card)                 │   │   │
│  │  │  │   ├─ Display ITI info                         │   │   │
│  │  │  │   ├─ Expand/collapse                          │   │   │
│  │  │  │   ├─ Status toggle                            │   │   │
│  │  │  │   ├─ Remarks field                            │   │   │
│  │  │  │   └─ Save functionality                        │   │   │
│  │  │  │                                                │   │   │
│  │  │  └─ ImportButton.js (Data Import)                │   │   │
│  │  │      └─ Trigger import API call                  │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/JSON (Axios)
                            │
┌─────────────────────────────────────────────────────────────────┐
│                  Network Layer (REST API)                        │
│                    Port 5000 (Local)                             │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │
┌─────────────────────────────────────────────────────────────────┐
│              Express.js Backend Server                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  server.js (Main Routes)                               │   │
│  │                                                          │   │
│  │  GET    /api/itis         ──► Fetch all ITIs           │   │
│  │  GET    /api/itis/:id     ──► Fetch single ITI         │   │
│  │  POST   /api/itis         ──► Create new ITI           │   │
│  │  PUT    /api/itis/:id     ──► Update ITI              │   │
│  │  DELETE /api/itis/:id     ──► Delete ITI              │   │
│  │  POST   /api/import       ──► Import from JSON        │   │
│  │  GET    /api/health       ──► Health check            │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ SQL Queries
                            │
┌─────────────────────────────────────────────────────────────────┐
│              SQLite3 Database                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  itis table                                              │   │
│  │  ├─ id (Primary Key)                                    │   │
│  │  ├─ iti_name                                            │   │
│  │  ├─ website_url                                         │   │
│  │  ├─ address                                             │   │
│  │  ├─ contact_phone                                       │   │
│  │  ├─ contact_email                                       │   │
│  │  ├─ connected_status                                    │   │
│  │  ├─ remarks                                             │   │
│  │  ├─ created_at                                          │   │
│  │  └─ updated_at                                          │   │
│  │                                                          │   │
│  │  📄 iti_database.db (File on disk)                     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Import Data Flow
```
User clicks "Import Data" button
        │
        ▼
ImportButton.js triggers onClick handler
        │
        ▼
Axios POST request to /api/import
        │
        ▼
Backend reads data.json file
        │
        ▼
Parse JSON array of ITI objects
        │
        ▼
Loop through each ITI record
        │
        ▼
INSERT INTO database (if not duplicate)
        │
        ▼
Return count of imported records
        │
        ▼
Frontend shows success message
        │
        ▼
Call fetchItis() to reload data
        │
        ▼
Update state with new ITIs
        │
        ▼
Re-render ITIList with all cards
```

### Update Status Flow
```
User expands ITI card
        │
        ▼
ITICard component shows form
        │
        ▼
User selects status & adds remarks
        │
        ▼
User clicks "Save Changes"
        │
        ▼
handleStatusUpdate() function called
        │
        ▼
Axios PUT request to /api/itis/:id
        │
        ▼
Backend validates request
        │
        ▼
UPDATE itis SET connected_status, remarks
        │
        ▼
Database updates record with timestamp
        │
        ▼
Return success response
        │
        ▼
Frontend shows success message
        │
        ▼
fetchItis() reloads all data
        │
        ▼
ITICard updates with new data
        │
        ▼
Status badge color changes
```

### Search & Filter Flow
```
User types in search box
        │
        ▼
ITIList component detects input change
        │
        ▼
setSearchTerm(value) updates state
        │
        ▼
Component re-renders
        │
        ▼
filteredItis array computed
        │
        ▼
Filter by: name, address, email (includes searchTerm)
        │
        ▼
Filter by: selected status (if not 'all')
        │
        ▼
Map filtered array to ITICard components
        │
        ▼
UI updates in real-time
        │
        ▼
User sees filtered results
```

## Component Hierarchy

```
<App>
├── Header (ITI Management System title)
│
├── Controls
│   └── <ImportButton>
│       └─ onClick → POST /api/import
│
├── Main Content
│   └── <ITIList>
│       ├── Search Input
│       ├── Status Filter Dropdown
│       ├── Statistics Cards
│       │   ├─ Total Count
│       │   ├─ Connected Count
│       │   └─ Not Connected Count
│       │
│       └── ITI Grid
│           └── <ITICard> (for each ITI)
│               ├── Header
│               │   ├─ ITI Name
│               │   └─ Expand Button
│               │
│               ├── Content
│               │   ├─ Website Link
│               │   ├─ Address
│               │   └─ Contact Buttons
│               │       ├─ Phone Button
│               │       └─ Email Button
│               │
│               ├── Expanded Form (conditional)
│               │   ├─ Status Radio Options
│               │   ├─ Remarks Textarea
│               │   └─ Save Button
│               │
│               └── Footer
│                   ├─ Status Badge
│                   └─ Remarks Preview
```

## State Management Flow

```
App.js (Top-level component)
│
├── State: itis (array of ITI objects)
│   └─ Fetched from GET /api/itis
│   └─ Updated when: import, status change
│
├── State: loading (boolean)
│   └─ true during API calls
│   └─ false when complete
│
├── State: error (string)
│   └─ Contains error message if any
│   └─ cleared on successful fetch
│
└── Methods: 
    ├─ fetchItis() → Fetches all ITIs
    ├─ handleImport() → Triggers data import
    └─ handleStatusUpdate(id, status, remarks) → Updates ITI
        └─ Calls fetchItis() to refresh
```

## Request/Response Examples

### GET /api/itis
```
Request:
GET /api/itis HTTP/1.1

Response (200 OK):
[
  {
    "id": 1,
    "iti_name": "Alrehan Private ITI",
    "website_url": "http://...",
    "address": "Rewa Road, Raipara, Saran",
    "contact_phone": "7903389948",
    "contact_email": "ansh@email.com",
    "connected_status": "not_connected",
    "remarks": null,
    "created_at": "2025-01-08 10:30:00",
    "updated_at": "2025-01-08 10:30:00"
  },
  ...more ITIs...
]
```

### PUT /api/itis/:id
```
Request:
PUT /api/itis/1 HTTP/1.1
Content-Type: application/json

{
  "connected_status": "connected",
  "remarks": "Spoke with director today"
}

Response (200 OK):
{
  "message": "ITI updated successfully"
}
```

### POST /api/import
```
Request:
POST /api/import HTTP/1.1

Response (200 OK):
{
  "message": "Imported 850 ITIs successfully",
  "imported": 850
}
```

## Database Query Examples

### Select all ITIs
```sql
SELECT * FROM itis ORDER BY updated_at DESC;
```

### Find by name
```sql
SELECT * FROM itis WHERE iti_name LIKE '%Alrehan%';
```

### Update status
```sql
UPDATE itis SET 
  connected_status = 'connected',
  remarks = 'Successfully contacted',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 1;
```

### Count by status
```sql
SELECT connected_status, COUNT(*) as count
FROM itis
GROUP BY connected_status;
```

## File Dependencies

```
App.js
├── Imports: ITIList, ImportButton
├── Calls: axios GET /api/itis
├── Calls: axios POST /api/import
└── Calls: axios PUT /api/itis/:id

ITIList.js
├── Imports: ITICard
├── Props: itis, onStatusUpdate
└── State: searchTerm, filterStatus

ITICard.js
├── Props: iti, onStatusUpdate
├── State: isExpanded, remarks, status
├── Calls: onStatusUpdate callback
└── Actions: handlePhoneClick, handleEmailClick

ImportButton.js
├── Props: onImport
├── State: isLoading
└── Calls: onImport callback

server.js
├── Imports: express, cors, sqlite3
├── Routes: 7 REST endpoints
├── Database: SQLite3 connection
└── File: iti_database.db
```

## Scaling Considerations

```
Current Setup:
├── Single SQLite database
├── No authentication
├── No caching
└── Single server instance

For Production Scaling:
├── Replace SQLite with PostgreSQL
├── Add user authentication (JWT)
├── Implement caching (Redis)
├── Use load balancing (Nginx)
├── Add database indexing
├── Implement pagination
├── Add rate limiting
├── Use environment variables
└── Set up CI/CD pipeline
```

---

This architecture provides a solid foundation for the ITI Management application with clear separation of concerns and scalable design!
