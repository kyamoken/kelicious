"use client";

import MapWrapper from "@/components/MapWrapper";
import { useRouter } from "next/navigation";

type Spot = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
};

interface ClientHomeProps {
  spots: Spot[];
  canAdd: boolean;
}

export default function ClientHome({ spots, canAdd }: ClientHomeProps) {
  const router = useRouter();

  return (
    <main className="w-screen h-screen flex">
      {/* 左：地図 */}
      <div className="w-full h-full">
        <MapWrapper
          spots={spots}
          canAdd={canAdd}
          onReload={() => router.refresh()}
        />
      </div>
    </main>
  );
}