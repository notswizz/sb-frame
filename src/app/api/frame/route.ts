import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const appUrl = process.env.NEXT_PUBLIC_URL;

  return NextResponse.json({
    frames: {
      version: 'vNext',
      image: `${appUrl}/opengraph-image`,
      buttons: [
        {
          label: 'Launch Demo',
          action: 'launch_frame',
          target: appUrl,
          splash_image_url: `${appUrl}/splash.png`,
          splash_background_color: '#f7f7f7',
        }
      ],
    }
  })
} 