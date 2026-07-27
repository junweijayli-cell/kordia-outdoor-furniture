import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KORDIA Outdoor Furniture Manufacturer | Foshan, China",
  description:
    "Factory-direct outdoor furniture from Foshan. Explore 500+ models across lounge, dining, shade, leisure, kitchens and public space.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    title: "KORDIA | Built for outdoor lifestyle.",
    description: "Factory-direct outdoor furniture from Foshan, China.",
    images: [{ url: "/images/og.png", width: 1734, height: 907, alt: "KORDIA outdoor furniture" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KORDIA | Built for outdoor lifestyle.",
    description: "Factory-direct outdoor furniture from Foshan, China.",
    images: ["/images/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable}`}>{children}</body>
    </html>
  );
}
