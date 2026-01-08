import React, { useRef } from 'react';
import axios from 'axios';
import './UploadButton.css';

// Normalize API URL to avoid trailing slash issues
const API_URL = (process.env.REACT_APP_API_URL || '/api').replace(/\/$/, '');

function UploadButton({ onUploadSuccess }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

      try {
        // Read the file as text and send JSON body to server (no file persistence)
        const fileContent = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(e);
          reader.readAsText(file);
        });

        const parsed = JSON.parse(fileContent);

        const response = await axios.post(`${API_URL}/upload`, {
          data: Array.isArray(parsed) ? parsed : [parsed]
        });

      alert(response.data.message);
      if (onUploadSuccess) {
        onUploadSuccess();
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Upload error:', err);
      if (err.response?.data?.error) {
        alert(`Upload failed: ${err.response.data.error}`);
      } else {
        alert('Upload failed: ' + err.message);
      }
    }
  };

  return (
    <div className="upload-button-container">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <button
        className="btn btn-upload"
        onClick={() => fileInputRef.current?.click()}
        title="Upload a data.json file"
      >
        📤 Upload Data
      </button>
    </div>
  );
}

export default UploadButton;
