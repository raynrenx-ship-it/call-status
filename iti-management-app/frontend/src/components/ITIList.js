import React, { useState } from 'react';
import ITICard from './ITICard';
import './ITIList.css';

function ITIList({ itis, onStatusUpdate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [district, setDistrict] = useState('all');
  const [status, setStatus] = useState('all');

  const filteredItis = itis.filter((iti) => {
    const matchesSearch = 
      iti.iti_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iti.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iti.contact_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || 
      iti.connected_status === filterStatus;

    const matchesDistrict =
      district === 'all' ||
      iti.district === district;

    const hasPhoneNumber = () => {
  if (status === 'all') {
    return true; // Show all phone numbers regardless of length
  } else if (status === 'valid') {
    return iti.contact_phone?.length === 10; // Only valid phone numbers (length = 10)
  } else if (status === 'invalid') {
    return iti.contact_phone?.length !== 10; // Only invalid phone numbers (length != 10)
  }
  return false; // Default case if none of the conditions match
};

    return matchesSearch && matchesStatus && matchesDistrict && hasPhoneNumber();
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

        <div className='filter-box'>
          <select
          value ={district}
          onChange={(e) => setDistrict(e.target.value)}
          >
            <option value="all">All Districts</option>
            {[...new Set(itis.map(i => i.district).filter(d => d))].map((dist) => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>

        <div className='filter-box'>
          <select
          value ={status}
          onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All Contact</option>
            <option value="valid">Valid Contact</option>
            <option value="invalid">Invalid Contact</option>

          </select>
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
            <option value="rejected">Rejected</option>
            <option value="lead">Lead</option>
          </select>
        </div>

      </div>

      <div className="stats">
        <div className="stat-card">
          <span className="stat-label">Total ITIs</span>
          <span className="stat-value">{filteredItis.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Connected</span>
          <span className="stat-value">{filteredItis.filter(i => i.connected_status === 'connected').length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Not Connected</span>
          <span className="stat-value">{filteredItis.filter(i => i.connected_status === 'not_connected').length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{filteredItis.filter(i => i.connected_status === 'pending').length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Lead</span>
          <span className="stat-value">{filteredItis.filter(i => i.connected_status === 'lead').length}</span>
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
          <div className="no-results">No data found</div>
        )}
      </div>
    </div>
  );
}

export default ITIList;
