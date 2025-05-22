import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// ← ここを "nodejs" に変更
export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("image") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const fileName = `${timestamp}-${safeName}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await fs.promises.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, fileName);
  await fs.promises.writeFile(filePath, buffer);

  return NextResponse.json({ url: `/uploads/${fileName}` });
}