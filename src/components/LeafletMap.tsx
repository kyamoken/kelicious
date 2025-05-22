"use client";

import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { Map, LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

/** Spot の定義 */
export interface Spot {
  id: string;
  title: string;
  comment?: string;
  description?: string;
  imageUrl?: string;
  latitude: number;
  longitude: number;
}

/** MapContainer に渡す Props */
interface LeafletMapProps {
  spots: Spot[];
  onMapClick?: (lat: number, lng: number) => void;
  onMarkerClick?: (spot: Spot) => void;
  /** 追加モード時などにドラッグやズームを無効化したい場合に true を渡す */
  disableDrag?: boolean;
}

/**
 * マップオプションをコンポーネント内で設定するためのフック
 * ここで clickTolerance を設定します
 */
function MapOptionsSetter() {
  const map = useMap();
  useEffect(() => {
    // TypeScript 定義には無いプロパティですが、Leaflet のオプションとして有効です
    ;(map.options as any).clickTolerance = 10;
  }, [map]);
  return null;
}

/** クリック検知用のフック */
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
  onMarkerClick,
  disableDrag = false,
}: LeafletMapProps) {
  const center: LatLngExpression = spots.length
    ? [spots[0].latitude, spots[0].longitude]
    : [35.6895, 139.6917];

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="w-full h-full"
      // disableDrag のときだけパンやズームを無効化
      dragging={!disableDrag}
      doubleClickZoom={!disableDrag}
      scrollWheelZoom={!disableDrag}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* マップオプションを設定 */}
      <MapOptionsSetter />

      {/* クリックイベントをハンドル */}
      {onMapClick && <MapClickHandler onMapClick={onMapClick} />}

      {/* スポット表示 */}

      {spots.map((s) => (
        <Marker
          key={s.id}
          position={[s.latitude, s.longitude]}
          eventHandlers={{
            click: () => onMarkerClick?.(s),
          }}
        />
      ))}
    </MapContainer>

  );
}