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
      <div className="w-2/3">
        <MapWrapper
          spots={spots}
          canAdd={true}
          onReload={() => router.refresh()}
        />
      </div>

      {/* 右：サイドバー（MapWrapper 内で SpotForm／SpotInfo を表示するため
           ここはプレースホルダー or 説明文だけにしておきます） */}
      <div className="w-1/3 p-4 space-y-4">
        <p className="text-gray-600">
          地図上のスポットをクリックすると、ここにフォームまたは詳細が表示されます。
        </p>
      </div>
    </main>
  );
}