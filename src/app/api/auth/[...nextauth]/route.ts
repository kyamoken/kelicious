import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// process.env.NEXTAUTH_SECRET が必ずセットされていることを保証する
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET を .env に設定してください");
}

// export を外して内部だけで使う
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email/Password",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (user && (await bcrypt.compare(credentials.password, user.password))) {
          return { id: user.id.toString(), email: user.email };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id as string;
      return token;
    },
    async session({ session, token }) {
      if (token.id) (session.user as any).id = token.id;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
};

// NextAuth ハンドラを生成し、GET/POST としてのみ export
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };