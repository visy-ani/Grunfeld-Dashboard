'use client';

import { useState } from 'react';
import axios from 'axios';

export default function AttendanceButton() {
  const [status, setStatus] = useState('');

  const markAttendance = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await axios.post('/api/markAttendance', {
            latitude,
            longitude,
          });
          setStatus(response.data.message);
          console.log(latitude, longitude)
        } catch (error) {
          setStatus('Error marking attendance: ' + error);
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
