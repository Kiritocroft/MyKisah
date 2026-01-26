"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(prevState: { error?: string } | null, formData: FormData) {
  const password = formData.get("password");

  // Hardcoded password for demo purposes
  // In a real app, use environment variables or database
  if (password === "admin123") {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 // 1 day
    });
    redirect("/admin/photos");
  } else {
    return { error: "Invalid password" };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}
