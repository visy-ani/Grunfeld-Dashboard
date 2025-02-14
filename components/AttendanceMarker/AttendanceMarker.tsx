'use client';

import { useState } from 'react';

export default function AttendanceButton() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const collectLocationSamples = async (numSamples = 3) => {
    const locations: { latitude: number; longitude: number }[] = [];

    for (let i = 0; i < numSamples; i++) {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const { latitude, longitude } = position.coords;
      locations.push({ latitude, longitude });

      // Small delay between readings to reduce fluctuations
      await new Promise((res) => setTimeout(res, 1000));
    }

    return locations;
  };

  const markAttendance = async () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser.');
      return;
    }

    setStatus('Getting your location...');
    setLoading(true);

    try {
      const locations = await collectLocationSamples(3);

      const response = await fetch(`/api/classLocation?locations=${encodeURIComponent(JSON.stringify(locations))}`);
      const data = await response.json();

      if (data.success) {
        if (data.data.isWithinRange) {
          setStatus(`✅ Attendance marked! ${data.data.distanceMessage}`);
        } else {
          setStatus(`❌ You're too far from class. ${data.data.distanceMessage}`);
        }
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setStatus(`Failed to verify location: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={markAttendance}
        disabled={loading}
        className={`px-4 py-2 rounded ${loading ? 'bg-gray-400' : 'bg-blue-600 text-white'}`}
      >
        {loading ? 'Checking...' : 'Mark Attendance'}
      </button>
      {status && <p className="mt-2 text-red-500">{status}</p>}
    </div>
  );
}
