import type { Metadata } from "next";
import Providers from "./providers/Providers";
import "./globals.css";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

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
      className={`${inter.className} ${inter.className} bg-background text-foreground antialiased transition-colors duration-500`}>
      <ThemeProvider>
          <Providers>
            {children}
            </Providers>
      </ThemeProvider>
      <Analytics/>
      </body>
    </html>
  );
}
