"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MapWrapper from "@/components/MapWrapper";

type Spot = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
};

type SessionInfo = {
  user?: {
    name?: string;
    email?: string;
  };
  expires?: string;
};

/**
 * クライアントサイドで /api/auth/session を叩いて
 * 認証状態を可視化するサンプル。
 * NextAuth の SessionProvider を使わずに、
 * 直接 API を呼ぶのでレイアウト変更不要。
 */
export default function ClientHome({ spots }: { spots: Spot[] }) {
  const router = useRouter();

  // 認証情報をフェッチして保持
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data: SessionInfo) => {
        console.log("fetched session:", data);
        setSessionInfo(data);
      })
      .catch((err) => {
        console.error("session fetch error:", err);
        setSessionInfo(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 認証済み判定
  const isAuthenticated = !!sessionInfo?.user;

  return (
    <main className="w-screen h-screen flex">
      {/* 右上にログ */}
      <div className="absolute top-2 right-2 z-20 p-3 bg-white border rounded shadow-sm text-sm">
        {loading ? (
          <p>認証情報を読み込み中…</p>
        ) : isAuthenticated ? (
          <>
            <p className="text-green-600">
              ✅ 認証済み: {sessionInfo.user?.name ?? sessionInfo.user?.email}
            </p>
            <pre className="mt-1 whitespace-pre-wrap">
              {JSON.stringify(sessionInfo, null, 2)}
            </pre>
          </>
        ) : (
          <>
            <p className="text-red-500">🔒 未認証</p>
            <pre className="mt-1 whitespace-pre-wrap">
              {JSON.stringify(sessionInfo, null, 2)}
            </pre>
          </>
        )}
      </div>

      {/* 左：地図 */}
      <div className="w-2/3">
        <MapWrapper
          spots={spots}
          canAdd={isAuthenticated}
          onReload={() => router.refresh()}
        />
      </div>

      {/* 右：サイドバー */}
      <div className="w-1/3 p-4 space-y-4">
        <p className="text-gray-600">
          地図上のスポットをクリックすると、ここにフォームまたは詳細が表示されます。
        </p>
      </div>
    </main>
  );
}