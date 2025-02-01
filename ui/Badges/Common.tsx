import React from 'react';

const Bronze = () => {
  return (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scale(1, 1)' }}>
      {/* Glowing background effect */}
      <circle cx="120" cy="120" r="80" fill="url(#glowGradient)" filter="url(#glow)" />

      {/* Outer hexagon */}
      <path
        d="M120 20 L200 60 L200 180 L120 220 L40 180 L40 60 Z"
        fill="url(#metalGradient)"
        stroke="url(#borderGradient)"
        strokeWidth="4"
      />

      {/* Inner hexagon */}
      <path
        d="M120 40 L180 70 L180 170 L120 200 L60 170 L60 70 Z"
        fill="url(#innerGradient)"
        stroke="#4FC3F7"
        strokeWidth="2"
      />

      {/* Decorative elements */}
      <path
        d="M120 60 L150 75 L150 105 L120 120 L90 105 L90 75 Z"
        fill="#4FC3F7"
        opacity="0.8"
      />

      {/* Corner accents */}
      <circle cx="40" cy="60" r="8" fill="#4FC3F7" />
      <circle cx="200" cy="60" r="8" fill="#4FC3F7" />
      <circle cx="40" cy="180" r="8" fill="#4FC3F7" />
      <circle cx="200" cy="180" r="8" fill="#4FC3F7" />

      {/* Filters and gradients */}
      <defs>
        {/* Glow effect */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="blur" operator="over" />
        </filter>

        {/* Glow gradient */}
        <radialGradient id="glowGradient">
          <stop offset="0%" stopColor="#4FC3F7" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4FC3F7" stopOpacity="0" />
        </radialGradient>

        {/* Metal gradient */}
        <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2C3E50" />
          <stop offset="50%" stopColor="#34495E" />
          <stop offset="100%" stopColor="#2C3E50" />
        </linearGradient>

        {/* Border gradient */}
        <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4FC3F7" />
          <stop offset="50%" stopColor="#03A9F4" />
          <stop offset="100%" stopColor="#4FC3F7" />
        </linearGradient>

        {/* Inner gradient */}
        <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E272E" />
          <stop offset="100%" stopColor="#2C3E50" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Bronze;
