import "@/app/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ThemeToggle";
import GradientBackground from "@/components/GradientBackground";
import { Pacifico } from 'next/font/google';

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
});

// Replace 'your-domain.com' with your actual domain
const websiteUrl = 'https://komorebi.aarin.me/ref/';

export const metadata: Metadata = {
  title: "Komorebi Chat",
  description: "Chat with Komorebi, your adorable AI companion",
  openGraph: {
    title: "Komorebi Chat",
    description: "Chat with Komorebi, your adorable AI companion",
    images: [`https://api.microlink.io?url=${encodeURIComponent(websiteUrl)}&screenshot=true&meta=false&embed=screenshot.url`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Komorebi Chat",
    description: "Chat with Komorebi, your adorable AI companion",
    images: [`https://api.microlink.io?url=${encodeURIComponent(websiteUrl)}&screenshot=true&meta=false&embed=screenshot.url`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="overflow-hidden">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <GradientBackground>
            <div className="flex h-screen flex-col">
              <header className="p-4 absolute top-0 right-0 z-10">
                <ModeToggle />
              </header>
              <main className="flex-1 overflow-auto">
                {children}
              </main>
            </div>
          </GradientBackground>
        </ThemeProvider>
      </body>
    </html>
  );
}