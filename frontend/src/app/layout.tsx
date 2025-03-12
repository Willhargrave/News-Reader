import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./providers/Providers";
import "./globals.css";
import { ThemeProvider } from "@/app/providers/ThemeProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Just the News",
  description: "A site for just checking the news",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
      className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased transition-colors duration-500`}>
      <ThemeProvider>
          <Providers>{children}</Providers>
      </ThemeProvider>
      </body>
    </html>
  );
}
