import React from 'react';

const Legendary = () => {
  return (
      <svg
        viewBox='0 0 100 100'
        className='w-full h-full'
        xmlns='http://www.w3.org/2000/svg'
      >
        <defs>
          {/* Enhanced neon glow effect */}
          <filter id='neonGlow' x='-50%' y='-50%' width='200%' height='200%'>
            <feGaussianBlur stdDeviation='2' result='blur' />
            <feFlood floodColor='#ff4400' floodOpacity='0.7' />
            <feComposite in2='blur' operator='in' />
            <feMerge>
              <feMergeNode />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
          
          {/* Consistent red-orange gradient */}
          <linearGradient id='mainGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' style={{ stopColor: '#ff3300', stopOpacity: 0.9 }} />
            <stop offset='100%' style={{ stopColor: '#ff6600', stopOpacity: 1 }} />
          </linearGradient>

          {/* Center glow gradient */}
          <radialGradient id='centerGradient' cx='50%' cy='50%' r='50%'>
            <stop offset='0%' style={{ stopColor: '#ff5500', stopOpacity: 1 }} />
            <stop offset='100%' style={{ stopColor: '#ff3300', stopOpacity: 0.8 }} />
          </radialGradient>
        </defs>

        {/* Base hexagon with neon effect */}
        <path
          d='M50 0 L90 23 L90 77 L50 100 L10 77 L10 23 Z'
          fill='#ff2200'
          opacity='0.2'
          filter='url(#neonGlow)'
        >
          <animate
            attributeName='opacity'
            values='0.2;0.3;0.2'
            dur='3s'
            repeatCount='indefinite'
          />
        </path>

        {/* Main hexagon with strong glow */}
        <path
          d='M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z'
          fill='url(#mainGradient)'
          stroke='#ff6600'
          strokeWidth='1.5'
          filter='url(#neonGlow)'
        >
          <animate
            attributeName='stroke-opacity'
            values='0.7;1;0.7'
            dur='2s'
            repeatCount='indefinite'
          />
        </path>

        {/* Secondary hexagon */}
        <path
          d='M50 15 L75 30 L75 70 L50 85 L25 70 L25 30 Z'
          fill='#ff4400'
          stroke='#ff8800'
          strokeWidth='1'
          opacity='0.8'
        />

        {/* Center hexagon with strong glow */}
        <path
          d='M50 35 L60 40 L60 60 L50 65 L40 60 L40 40 Z'
          fill='url(#centerGradient)'
          stroke='#ff8800'
          strokeWidth='1'
          filter='url(#neonGlow)'
        >
          <animate
            attributeName='fill-opacity'
            values='0.8;1;0.8'
            dur='2s'
            repeatCount='indefinite'
          />
        </path>

        {/* Centered emblem */}
        <path
          d='M50 45 L53 48 L50 51 L47 48 Z'
          fill='#ffaa00'
          filter='url(#neonGlow)'
        >
          <animate
            attributeName='opacity'
            values='0.8;1;0.8'
            dur='1.5s'
            repeatCount='indefinite'
          />
        </path>
      </svg>
  );
};

export default Legendary;