import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Immersive Energy System",
  description: "A cinematic 3D neural and energy system portfolio experience.",
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
