import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { readContentFile } from "@/lib/content/read";
import type { Settings } from "@/types/content";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  let settings: Settings;
  try {
    settings = await readContentFile<Settings>("settings");
  } catch {
    settings = {
      site: {
        title: "Mohana Priya — Full Stack Developer",
        description: "Full Stack Developer portfolio.",
        author: "Mohana Priya",
        keywords: [],
      },
      resume: { fileName: "Mohana_Priya_Resume.pdf", path: "/resume/Mohana_Priya_Resume.pdf" },
      admin: {},
    };
  }

  const { site } = settings;
  return {
    title: {
      default: site.title,
      template: "%s — Mohana Priya",
    },
    description: site.description,
    keywords: site.keywords,
    authors: [{ name: site.author }],
    creator: site.author,
    metadataBase: new URL(siteUrl),
    openGraph: {
      type: "website",
      url: siteUrl,
      title: site.title,
      description: site.description,
      siteName: site.title,
      images: site.ogImage
        ? [{ url: site.ogImage, width: 1200, height: 630, alt: site.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: site.title,
      description: site.description,
      creator: site.twitterHandle ? "@" + site.twitterHandle.replace(/^@/, "") : undefined,
      images: site.ogImage ? [site.ogImage] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f9fc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1324" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${geistMono.variable}`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}