import React, { useRef } from 'react';
import axios from 'axios';
import './UploadButton.css';

const API_URL = process.env.REACT_APP_API_URL || '/api';

function UploadButton({ onUploadSuccess }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Create FormData and append file
      const formData = new FormData();
      formData.append('file', file);

      // Upload file to backend (multipart/form-data)
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
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
