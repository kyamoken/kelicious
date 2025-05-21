import { prisma } from "@/lib/prisma";
import ClientHome from "./ClientHome";

export const revalidate = 0;

export default async function HomePage() {
  // ここはサーバーコンポーネントなので useRouter は使わない
  const spots = await prisma.spot.findMany({
    select: { id: true, title: true, latitude: true, longitude: true },
  });

  return <ClientHome spots={spots} />;
}