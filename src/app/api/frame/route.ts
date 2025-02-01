import { NextResponse } from 'next/server'

export async function POST() {
  const appUrl = process.env.NEXT_PUBLIC_URL;

  return NextResponse.json({
    frames: {
      version: 'vNext',
      image: `${appUrl}/opengraph-image`,
      buttons: [
        {
          label: 'Send to Chiefs',
          action: 'post',
        },
        {
          label: 'Send to Eagles',
          action: 'post',
        },
      ],
    }
  })
} 