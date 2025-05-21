import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash("admin", 10);
  await prisma.user.create({
    data: {
      email: "a@a.com",
      name: "admin",
      password: hashed,
      role: "ADMIN",
    },
  });
  console.log("✅ 管理者ユーザーを作成しました");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });