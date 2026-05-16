import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'MyLink - 모든 링크를 한 곳에';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'radial-gradient(circle at center, #1e293b, #0f172a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background shapes for a premium look */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(59, 130, 246, 0.1)',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -150,
            right: -100,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'rgba(59, 130, 246, 0.08)',
            filter: 'blur(100px)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '60px 80px',
            borderRadius: 40,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: 'white',
              letterSpacing: '-0.05em',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            My<span style={{ color: '#3b82f6' }}>Link</span>
          </div>
          <div
            style={{
              fontSize: 32,
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            모든 링크를 한 곳에
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 20,
            color: 'rgba(255, 255, 255, 0.4)',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          mylink.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
