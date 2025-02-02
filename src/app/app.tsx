"use client";

import dynamic from "next/dynamic";
import Demo from '~/components/Demo';

const DemoComponent = dynamic(() => import("~/components/Demo"), {
  ssr: false,
});

export default function App() {
  return <Demo />;
}
