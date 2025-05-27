"use client";

import React, { useEffect, useMemo } from "react";
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

// LeafletMap が受け取る props をエクスポート
export interface LeafletMapProps {
  spots: Spot[];
  onMapClick?: (lat: number, lng: number) => void;
  // 変更: 複数スポットをまとめて通知する
  onMarkerClick?: (spots: Spot[]) => void;
  disableDrag?: boolean;
}

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
  onMarkerClick,
  disableDrag = false,
}: LeafletMapProps) {
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

  const center: LatLngExpression = spots.length
    ? [spots[0].latitude, spots[0].longitude]
    : [35.6895, 139.6917];

  return (
    <MapContainer
      center={center}
      zoom={13}
      zoomControl={false}
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
            click: () => {
              if (onMarkerClick) {
                // グループ全体を一度だけ通知
                onMarkerClick(group);
              }
            },
          }}
        />
      ))}
    </MapContainer>
  );
}