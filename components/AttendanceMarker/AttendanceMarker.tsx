'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const assignedLocation = {
  latitude: 12.8463043, 
  longitude: 77.6650548, 
  tolerance: 0.0001, 
};

// Haversine formula to calculate distance between two points on Earth
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
};

export default function AttendanceButton() {
  const [status, setStatus] = useState('');
  const [isClient, setIsClient] = useState(false);

  // Ensure that the code runs only on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const markAttendance = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const distance = getDistance(
          latitude, longitude, 
          assignedLocation.latitude, assignedLocation.longitude
        );

        if (distance > assignedLocation.tolerance) {
          setStatus('Error: You are not at the assigned location.');
          return;
        }

        try {
          const response = await axios.post('/api/markAttendance', {
            name: 'John Doe', 
            latitude, 
            longitude
          });

          setStatus(response.data.message);
        } catch (error) {
          setStatus('Error marking attendance: ' + error);
        }
      },
      () => setStatus('Unable to retrieve location.')
    );
  };

  // Only render the button if on the client side
  if (!isClient) {
    return null;
  }

  return (
    <div>
      <button onClick={markAttendance} className="px-4 py-2 bg-blue-600 text-white rounded">
        Mark Attendance
      </button>
      {status && <p className="mt-2 text-red-500">{status}</p>}
    </div>
  );
}
