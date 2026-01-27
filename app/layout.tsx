import type { Metadata } from "next";
import { Playfair_Display, Inter, Fredoka } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

export const metadata: Metadata = {
  title: "My Kisah - Aseli Loh Ya",
  description: "A digital shrine for Kaoruko Waguri.",
  icons: {
    icon: "/assets/Logo.png",
    apple: "/assets/Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} ${fredoka.variable} antialiased bg-cream text-slate-900`}
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
