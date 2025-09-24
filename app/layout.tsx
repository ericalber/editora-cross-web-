import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../style/premium.css";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/src/commerce/CartContext";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { FeatureLogger } from "@/components/ui/FeatureLogger";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://editoracross.com";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Editora Cross",
    template: "%s | Editora Cross",
  },
  description:
    "Conteúdo bíblico, catálogo de livros e notícias da Editora Cross para igrejas, líderes e comunidades de fé.",
  openGraph: {
    siteName: "Editora Cross",
    type: "website",
    images: [
      {
        url: "/images/og-default.svg",
        width: 1200,
        height: 630,
        alt: "Editora Cross",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-8793490446"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-8793490446');
          `}
        </Script>
        <ThemeProvider>
          <CartProvider>
            <FeatureLogger />
            <Navbar />
            {children}
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
