"use client";

import MapWrapper from "@/components/MapWrapper";
import { useRouter } from "next/navigation";

type Spot = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
};

export default function ClientHome({ spots }: { spots: Spot[] }) {
  const router = useRouter();

  return (
    <main className="w-screen h-screen flex">
      {/* 左：地図 */}
      <div className="w-full h-full">
        <MapWrapper
          spots={spots}
          canAdd={true}
          onReload={() => router.refresh()}
        />
      </div>
    </main>
  );
}