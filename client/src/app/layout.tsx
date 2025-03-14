import type { Metadata } from "next";
import { Geist, Geist_Mono, Bagel_Fat_One, Montserrat_Alternates } from "next/font/google";
import "./globals.css";
import '@fortawesome/fontawesome-svg-core/styles.css'
import Providers from './providers'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bagelFont = Bagel_Fat_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bagel"
})

const montserratFont = Montserrat_Alternates({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-montserrat-alternates"
})

export const metadata: Metadata = {
  title: "HackCC - Hack Your Life",
  description: "HackCC. Hackathon built by and for community college students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        id="app"
        className={`${geistSans.variable} ${geistMono.variable} ${montserratFont.variable} ${bagelFont.variable} antialiased bg-royalpurple`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
