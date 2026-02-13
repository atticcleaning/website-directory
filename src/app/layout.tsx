import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Source_Serif_4, Lora } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "AtticCleaning.com - Find Top-Rated Attic Cleaning Companies",
  description:
    "Search and compare attic cleaning specialists near you. Browse ratings, reviews, and service tags for insulation removal, rodent cleanup, decontamination, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} ${sourceSerif4.variable} ${lora.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
