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
  // --- state ---
  const [mode, setMode] = useState<"none" | "add" | "info">("none");
  const [currentLatLng, setCurrentLatLng] =
    useState<{ lat: number; lng: number } | null>(null);
  const [currentSpot, setCurrentSpot] = useState<SpotType | null>(null);
  const [registerMode, setRegisterMode] = useState(false);

  // --- reset on spots change or registerMode off ---
  useEffect(() => {
    setMode("none");
    setCurrentLatLng(null);
    setCurrentSpot(null);
  }, [spots]);

  useEffect(() => {
    if (!registerMode) {
      setMode("none");
      setCurrentLatLng(null);
      setCurrentSpot(null);
    }
  }, [registerMode]);

  // --- debug ---
  useEffect(() => {
    console.log("[MapWrapper] canAdd:", canAdd);
    console.log("[MapWrapper] registerMode:", registerMode);
    console.log("[MapWrapper] mode:", mode);
  }, [canAdd, registerMode, mode]);

  return (
    <div className="relative w-full h-full">
      {/* 登録モード切替ボタン */}
      {canAdd ? (
        <button
          className="absolute top-2 left-2 z-50 bg-white border px-3 py-1 rounded shadow hover:bg-gray-100 text-sm"
          onClick={() => setRegisterMode((f) => !f)}
        >
          登録モード: {registerMode ? "ON" : "OFF"}
        </button>
      ) : (
        <div className="absolute top-2 left-2 z-50 p-1 bg-white border rounded text-sm text-red-600">
          🛑 登録権限なし
        </div>
      )}

      {/* 地図レイヤー（背面） */}
      <div className="w-full h-full z-0">
        <LeafletMap
          spots={spots}
          onMapClick={
            registerMode
              ? (lat, lng) => {
                  setCurrentLatLng({ lat, lng });
                  setMode("add");
                }
              : undefined
          }
          onMarkerClick={(spot) => {
            if (registerMode) {
              setCurrentLatLng({ lat: spot.latitude, lng: spot.longitude });
              setMode("add");
            } else {
              setCurrentSpot(spot);
              setMode("info");
            }
          }}
          disableDrag={registerMode}
        />
      </div>

      {/* SpotForm モーダル */}
      {mode === "add" && currentLatLng && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" />
          <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <SpotForm
              initialLat={currentLatLng.lat}
              initialLng={currentLatLng.lng}
              onSuccess={() => {
                setMode("none");
                onReload();
              }}
              onCancel={() => setMode("none")}
            />
          </div>
        </div>
      )}

      {/* SpotInfo モーダル */}
      {mode === "info" && currentSpot && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" />
          <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <SpotInfo spot={currentSpot} onClose={() => setMode("none")} />
          </div>
        </div>
      )}
    </div>
  );
}