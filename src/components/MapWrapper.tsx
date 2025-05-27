"use client";

import { useState, useEffect, useMemo, ReactNode } from "react";
import dynamic from "next/dynamic";
import { createPortal } from "react-dom";
import type { Spot as SpotType, LeafletMapProps } from "./LeafletMap";
import SpotForm from "./SpotForm";
import SpotInfo from "./SpotInfo";

const LeafletMap = dynamic<LeafletMapProps>(
  () => import("./LeafletMap").then((mod) => mod.default),
  { ssr: false }
);

interface MapWrapperProps {
  spots: SpotType[];
  canAdd: boolean;
  onReload?: () => void;
}

function ModalPortal({ children }: { children: ReactNode }) {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
}

export default function MapWrapper({
  spots: initialSpots,
  canAdd,
  onReload,
}: MapWrapperProps) {
  const [spots, setSpots] = useState<SpotType[]>(initialSpots);
  const [mode, setMode] = useState<"none" | "add" | "info">("none");
  const [currentLatLng, setCurrentLatLng] =
    useState<{ lat: number; lng: number } | null>(null);
  const [currentGroup, setCurrentGroup] = useState<SpotType[] | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [registerMode, setRegisterMode] = useState(false);

  // フィルター用
  const [filterText, setFilterText] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    fetch("/api/spots")
      .then((res) => res.json())
      .then((data: SpotType[]) => setSpots(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setSpots(initialSpots);
    setMode("none");
    setCurrentLatLng(null);
    setCurrentGroup(null);
    setCarouselIndex(0);
    setFilterText("");
    setActiveFilter(null);
    setIsFocused(false);
  }, [initialSpots]);

  useEffect(() => {
    if (!registerMode) {
      setMode("none");
      setCurrentLatLng(null);
      setCurrentGroup(null);
      setCarouselIndex(0);
    }
  }, [registerMode]);

  const handleReload = () => {
    fetch("/api/spots")
      .then((res) => res.json())
      .then((data: SpotType[]) => setSpots(data))
      .catch(console.error)
      .finally(() => onReload?.());
  };

  const filteredSpots = useMemo(() => {
    if (!activeFilter) return spots;
    return spots.filter((s) =>
      (s.comment ?? "").toLowerCase().includes(activeFilter.toLowerCase())
    );
  }, [spots, activeFilter]);

  const tagCounts = useMemo<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    spots.forEach((s) => {
      const tag = (s.comment ?? "").trim();
      if (!tag) return;
      counts[tag] = (counts[tag] || 0) + 1;
    });
    return counts;
  }, [spots]);

  const suggestions = useMemo(
    () =>
      Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3),
    [tagCounts]
  );

  const filteredSuggestions = useMemo(
    () =>
      suggestions.filter((s) =>
        s.tag.toLowerCase().includes(filterText.toLowerCase())
      ),
    [suggestions, filterText]
  );

  return (
    <div className="relative flex flex-col h-full w-full">
      {/* ヘッダー: 横並びコンパクト, モバイル時に検索バー小さく */}
      <header
        className="
          absolute inset-x-2 top-4
          rounded-lg shadow-lg
          px-3 py-2
          flex items-center justify-between
          space-x-3
          z-10
          bg-[rgba(240,132,26,0.9)]
        "
      >
        {/* ロゴ＋タイトル */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <img
            src="/images/Fork.png"
            alt="Kelicious Logo"
            className="h-6 sm:h-8 w-auto"
          />
          <span className="text-lg sm:text-xl font-semibold text-white">
            Kelicious
          </span>
        </div>

        {/* 検索バー＋ボタン */}
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="絞り込み"
            className="
              h-6 sm:h-8
              px-1 sm:px-2
              text-xs sm:text-sm
              rounded
              text-black
              flex-shrink-0
              w-16 sm:w-32 md:w-48
            "
            style={{ backgroundColor: "#FFD08A" }}
          />
          {isFocused && filteredSuggestions.length > 0 && (
            <ul
              className="absolute top-full right-0 mt-1 w-40 sm:w-48 shadow-lg rounded-lg overflow-auto z-20"
              style={{ backgroundColor: "#FDEFCD" }}
            >
              {filteredSuggestions.map(({ tag, count }) => (
                <li key={tag}>
                  <button
                    onMouseDown={() => {
                      setFilterText(tag);
                      setActiveFilter(tag);
                    }}
                    className="flex justify-between w-full px-2 py-1 hover:bg-gray-100 text-xs"
                  >
                    <span>{tag}</span>
                    <span className="text-gray-500">({count})</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={() => setActiveFilter(filterText)}
            className="
              h-6 sm:h-8
              px-1 sm:px-3
              text-xs sm:text-sm
              font-semibold
              rounded
              text-white
            "
            style={{ backgroundColor: "#4CACB9" }}
          >
            検索
          </button>
        </div>
      </header>

      {/* 地図エリア */}
      <div className="absolute inset-0">
        {canAdd && (
          <button
            className="absolute top-32 left-6 z-10 bg-white border px-3 py-1 rounded shadow-md hover:bg-gray-100 text-sm transition"
            onClick={() => setRegisterMode((p) => !p)}
          >
            登録モード: {registerMode ? "ON" : "OFF"}
          </button>
        )}
        <LeafletMap
          spots={filteredSpots}
          onMapClick={
            registerMode
              ? (lat, lng) => {
                  setCurrentLatLng({ lat, lng });
                  setMode("add");
                }
              : undefined
          }
          onMarkerClick={(group) => {
            if (registerMode) {
              setCurrentLatLng({
                lat: group[0].latitude,
                lng: group[0].longitude,
              });
              setMode("add");
            } else {
              setCurrentGroup(group);
              setCarouselIndex(0);
              setMode("info");
            }
          }}
          disableDrag={registerMode}
        />
      </div>

      {/* SpotForm モーダル */}
      {mode === "add" && currentLatLng && (
        <ModalPortal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 max-w-full sm:max-w-md w-full overflow-auto">
              <SpotForm
                initialLat={currentLatLng.lat}
                initialLng={currentLatLng.lng}
                onSuccess={() => {
                  setMode("none");
                  handleReload();
                }}
                onCancel={() => setMode("none")}
              />
            </div>
          </div>
        </ModalPortal>
      )}

      {/* SpotInfo モーダル */}
      {mode === "info" && currentGroup && (
        <ModalPortal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 max-w-full sm:max-w-lg w-full overflow-auto">
              {currentGroup.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-md z-50 transition hover:bg-gray-100"
                    onClick={() =>
                      setCarouselIndex((i) =>
                        i === 0 ? currentGroup.length - 1 : i - 1
                      )
                    }
                  >
                    ‹
                  </button>
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-md z-50 transition hover:bg-gray-100"
                    onClick={() =>
                      setCarouselIndex((i) =>
                        i === currentGroup.length - 1 ? 0 : i + 1
                      )
                    }
                  >
                    ›
                  </button>
                </>
              )}
              <SpotInfo
                spot={currentGroup[carouselIndex]}
                onClose={() => {
                  setMode("none");
                  setCurrentGroup(null);
                  setCarouselIndex(0);
                }}
              />
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}