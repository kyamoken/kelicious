import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  // セッションチェック
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // リクエストボディをパース
  const { title, description, imageUrl, comment, lat, lng } = await request.json();
  // バリデーション
  if (
    typeof title !== "string" ||
    typeof imageUrl !== "string" ||
    typeof comment !== "string" ||
    typeof lat !== "number" ||
    typeof lng !== "number"
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const spot = await prisma.spot.create({
      data: {
        title,
        description: description || "",
        imageUrl,
        comment,
        latitude: lat,
        longitude: lng,
        user: {
          connect: { email: session.user.email },
        },
      },
    });
    return NextResponse.json(spot, { status: 201 });
  } catch (error: any) {
    console.error("スポット作成エラー:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create spot" },
      { status: 500 }
    );
  }
}