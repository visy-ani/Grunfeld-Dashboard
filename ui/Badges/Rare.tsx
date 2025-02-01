import React from 'react';

const Rare = () => {
  return (
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Define filters */}
        <defs>
          <filter id="greenGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor="#00ff00" floodOpacity="0.3" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background hexagon with glow */}
        <path
          d="M50 0 L90 23 L90 77 L50 100 L10 77 L10 23 Z"
          fill="#004000"
          opacity="0.4"
          filter="url(#greenGlow)"
        >
          <animate
            attributeName="opacity"
            values="0.4;0.6;0.4"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        {/* Outer hexagon */}
        <path
          d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z"
          fill="#005500"
          stroke="#00ff00"
          strokeWidth="2"
          filter="url(#greenGlow)"
        />

        {/* Inner hexagon */}
        <path
          d="M50 15 L75 30 L75 70 L50 85 L25 70 L25 30 Z"
          fill="#003300"
          stroke="#52ff52"
          strokeWidth="1"
          opacity="0.8"
        />

        {/* Decorative elements */}
        <g className="decorative-elements">
          {/* Corner accents */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <path
              key={angle}
              d={`M${50 + 35 * Math.cos(angle * Math.PI / 180)} ${50 + 35 * Math.sin(angle * Math.PI / 180)} 
                 L${50 + 38 * Math.cos((angle + 10) * Math.PI / 180)} ${50 + 38 * Math.sin((angle + 10) * Math.PI / 180)}
                 L${50 + 38 * Math.cos((angle - 10) * Math.PI / 180)} ${50 + 38 * Math.sin((angle - 10) * Math.PI / 180)}`}
              fill="#004400"
              opacity="0.8"
            >
              <animate
                attributeName="opacity"
                values="0.8;1;0.8"
                dur="1.5s"
                repeatCount="indefinite"
                begin={`${angle / 360}s`}
              />
            </path>
          ))}
        </g>

        {/* Center hexagon */}
        <path
          d="M50 35 L60 40 L60 60 L50 65 L40 60 L40 40 Z"
          fill="#004800"
          stroke="#52ff52"
          strokeWidth="1"
        >
          <animate
            attributeName="stroke-opacity"
            values="0.8;1;0.8"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
  );
};

export default Rare;