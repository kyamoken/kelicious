import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // Next.js の推奨設定を flat 形式で読み込む
  ...compat.extends(
    "next",                   // まず必ず next 本体を
    "next/core-web-vitals",   // コア Web バイタル向け
    "next/typescript"         // TypeScript を使っていれば
  ),
  {
    // プロジェクト固有の追加ルール
    rules: {
      // `any` を許可
      "@typescript-eslint/no-explicit-any": "off",

      // 未使用変数は警告に落としつつ、名前に `_` が先頭なら無視
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],

      // var を許可
      "no-var": "off",

      // <img> の警告をオフ
      "@next/next/no-img-element": "off"
    }
  }
];