import React from 'react';

const Epic = () => {
  return (
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Enhanced neon glow */}
          <filter id="purpleNeonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feFlood floodColor="#b200ff" floodOpacity="0.6" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Premium sparkle effect */}
          <filter id="premiumSparkle">
            <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" />
            <feColorMatrix type="saturate" values="30" />
            <feBlend in="SourceGraphic" mode="screen" />
          </filter>
        </defs>

        {/* Ambient background glow */}
        <path
          d="M50 -5 L95 20 L95 80 L50 105 L5 80 L5 20 Z"
          fill="#190025"
          opacity="0.4"
          filter="url(#purpleNeonGlow)"
        >
          <animate
            attributeName="opacity"
            values="0.4;0.6;0.4"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>

        {/* Background hexagon with enhanced glow */}
        <path
          d="M50 0 L90 23 L90 77 L50 100 L10 77 L10 23 Z"
          fill="#20003b"
          opacity="0.5"
          filter="url(#purpleNeonGlow)"
        >
          <animate
            attributeName="opacity"
            values="0.5;0.7;0.5"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        {/* Outer hexagon with neon double stroke */}
        <path
          d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z"
          fill="#2a0052"
          stroke="#e600ff"
          strokeWidth="0.5"
          filter="url(#purpleNeonGlow)"
        />
        <path
          d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z"
          fill="none"
          stroke="#b200ff"
          strokeWidth="2"
          opacity="0.9"
        >
          <animate
            attributeName="stroke-opacity"
            values="0.9;1;0.9"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        {/* Inner hexagon with premium effect */}
        <path
          d="M50 15 L75 30 L75 70 L50 85 L25 70 L25 30 Z"
          fill="#33004d"
          stroke="#ff00ff"
          strokeWidth="1"
          opacity="0.9"
        />

        {/* Enhanced decorative elements */}
        <g className="decorative-elements">
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <g key={angle}>
              <path
                d={`M${50 + 35 * Math.cos(angle * Math.PI / 180)} ${50 + 35 * Math.sin(angle * Math.PI / 180)} 
                   L${50 + 38 * Math.cos((angle + 10) * Math.PI / 180)} ${50 + 38 * Math.sin((angle + 10) * Math.PI / 180)}
                   L${50 + 38 * Math.cos((angle - 10) * Math.PI / 180)} ${50 + 38 * Math.sin((angle - 10) * Math.PI / 180)}`}
                fill="#cc00ff"
                opacity="0.9"
              >
                <animate
                  attributeName="opacity"
                  values="0.9;1;0.9"
                  dur="1.5s"
                  repeatCount="indefinite"
                  begin={`${angle / 360}s`}
                />
              </path>
              {/* Neon accent points */}
              <circle
                cx={50 + 36 * Math.cos(angle * Math.PI / 180)}
                cy={50 + 36 * Math.sin(angle * Math.PI / 180)}
                r="1"
                fill="#ff66ff"
                filter="url(#purpleNeonGlow)"
              >
                <animate
                  attributeName="r"
                  values="1;1.5;1"
                  dur="2s"
                  repeatCount="indefinite"
                  begin={`${angle / 360}s`}
                />
              </circle>
            </g>
          ))}
        </g>

        {/* Center hexagon with neon effect */}
        <path
          d="M50 35 L60 40 L60 60 L50 65 L40 60 L40 40 Z"
          fill="#400066"
          stroke="#ff33ff"
          strokeWidth="1"
        >
          <animate
            attributeName="stroke-opacity"
            values="0.8;1;0.8"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
        
        {/* Central neon glow */}
        <circle
          cx="50"
          cy="50"
          r="8"
          fill="#ff00ff"
          opacity="0.2"
          filter="url(#purpleNeonGlow)"
        >
          <animate
            attributeName="opacity"
            values="0.2;0.3;0.2"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
  );
};

export default Epic;