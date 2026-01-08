import React, { useState } from 'react';
import './ITICard.css';

function ITICard({ iti, onStatusUpdate }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [remarks, setRemarks] = useState(iti.remarks || '');
  const [status, setStatus] = useState(iti.connected_status || 'not_connected');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onStatusUpdate(iti.id, status, remarks);
    setIsSaving(false);
  };

  const handlePhoneClick = () => {
    if (iti.contact_phone) {
      window.location.href = `tel:${iti.contact_phone}`;
    }
  };

  const handleEmailClick = () => {
    if (iti.contact_email) {
      window.location.href = `mailto:${iti.contact_email}`;
    }
  };

  return (
    <div className={`iti-card ${status}`}>
      <div className="card-header">
        <h3>{iti.iti_name}</h3>
        <button 
          className="expand-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      <div className="card-content">
        <div className="info-item">
          <label>Website:</label>
          <span>
            {iti.website_url && iti.website_url !== 'http://' && iti.website_url !== 'http://Not Set' ? (
              <a href={iti.website_url} target="_blank" rel="noopener noreferrer">
                {iti.website_url}
              </a>
            ) : (
              'N/A'
            )}
          </span>
        </div>

        <div className="info-item">
          <label>Address:</label>
          <span>{iti.address || 'N/A'}</span>
        </div>

        <div className="contact-buttons">
          <button 
            className="contact-btn phone-btn"
            onClick={handlePhoneClick}
            disabled={!iti.contact_phone}
          >
            📞 {iti.contact_phone || 'No Phone'}
          </button>
          <button 
            className="contact-btn email-btn"
            onClick={handleEmailClick}
            disabled={!iti.contact_email}
          >
            ✉️ {iti.contact_email ? iti.contact_email.substring(0, 20) + '...' : 'No Email'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="card-expanded">
          <div className="form-group">
            <label>Connection Status:</label>
            <div className="status-options">
              <label className="radio-label">
                <input
                  type="radio"
                  name={`status-${iti.id}`}
                  value="not_connected"
                  checked={status === 'not_connected'}
                  onChange={(e) => setStatus(e.target.value)}
                />
                Not Connected
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name={`status-${iti.id}`}
                  value="pending"
                  checked={status === 'pending'}
                  onChange={(e) => setStatus(e.target.value)}
                />
                Pending
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name={`status-${iti.id}`}
                  value="connected"
                  checked={status === 'connected'}
                  onChange={(e) => setStatus(e.target.value)}
                />
                Connected
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Remarks:</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add your remarks here..."
              rows="4"
            />
          </div>

          <button 
            className="save-btn"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      <div className="card-footer">
        <span className={`status-badge ${status}`}>
          {status === 'not_connected' && '❌ Not Connected'}
          {status === 'pending' && '⏳ Pending'}
          {status === 'connected' && '✅ Connected'}
        </span>
        {iti.remarks && (
          <span className="remarks-preview">
            📝 {iti.remarks.substring(0, 20)}...
          </span>
        )}
      </div>
    </div>
  );
}

export default ITICard;
