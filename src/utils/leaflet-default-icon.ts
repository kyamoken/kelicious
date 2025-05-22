import L from "leaflet";

// Leaflet のデフォルトアイコン URL をクリアして、重複描画されるデフォルトピンを非表示にする
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "",
  iconUrl: "",
  shadowUrl: "",
});
