import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/fraunces/300.css";
import "@fontsource/fraunces/300-italic.css";
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/600.css";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
