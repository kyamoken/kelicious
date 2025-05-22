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
  const [lat, setLat] = useState<number>(initialLat);
  const [lng, setLng] = useState<number>(initialLng);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [comment, setComment] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setLat(initialLat);
    setLng(initialLng);
  }, [initialLat, initialLng]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // 画像ファイルが選択されていればアップロード
      let imageUrl: string | null = null;
      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) {
          throw new Error("画像アップロード失敗");
        }
        const { url } = await uploadRes.json();
        imageUrl = url;
      }

      // スポット登録APIへポスト
      const res = await fetch("/api/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          comment,
          latitude: lat,
          longitude: lng,
          imageUrl,
        }),
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      onSuccess?.();
    } catch (err: any) {
      console.error(err);
      alert("登録に失敗しました: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black opacity-40"
        onClick={onCancel}
      />
      <div className="relative bg-white w-full max-w-md p-6 rounded-lg shadow-lg space-y-4">
        <h2 className="text-xl font-semibold">新しいスポットを追加</h2>
        <p className="text-sm text-gray-600">
          座標: {lat.toFixed(4)}, {lng.toFixed(4)}
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">タイトル</label>
            <input
              type="text"
              className="w-full border rounded px-2 py-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">画像ファイル</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) setFile(e.target.files[0]);
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">一言コメント</label>
            <input
              type="text"
              className="w-full border rounded px-2 py-1"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">詳細説明 (任意)</label>
            <textarea
              className="w-full border rounded px-2 py-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              disabled={uploading}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={uploading}
            >
              {uploading ? "登録中..." : "登録"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}