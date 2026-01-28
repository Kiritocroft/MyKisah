import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPath = request.nextUrl.pathname === "/admin/login";
  
  const token = request.cookies.get("admin_session")?.value;
  let isValidSession = false;

  if (token) {
    try {
        const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET || "default-secret-key");
        await jwtVerify(token, secret);
        isValidSession = true;
    } catch (err) {
        isValidSession = false;
    }
  }

  if (isAdminPath && !isLoginPath) {
    if (!isValidSession) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (isLoginPath) {
     if (isValidSession) {
        return NextResponse.redirect(new URL("/admin/characters", request.url));
     }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
