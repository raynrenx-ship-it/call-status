import React, { useState } from 'react';
import './ImportButton.css';

function ImportButton({ onImport }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onImport();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      className="import-btn"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? '⏳ Importing...' : '📥 Import Data from JSON'}
    </button>
  );
}

export default ImportButton;
