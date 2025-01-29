import { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Sistema Tarrafa",
    default: "Sistema Tarrafa",
  },
  description:
    "Solução para integrar e acompanhar as informações de desempenho dos PPGs",
  metadataBase: new URL("https://tarrafa.unimontes.br/"),
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
