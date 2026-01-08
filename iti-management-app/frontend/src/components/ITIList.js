import React, { useState } from 'react';
import ITICard from './ITICard';
import './ITIList.css';

function ITIList({ itis, onStatusUpdate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredItis = itis.filter((iti) => {
    const matchesSearch = 
      iti.iti_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iti.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iti.contact_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || 
      iti.connected_status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="iti-list-container">
      <div className="list-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, address, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="not_connected">Not Connected</option>
            <option value="connected">Connected</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="stats">
        <div className="stat-card">
          <span className="stat-label">Total ITIs</span>
          <span className="stat-value">{itis.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Connected</span>
          <span className="stat-value">{itis.filter(i => i.connected_status === 'connected').length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Not Connected</span>
          <span className="stat-value">{itis.filter(i => i.connected_status === 'not_connected').length}</span>
        </div>
      </div>

      <div className="iti-grid">
        {filteredItis.length > 0 ? (
          filteredItis.map((iti) => (
            <ITICard 
              key={iti.id} 
              iti={iti} 
              onStatusUpdate={onStatusUpdate}
            />
          ))
        ) : (
          <div className="no-results">No ITIs found</div>
        )}
      </div>
    </div>
  );
}

export default ITIList;
