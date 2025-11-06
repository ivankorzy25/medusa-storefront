import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Header } from "@/components/Header";
import { BRAND } from "@/lib/brand";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${BRAND.fullName} | ${BRAND.commercialName}`,
  description: `${BRAND.tagline}. Generadores eléctricos portátiles e industriales. ${BRAND.usps.join(". ")}.`,
  keywords: [
    "generadores eléctricos",
    "grupos electrógenos",
    "venta generadores",
    "alquiler generadores",
    "servicio técnico",
    "Argentina",
    "Buenos Aires",
  ],
  authors: [{ name: BRAND.name }],
  creator: BRAND.name,
  publisher: BRAND.name,
  openGraph: {
    title: `${BRAND.fullName}`,
    description: BRAND.tagline,
    type: "website",
    locale: "es_AR",
    siteName: BRAND.commercialName,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Header />
          {children}
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
