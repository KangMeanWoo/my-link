import { ImageResponse } from 'next/og';
import { getUserIdByDisplayNameLite, getUserProfileLite } from '@/lib/firestore-lite';

export const runtime = 'nodejs';
export const alt = 'MyLink User Profile';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ displayName: string }> }) {
  let displayName = "User";
  try {
    const unwrappedParams = await params;
    displayName = decodeURIComponent(unwrappedParams.displayName);
  } catch (e) {
    console.error('Decoding error:', e);
  }
  
  let profile = null;
  try {
    const userId = await getUserIdByDisplayNameLite(displayName);
    if (userId) {
      profile = await getUserProfileLite(userId) as any;
    }
  } catch (error: any) {
    console.error('Firestore Fetch Error:', error);
  }

  const name = profile?.name || displayName;
  const bio = profile?.bio || 'MyLink에서 나만의 페이지를 확인해보세요.';
  const avatarColor = profile ? '#3b82f6' : '#64748b';

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0f172a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Gradients */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -150,
            left: -100,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Content Card Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80%',
            height: '70%',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 40,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            padding: '40px',
            position: 'relative',
          }}
        >
          {/* Avatar with Ring */}
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${avatarColor}, #1d4ed8)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 70,
              fontWeight: 900,
              color: 'white',
              boxShadow: '0 0 40px rgba(59, 130, 246, 0.3)',
              marginBottom: 30,
              border: '4px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {name.charAt(0).toUpperCase()}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: 56,
                fontWeight: 900,
                color: '#ffffff',
                display: 'flex',
              }}
            >
              {name}
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#3b82f6',
                background: 'rgba(59, 130, 246, 0.1)',
                padding: '4px 16px',
                borderRadius: 100,
                display: 'flex',
                letterSpacing: '0.05em',
              }}
            >
              @{displayName}
            </div>
          </div>

          <div
            style={{
              fontSize: 24,
              color: 'rgba(255, 255, 255, 0.6)',
              maxWidth: 700,
              lineHeight: 1.6,
              fontWeight: 500,
              display: 'flex',
              textAlign: 'center',
              justifyContent: 'center',
            }}
          >
            {bio.length > 120 ? bio.substring(0, 120) + '...' : bio}
          </div>
        </div>

        {/* Branding Footer (Better Spacing) */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 800, color: 'white', display: 'flex' }}>
            My<span style={{ color: '#3b82f6' }}>Link</span>
          </div>
          <div style={{ width: 1, height: 16, background: 'rgba(255, 255, 255, 0.2)', display: 'flex' }} />
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255, 255, 255, 0.4)', letterSpacing: '0.2em', display: 'flex' }}>
            MYLINK.APP
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
