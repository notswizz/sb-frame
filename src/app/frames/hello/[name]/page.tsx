import { Metadata } from "next";
import App from "~/app/app";

const appUrl = process.env.NEXT_PUBLIC_URL;

interface PageProps {
  params: {
    name: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = params;

  const frame = {
    version: "next",
    imageUrl: `${appUrl}/frames/hello/${name}/opengraph-image`,
    button: {
      title: "Launch Frame",
      action: {
        type: "launch_frame",
        name: "Farcaster Frames v2 Demo",
        url: `${appUrl}/frames/hello/${name}/`,
        splashImageUrl: `${appUrl}/splash.png`,
        splashBackgroundColor: "#f7f7f7",
      },
    },
  };

  return {
    title: `Hello, ${name}`,
    description: `A personalized hello frame for ${name}`,
    openGraph: {
      title: `Hello, ${name}`,
      description: `A personalized hello frame for ${name}`,
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { name } = params;

  return <App />;
}
