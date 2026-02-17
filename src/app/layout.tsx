import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Source_Serif_4, Lora } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
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
  style: ["normal"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500"],
  style: ["normal"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://atticcleaning.com"
  ),
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
        className={`${plusJakartaSans.variable} ${sourceSerif4.variable} ${lora.variable} flex min-h-screen flex-col antialiased`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main" role="main" className="mx-auto w-full flex-1 max-w-[1200px] px-4 md:px-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
