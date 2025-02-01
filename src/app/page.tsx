import { Metadata } from "next";
import App from "./app";

const appUrl = process.env.NEXT_PUBLIC_URL;

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const frameEmbed = {
    version: 'next',
    imageUrl: `${appUrl}/opengraph-image`,
    button: {
      title: 'Launch Demo',
      action: {
        type: 'launch_frame',
        name: 'Frames v2 Demo',
        url: appUrl,
        splashImageUrl: `${appUrl}/splash.png`,
        splashBackgroundColor: '#f7f7f7'
      }
    }
  };

  return {
    title: "Farcaster Frames v2 Demo",
    description: "A Farcaster Frames v2 demo app.",
    openGraph: {
      title: "Farcaster Frames v2 Demo",
      description: "A Farcaster Frames v2 demo app.",
      images: [`${appUrl}/opengraph-image`],
    },
    other: {
      'fc:frame': JSON.stringify(frameEmbed),
    },
  };
}

export default function Home() {
  return (<App />);
}
