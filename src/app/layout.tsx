import type { Metadata } from "next";
import { Google_Sans, Google_Sans_Code } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/lib/analytics/posthog";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";

const googleSans = Google_Sans({ variable: "--font-sans" });
const googleSansCode = Google_Sans_Code({ variable: "--font-code" });

export const metadata: Metadata = {
  title: { default: "Onelink — One link for everything you share", template: "%s · Onelink" },
  description: "A fast, simple link-in-bio page. Add your links, reorder them, and see what gets clicked.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${googleSans.variable} ${googleSansCode.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <PostHogProvider>
            {children}
            <Analytics />
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
