// app/layout.tsx (add metadata for better security)
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Horizon | Global Time Tracker",
  description:
    "Track timezones across the globe. See who's awake, asleep, or waking up.",
  manifest: "/manifest.json",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=yes",
  themeColor: "#0f172a",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Horizon",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
