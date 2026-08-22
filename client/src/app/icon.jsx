import { ImageResponse } from 'next/og';
import { promises as fs } from 'fs';
import path from 'path';

// Route segment config
export const runtime = 'nodejs';
export const size = { width: 128, height: 128 };
export const contentType = 'image/png';

export default async function Icon() {
  try {
    // Read the local image file from public folder
    const imagePath = path.join(process.cwd(), 'public', 'logo2.jpg');
    const imageBuffer = await fs.readFile(imagePath);
    const imageBase64 = imageBuffer.toString('base64');
    const imageSrc = `data:image/jpeg;base64,${imageBase64}`;

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%', // Makes it a perfect circle
            overflow: 'hidden',
            backgroundColor: '#000',
          }}
        >
          <img 
            src={imageSrc} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }} 
          />
        </div>
      ),
      { ...size }
    );
  } catch (err) {
    console.error('Failed to generate circle icon:', err);
    return new Response('Failed to generate icon', { status: 500 });
  }
}
