import type {
  Metadata,
} from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable:
    "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable:
    "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default:
      "Cuenta Clara | Calcula tu finiquito o liquidación en México",
    template:
      "%s | Cuenta Clara",
  },

  description:
    "Estima tu finiquito, liquidación y derechos laborales en México antes de aceptar una oferta o firmar tu salida.",

  keywords: [
    "finiquito México",
    "calculadora finiquito",
    "liquidación México",
    "calculadora liquidación",
    "despido México",
    "indemnización laboral",
    "renuncia México",
    "Ley Federal del Trabajo",
  ],

  openGraph: {
    title:
      "Cuenta Clara | Ponle números a tu salida del trabajo",
    description:
      "Entiende cuánto dinero está en juego antes de aceptar o firmar una salida laboral.",
    type: "website",
    locale: "es_MX",
    siteName: "Cuenta Clara",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <html lang="es-MX">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}