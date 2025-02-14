'use client';

import { useState } from 'react';

export default function AdminPanel() {
  const [status, setStatus] = useState('');

  const updateLocation = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser.');
      return;
    }

    // Fetch the current location of the admin
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setStatus(`Current location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}. Updating...`);
        
        try {
          // Send the updated location to the server
          const response = await fetch('/api/assignedLocation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              latitude,
              longitude,
              tolerance: 1000, // 1 km tolerance
            }),
          });

          const data = await response.json();
          
          if (response.ok) {
            setStatus('Assigned location updated successfully.');
          } else {
            setStatus(`Error updating location: ${data.error || 'Unknown error'}`);
          }
        } catch (error) {
          setStatus(`Error updating location: ${error}`);
        }
      },
      (error) => {
        setStatus(`Error retrieving location: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>You are Admin</h1>
      <button onClick={updateLocation} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
        Update Assigned Location
      </button>
      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </div>
  );
}
