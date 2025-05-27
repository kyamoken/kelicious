"use client";

import React from "react";
import type { Spot } from "./LeafletMap";

interface Props {
  spot: Spot & {
    comment?: string;
    description?: string;
    imageUrl?: string;
  };
  onClose: () => void;
}

export default function SpotInfo({ spot, onClose }: Props) {
  return (
    <div className="relative bg-white w-full flex flex-col gap-6">
      {/* 閉じるボタン */}
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 z-10"
        onClick={onClose}
      >
        ✕
      </button>

      {/* タイトル */}
      <h2 className="text-2xl font-bold text-center text-gray-900">
        {spot.title}
      </h2>

      {/* 画像：最大高さを制限し、はみ出る場合は中でスクロール */}
      {spot.imageUrl && (
        <div className="w-full max-w-md mx-auto overflow-auto rounded-lg shadow-sm max-h-[50vh]">
          <img
            src={spot.imageUrl}
            alt={spot.title}
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* 一言コメント */}
      {spot.comment && (
        <div className="w-full bg-gray-100 rounded-lg p-3 text-gray-800">
          💬 {spot.comment}
        </div>
      )}

      {/* 詳細説明 */}
      {spot.description && (
        <div className="prose prose-sm text-gray-700">
          {spot.description}
        </div>
      )}
    </div>
  );
}