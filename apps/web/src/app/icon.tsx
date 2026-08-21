import { ImageResponse } from 'next/og';

export const size = {
  width: 64,
  height: 64,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 40%, #4f46e5 100%)',
          borderRadius: '16px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.5)',
          position: 'relative',
        }}
      >
        <svg
          width="38"
          height="38"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
