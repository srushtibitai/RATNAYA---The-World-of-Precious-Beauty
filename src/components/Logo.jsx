import React from 'react';

export function RatnayaEmblem({ size = 32, color = '#C5A059' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="ratnaya-emblem-svg"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* Outer Lotus/Floral Petals */}
      <path
        d="M50 8 C58 24, 70 32, 92 50 C70 68, 58 76, 50 92 C42 76, 30 68, 8 50 C30 32, 42 24, 50 8 Z"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Inner Symmetric Diamond Star */}
      <path
        d="M50 20 L59 41 L80 50 L59 59 L50 80 L41 59 L20 50 L41 41 Z"
        fill={color}
        opacity="0.85"
      />
      {/* Center Jewel Circle */}
      <circle cx="50" cy="50" r="6" fill="#111111" stroke={color} strokeWidth="2" />
      {/* Accent Corner Dots */}
      <circle cx="50" cy="14" r="2" fill={color} />
      <circle cx="86" cy="50" r="2" fill={color} />
      <circle cx="50" cy="86" r="2" fill={color} />
      <circle cx="14" cy="50" r="2" fill={color} />
    </svg>
  );
}

export function Logo({
  showTagline = false,
  variant = 'dark', // 'dark' or 'light' (for dark footer background)
  size = 'medium',
  className = '',
  onClick
}) {
  const emblemSize = size === 'large' ? 44 : size === 'small' ? 26 : 34;
  const textColor = variant === 'light' ? '#FFFFFF' : '#1A1A1A';
  const taglineColor = variant === 'light' ? '#C5A059' : '#6E5D4F';
  const goldColor = '#C5A059';

  return (
    <div
      onClick={onClick}
      className={`ratnaya-logo-wrapper ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        userSelect: 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src='/assets/logo.png' alt="" style={{ width: emblemSize + 10, height: emblemSize + 10, objectFit: 'contain' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: "'Marcellus', serif",
              fontSize: size === 'large' ? '1.7rem' : size === 'small' ? '1.05rem' : '1.28rem',
              fontWeight: '600',
              letterSpacing: '0.18em',
              color: textColor,
              lineHeight: 1
            }}
          >
            RATNAYA
          </span>
          {showTagline && (
            <span
              className="hidden sm:block"
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: size === 'large' ? '0.68rem' : '0.58rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: taglineColor,
                marginTop: '3px',
                fontWeight: '500',
                whiteSpace: 'nowrap'
              }}
            >
              The World of Precious Beauty
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
