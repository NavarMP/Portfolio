import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Dynamic params
    const hasTitle = searchParams.has('title');
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'Muḥammed Navār - Graphic Designer & Full-Stack Developer';

    const hasDescription = searchParams.has('description');
    const description = hasDescription
      ? searchParams.get('description')?.slice(0, 150)
      : 'Portfolio showcasing graphic design, web development, and digital marketing work';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'baseline',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            padding: '80px',
            color: 'white',
          }}
        >
          {/* Logo or Signature */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 800,
                letterSpacing: '-0.05em',
                background: 'linear-gradient(to right, #ffffff, #a3a3a3)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              NavarMP.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                marginBottom: '20px',
                maxWidth: '900px',
              }}
            >
              {title}
            </div>

            {hasDescription && (
              <div
                style={{
                  fontSize: 32,
                  color: '#a3a3a3',
                  maxWidth: '900px',
                  lineHeight: 1.4,
                }}
              >
                {description}
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error(e.message);
    return new Response('Failed to generate the image', {
      status: 500,
    });
  }
}
