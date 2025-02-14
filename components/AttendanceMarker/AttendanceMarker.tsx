'use client';

import { useState } from 'react';

export default function AttendanceButton() {
  const [status, setStatus] = useState('');

  const markAttendance = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`);
        setStatus(`Current location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      },
      (error) => {
        setStatus('Unable to retrieve location: ' + error.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div>
      <button
        onClick={markAttendance}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Mark Attendance
      </button>
      {status && <p className="mt-2 text-red-500">{status}</p>}
    </div>
  );
}
