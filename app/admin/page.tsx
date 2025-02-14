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
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`Current location: Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`);
        setStatus(`Current location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}.`);
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
        Get Location
      </button>
      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </div>
  );
}
