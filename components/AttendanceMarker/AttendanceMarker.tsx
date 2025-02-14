'use client';

import { useState } from 'react';

export default function AttendanceButton() {
  const [status, setStatus] = useState('');

  const markAttendance = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser.');
      return;
    }
  
    setStatus('Getting your location...');
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(`/api/classLocation?latitude=${latitude}&longitude=${longitude}`);
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
        }
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
