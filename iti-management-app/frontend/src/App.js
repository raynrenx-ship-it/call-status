import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ITIList from './components/ITIList';
import ImportButton from './components/ImportButton';

// Use environment variable for API URL if available, otherwise use relative path for proxy
const API_URL = process.env.REACT_APP_API_URL || '/api';

function App() {
  const [itis, setItis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItis = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/itis`);
      setItis(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch ITIs');
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItis();
  }, []);

  const handleImport = async () => {
    try {
      const response = await axios.post(`${API_URL}/import`);
      alert(response.data.message);
      fetchItis();
    } catch (err) {
      alert('Failed to import data');
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id, status, remarks) => {
    try {
      await axios.put(`${API_URL}/itis/${id}`, {
        connected_status: status,
        remarks: remarks
      });
      fetchItis();
    } catch (err) {
      alert('Failed to update ITI');
      console.error(err);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>ITI Management System</h1>
        <p>Manage and track ITI contacts and connection status</p>
      </header>

      <main className="app-main">
        <div className="controls">
          <ImportButton onImport={handleImport} />
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading ITIs...</div>
        ) : (
          <ITIList 
            itis={itis} 
            onStatusUpdate={handleStatusUpdate}
          />
        )}
      </main>
    </div>
  );
}

export default App;
