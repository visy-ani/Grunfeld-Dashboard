'use client';

import { useState } from 'react';

export default function AdminPanel() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const updateLocation = async () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setStatus('Getting location...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch('/api/classLocation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              latitude,
              longitude,
              toleranceMeters: 10
            }),
          });

          const data = await response.json();

          if (data.success) {
            setStatus(`Location updated successfully! Current location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          } else {
            setStatus(`Failed to update location: ${data.error}`);
          }
        } catch (error) {
          setStatus(`Error updating location: ${error}`);
        }
        
        setLoading(false);
      },
      (error) => {
        setStatus('Unable to retrieve location: ' + error.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <div className="space-x-4">
        <button 
          onClick={updateLocation}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Location'}
        </button>
      </div>
      {status && (
        <p className="mt-4 p-4">
          {status}
        </p>
      )}
    </div>
  );
}