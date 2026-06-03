import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { canAccessPath, type UserRole } from "@/lib/rbac";

const publicRoutes = ["/login"];
const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
  const session = request.auth;

  if (!session?.user && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session?.user && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (session?.user && !canAccessPath(session.user.role as UserRole, pathname)) {
    return NextResponse.redirect(new URL("/dashboard?error=forbidden", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/auth).*)"],
};
