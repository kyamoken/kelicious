"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import "@/utils/leaflet-default-icon";
import "leaflet/dist/leaflet.css";
import SpotInfo from "./SpotInfo";

// Spot の型エクスポート
export interface Spot {
  id: string;
  title: string;
  comment?: string;
  description?: string;
  imageUrl?: string;
  latitude: number;
  longitude: number;
}

interface LeafletMapProps {
  spots: Spot[];
  onMapClick?: (lat: number, lng: number) => void;
  disableDrag?: boolean;
}

// アイコン生成ヘルパー（常にデフォルトアイコンを返す）
function createIcon(_: string | undefined) {
  const defaultUrl = "/marker-icon.png";
  return L.icon({
    iconUrl: defaultUrl,
    iconRetinaUrl: defaultUrl,
    iconSize: [41, 41],
    iconAnchor: [20.5, 41],
    shadowUrl: "",
  });
}

function MapOptionsSetter() {
  const map = useMap();
  useEffect(() => {
    ;(map.options as any).clickTolerance = 10;
  }, [map]);
  return null;
}

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LeafletMap({
  spots,
  onMapClick,
  disableDrag = false,
}: LeafletMapProps) {
  // 選択中のグループと詳細インデックス
  const [openGroup, setOpenGroup] = useState<number | null>(null);
  const [openIndex, setOpenIndex] = useState(0);

  // 同じ座標のスポットをグルーピング
  const groups = useMemo(() => {
    const m = new Map<string, Spot[]>();
    spots.forEach((s) => {
      const key = `${s.latitude},${s.longitude}`;
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(s);
    });
    return Array.from(m.values());
  }, [spots]);

  // 矢印キーで詳細切替
  useEffect(() => {
    if (openGroup === null) return;
    const handleKey = (e: KeyboardEvent) => {
      const len = groups[openGroup].length;
      if (e.key === "ArrowLeft") {
        setOpenIndex((i) => (i - 1 + len) % len);
      } else if (e.key === "ArrowRight") {
        setOpenIndex((i) => (i + 1) % len);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [openGroup, groups]);

  // マーカークリックでモーダルオープン
  const handleMarkerClick = (groupIdx: number) => {
    setOpenGroup(groupIdx);
    setOpenIndex(0);
  };

  // モーダルを閉じる
  const handleClose = () => {
    setOpenGroup(null);
  };

  // 地図の中心
  const center: LatLngExpression = spots.length
    ? [spots[0].latitude, spots[0].longitude]
    : [35.6895, 139.6917];

  return (
    <>
      <MapContainer
        center={center}
        zoom={13}
        className="w-full h-full"
        dragging={!disableDrag}
        doubleClickZoom={!disableDrag}
        scrollWheelZoom={!disableDrag}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapOptionsSetter />
        {onMapClick && <MapClickHandler onMapClick={onMapClick} />}

        {groups.map((group, idx) => (
          <Marker
            key={`${group[0].id}-${idx}`}
            position={[group[0].latitude, group[0].longitude]}
            icon={createIcon(undefined)}
            eventHandlers={{
              click: () => handleMarkerClick(idx),
            }}
          />
        ))}
      </MapContainer>

      {openGroup !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <SpotInfo
            spot={groups[openGroup][openIndex]}
            onClose={handleClose}
          />

          {groups[openGroup].length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl"
                onClick={() =>
                  setOpenIndex((i) =>
                    (i - 1 + groups[openGroup].length) %
                    groups[openGroup].length
                  )
                }
              >
                ◀
              </button>
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl"
                onClick={() =>
                  setOpenIndex((i) =>
                    (i + 1) % groups[openGroup].length
                  )
                }
              >
                ▶
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}