import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "一起学习Next-auth",
  description: "一起学习Next-auth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
