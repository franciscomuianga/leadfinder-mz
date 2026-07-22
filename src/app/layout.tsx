import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadFinder MZ",
  description: "Encontre negócios sem site em Moçambique e gere propostas automaticamente.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className="bg-brand-bg text-neutral-100 antialiased">{children}</body>
    </html>
  );
}
