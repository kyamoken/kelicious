import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

export const runtime = "nodejs";
const prisma = new PrismaClient();

/**
 * GET /api/spots
 * 全スポットを comment/description/imageUrl 含めて返す
 */
export async function GET() {
  try {
    const spots = await prisma.spot.findMany({
      select: {
        id: true,
        title: true,
        comment: true,
        description: true,
        imageUrl: true,
        latitude: true,
        longitude: true,
      },
    });
    return NextResponse.json(spots, { status: 200 });
  } catch (error: any) {
    console.error("スポット取得エラー:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch spots" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/spots
 * 新しいスポットを作成する
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, imageUrl, comment, latitude, longitude } =
    await request.json();

  if (
    typeof title !== "string" ||
    typeof comment !== "string" ||
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    (imageUrl !== undefined && typeof imageUrl !== "string") ||
    (description !== undefined && typeof description !== "string")
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const spot = await prisma.spot.create({
      data: {
        title,
        comment,
        description: description || "",
        imageUrl: imageUrl || "",
        latitude,
        longitude,
        user: { connect: { email: session.user.email } },
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