"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT } from "jose";

export async function login(prevState: { error?: string } | null, formData: FormData) {
  const password = formData.get("password");
  const correctPassword = process.env.ADMIN_PASSWORD;

  if (password === correctPassword && correctPassword) {
    const cookieStore = await cookies();
    
    // Create JWT Token
    const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET || "default-secret-key");
    const token = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);

    cookieStore.set("admin_session", token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
        sameSite: "strict"
    });
    
    redirect("/admin/characters");
  } else {
    return { error: "Invalid password" };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}
