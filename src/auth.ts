import NextAuth, { type DefaultSession } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import authConfig from "@/auth.config";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { getRequiredEnv } from "@/lib/env";
import type { UserRole } from "@/lib/rbac";

void (null as unknown as JWT);

declare module "next-auth" {
  interface User {
    role: UserRole;
  }

  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: getRequiredEnv("AUTH_SECRET"),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const [user] = await getDb().select().from(users).where(eq(users.email, email)).limit(1);
        if (!user || !user.isActive) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
});
