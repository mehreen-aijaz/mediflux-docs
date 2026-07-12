import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "next-themes";
import favicon from "./favicon.png";
import { OG_IMAGES } from "@/lib/og";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const siteTitle = "MediFlux Documentation";
const siteDescription =
  "Comprehensive documentation for MediFlux - the pharmacy and healthcare management platform.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteTitle,
    template: "%s | MediFlux Docs",
  },
  description: siteDescription,
  icons: {
    icon: favicon.src,
  },
  openGraph: {
    type: "website",
    siteName: "MediFlux Docs",
    locale: "en_IN",
    title: siteTitle,
    description: siteDescription,
    url: SITE_URL,
    images: OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: OG_IMAGES,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
