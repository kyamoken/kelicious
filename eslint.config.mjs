import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Next.js の推奨設定を flat 形式で読み込む
  ...compat.extends(
    "next",                    // next/core-web-vitals 以前に必ず next を
    "next/core-web-vitals",    // コア Web バイタル向け lint ルール
    "next/typescript"          // TypeScript を使っていれば
  ),
  {
    // ここにプロジェクト固有のルールを追加
    rules: {
      // 例: セミコロンを必須にする
      // "semi": ["error", "always"]
    }
  }
];