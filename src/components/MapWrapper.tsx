"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { Spot as SpotType } from "./LeafletMap";
import SpotForm from "./SpotForm";
import SpotInfo from "./SpotInfo";

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

interface MapWrapperProps {
  spots: SpotType[];
  canAdd: boolean;
  onReload: () => void;
}

export default function MapWrapper({
  spots,
  canAdd,
  onReload,
}: MapWrapperProps) {
  // モード管理: none/info/add
  const [mode, setMode] = useState<"none" | "add" | "info">("none");
  const [currentLatLng, setCurrentLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [currentSpot, setCurrentSpot] = useState<SpotType | null>(null);

  // 登録モードのトグル
  const [registerMode, setRegisterMode] = useState(false);

  // spots が切り替わったらリセット
  useEffect(() => {
    setMode("none");
    setCurrentLatLng(null);
    setCurrentSpot(null);
  }, [spots]);

  // 登録モードをオフにしたときは form/info を閉じる
  useEffect(() => {
    if (!registerMode) {
      setMode("none");
      setCurrentLatLng(null);
      setCurrentSpot(null);
    }
  }, [registerMode]);

  return (
    <div className="relative w-full h-full">
      {canAdd && (
        <button
          className="absolute top-2 left-2 z-20 bg-white border px-3 py-1 rounded shadow-sm hover:bg-gray-100"
          onClick={() => setRegisterMode((prev) => !prev)}
        >
          {registerMode ? "登録モード: ON" : "登録モード: OFF"}
        </button>
      )}

      <LeafletMap
        spots={spots}
        // 登録モードのときだけクリックで追加座標を設定
        onMapClick={
          registerMode
            ? (lat, lng) => {
                setCurrentLatLng({ lat, lng });
                setMode("add");
              }
            : undefined
        }
        // マーカークリックも登録モードなら追加、そうでなければ情報表示
        onMarkerClick={(spot) => {
          if (registerMode) {
            setCurrentLatLng({ lat: spot.latitude, lng: spot.longitude });
            setMode("add");
          } else {
            setCurrentSpot(spot);
            setMode("info");
          }
        }}
        // 登録モード中はドラッグなどを無効化
        disableDrag={registerMode}
      />

      {mode === "add" && currentLatLng && (
        <SpotForm
          initialLat={currentLatLng.lat}
          initialLng={currentLatLng.lng}
          onSuccess={() => {
            setMode("none");
            onReload();
          }}
          onCancel={() => setMode("none")}
        />
      )}

      {mode === "info" && currentSpot && (
        <SpotInfo
          spot={currentSpot}
          onClose={() => setMode("none")}
        />
      )}
    </div>
  );
}