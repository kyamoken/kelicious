// SSR 時には何もしない
if (typeof window !== "undefined") {
  // require することでトップレベル評価時の `window` 参照を回避
  const L = require("leaflet");

  // Retina判定を無効化（常に iconUrl のみを使う）
  L.Browser.retina = false;

  // public 配下に置いた自前アイコンのパス
  const iconUrl       = "/marker.png";
  const shadowUrl     = "/marker-shadow.png";

  L.Icon.Default.mergeOptions({
    iconUrl,
    iconRetinaUrl: undefined, // そもそも使わない
    shadowUrl,
    iconSize:    [25, 41],
    iconAnchor:  [12, 41],
    popupAnchor: [1, -34],
    shadowSize:  [41, 41],
  });
}

export {};