import { Outfit } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/ui/LayoutWrapper";

// Using Outfit font for a premium, modern automotive feel
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "Kouini Caravane | Premier Algerian Campervans",
  description: "Custom, high-performance, immersive web application for Algerian campervan conversion.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased bg-[#0B0C10] text-white`} suppressHydrationWarning>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
