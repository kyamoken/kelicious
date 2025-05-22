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
    <div className="bg-white p-4 shadow-lg space-y-4 relative max-w-sm">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        onClick={onClose}
      >
        ✕
      </button>
      <h2 className="text-lg font-bold">{spot.title}</h2>

      {spot.imageUrl && (
        <div className="w-full h-48 overflow-hidden rounded">
          <img
            src={spot.imageUrl}
            alt={spot.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {spot.comment && (
        <p className="text-sm font-medium">💬 {spot.comment}</p>
      )}

      {spot.description && (
        <p className="text-sm text-gray-700">{spot.description}</p>
      )}
    </div>
  );
}