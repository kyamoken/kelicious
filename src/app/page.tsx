import { prisma } from "@/lib/prisma";
import ClientHome from "./ClientHome";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export const revalidate = 0;

export default async function HomePage() {
  // サーバーコンポーネント内でセッションを取得
  const session = await getServerSession(authOptions);
  const canAdd = !!session;

  // DB から必要なフィールドだけ取得
  const spots = await prisma.spot.findMany({
    select: { id: true, title: true, latitude: true, longitude: true },
  });

  return <ClientHome spots={spots} canAdd={canAdd} />;
}