'use client';

import { useState } from 'react';

const assignedLocation = {
  latitude: 12.8463043, 
  longitude: 77.6650548, 
  tolerance: 0.0001, 
};

export default function AttendanceButton() {
  const [status, setStatus] = useState('');

  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log("Latitude:", position.coords.latitude);
      console.log("Longitude:", position.coords.longitude);
    },
    (error) => {
      console.error("Error getting location:", error.message);
    },
    { enableHighAccuracy: true }
  );
  

  const markAttendance = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const distance = Math.sqrt(
          Math.pow(latitude - assignedLocation.latitude, 2) +
          Math.pow(longitude - assignedLocation.longitude, 2)
        );

        if (distance > assignedLocation.tolerance) {
          setStatus('Error: You are not at the assigned location.');
          return;
        }

        const response = await fetch('/api/markAttendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'John Doe', latitude, longitude }),
        });

        const data = await response.json();
        setStatus(data.message);
      },
      () => setStatus('Unable to retrieve location.')
    );
  };

  return (
    <div>
      <button onClick={markAttendance} className="px-4 py-2 bg-blue-600 text-white rounded">
        Mark Attendance
      </button>
      {status && <p className="mt-2 text-red-500">{status}</p>}
    </div>
  );
}
