"use client";

import React from "react";
import type { Spot as SpotType } from "./LeafletMap";

interface Props {
  /** 表示対象のスポット */
  spot: SpotType;
  /** 閉じるボタン押下時のコールバック */
  onClose: () => void;
}

export default function SpotInfo({ spot, onClose }: Props) {
  return (
    <div className="bg-white p-4 shadow-lg space-y-2 relative">
      {/* 閉じるボタン */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
      >
        ×
      </button>

      {/* タイトル */}
      <h2 className="text-xl font-bold">{spot.title}</h2>

      {/* 画像 */}
      {spot.imageUrl && (
        <img
          src={spot.imageUrl}
          alt={spot.title}
          className="w-full h-auto rounded"
        />
      )}

      {/* 一言コメント */}
      {spot.comment && (
        <p className="italic text-gray-700">{spot.comment}</p>
      )}

      {/* 詳細説明 */}
      {spot.description && (
        <p className="text-gray-800">{spot.description}</p>
      )}

      {/* 座標 */}
      <p className="text-sm text-gray-500">
        緯度: {spot.latitude.toFixed(4)}, 経度: {spot.longitude.toFixed(4)}
      </p>
    </div>
  );
}