import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  // Next.js の推奨設定を flat 形式で読み込む
  ...compat.extends(
    "next",                   // まず必ず next 本体を
    "next/core-web-vitals",   // コア Web バイタル向け
    "next/typescript"         // TypeScript を使っていれば
  ),
  {
    // プロジェクト固有の追加ルールがあれば
    rules: {
      // 例: セミコロンを必須にする
      // "semi": ["error", "always"]
    }
  }
];