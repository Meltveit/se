// src/components/layout/Layout.tsx
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "@/styles/globals.css";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>
      <Footer />
      {/* Legg til suppressHydrationWarning på body hvis det er her problemet oppstår */}
      <body suppressHydrationWarning={true} />
    </div>
  );
}