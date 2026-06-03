import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@/lib/rbac";

const authConfig = {
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id);
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;
