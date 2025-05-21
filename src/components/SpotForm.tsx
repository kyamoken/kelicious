"use client";

import { useState, useEffect } from "react";

interface Props {
  /** 地図でクリックされた緯度 */
  initialLat: number;
  /** 地図でクリックされた経度 */
  initialLng: number;
  /** 登録成功時のコールバック */
  onSuccess?: () => void;
  /** キャンセル時のコールバック */
  onCancel?: () => void;
}

export default function SpotForm({
  initialLat,
  initialLng,
  onSuccess,
  onCancel,
}: Props) {
  // フォーム内で使う緯度経度はローカルステートに保持
  const [lat, setLat] = useState<number>(initialLat);
  const [lng, setLng] = useState<number>(initialLng);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [comment, setComment] = useState("");

  // initialLat/initialLng が変わったらステートを更新
  useEffect(() => {
    setLat(initialLat);
    setLng(initialLng);
  }, [initialLat, initialLng]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, imageUrl, comment, lat, lng }),
      });
      if (!res.ok) throw new Error(await res.text());
      onSuccess?.();
    } catch (err: any) {
      console.error(err);
      alert("登録に失敗しました: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 bg-white p-4 shadow-lg">
      <h2 className="text-lg font-bold">新しいスポットを追加</h2>
      <p>座標: {lat.toFixed(4)}, {lng.toFixed(4)}</p>
      <input
        className="w-full border p-1"
        placeholder="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        className="w-full border p-1"
        placeholder="画像URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        required
      />
      <input
        className="w-full border p-1"
        placeholder="一言コメント"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      <textarea
        className="w-full border p-1"
        placeholder="詳細説明 (任意)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="flex space-x-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          登録
        </button>
        <button
          type="button"
          className="bg-gray-300 px-4 py-2"
          onClick={onCancel}
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}