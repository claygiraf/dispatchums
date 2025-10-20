import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: "DISPATCHUMS - Smarter Emergency Dispatch",
  description: "Streamline your emergency response with our intelligent Priority Dispatch System.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>{children}</body>
    </html>
  );
}