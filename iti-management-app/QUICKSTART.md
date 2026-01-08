# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

**Open 2 terminals in VS Code**

**Terminal 1 - Backend:**
```bash
cd /workspaces/codespaces-blank/iti-management-app/backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd /workspaces/codespaces-blank/iti-management-app/frontend
npm install
```

### Step 2: Start the Backend

In **Terminal 1**, run:
```bash
npm start
```
✅ You should see: `Server running at http://localhost:5000`

### Step 3: Start the Frontend

In **Terminal 2**, run:
```bash
npm start
```
✅ The app will open at http://localhost:3000

### Step 4: Import Your Data

1. Click the **"📥 Import Data from JSON"** button
2. The system will load all ITIs from your data.json file
3. You'll see a success message

### Step 5: Start Managing ITIs!

- **Search** - Find ITIs by name, address, or email
- **Filter** - View by connection status
- **Expand Card** - Click ▶ to expand and edit
- **Update Status** - Mark as Connected/Pending/Not Connected
- **Add Remarks** - Write notes about your interaction
- **Contact** - Click phone/email to call or send email
- **Save** - Click "Save Changes" to update

## 📊 Features Overview

| Feature | Description |
|---------|-------------|
| 🔍 Search | Find ITIs instantly |
| 🏷️ Filter | Filter by status |
| 📊 Stats | See quick statistics |
| 📞 Phone Contact | Click to call |
| 📧 Email Contact | Click to email |
| ✅ Status Toggle | Track connection status |
| 📝 Remarks | Add detailed notes |
| 💾 Auto Save | Changes saved to database |

## 🎨 Application Layout

```
┌─────────────────────────────────────────────┐
│     ITI Management System (Header)          │
├─────────────────────────────────────────────┤
│ [Import Button] [Search Box] [Filter]       │
├─────────────────────────────────────────────┤
│  📊 Stats: Total | Connected | Not Connected│
├─────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐         │
│  │  ITI Card 1  │  │  ITI Card 2  │  ...    │
│  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐         │
│  │  ITI Card 3  │  │  ITI Card 4  │  ...    │
│  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────┘
```

## 📱 What Happens When You Click...

### On Phone Number
Opens your default phone app to call the ITI

### On Email
Opens your default email client to compose message

### On Website Link
Opens the website in a new browser tab

### On Expand Button (▶)
Shows the detailed form to:
- Change connection status
- Add/edit remarks
- Save changes

## 💡 Status Colors

- 🔴 **Not Connected** (Red) - Haven't made contact yet
- 🟡 **Pending** (Orange) - Trying to reach out
- 🟢 **Connected** (Green) - Successfully connected

## 🔧 Troubleshooting

### "Cannot connect to server" error
- [ ] Check if backend is running on Terminal 1
- [ ] Backend should show: `Server running at http://localhost:5000`
- [ ] Wait 5 seconds and refresh the page

### "Import not working"
- [ ] Check that data.json exists in the root folder
- [ ] Check browser console for error messages (F12)
- [ ] Look at backend terminal for error logs

### Changes not saving
- [ ] Make sure "Save Changes" button was clicked
- [ ] Check if backend is still running
- [ ] Try refreshing the page to see saved data

## 📁 File Locations

```
/workspaces/codespaces-blank/
├── data.json                    ← Your ITI data
└── iti-management-app/
    ├── backend/
    │   ├── server.js            ← API server
    │   ├── package.json         ← Dependencies
    │   └── iti_database.db      ← Database (created automatically)
    └── frontend/
        ├── src/
        │   ├── App.js           ← Main app
        │   └── components/      ← UI components
        ├── package.json         ← Dependencies
        └── public/index.html    ← HTML template
```

## 🆘 Need Help?

Check the main [README.md](./README.md) for:
- API endpoint documentation
- Database schema details
- Advanced features
- Future enhancement ideas

---

**Happy ITI Managing! 🎓**
