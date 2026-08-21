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
  description: "Custom, high-performance, immersive 3D web application for custom Algerian campervan conversions and off-grid overland builders in Algiers.",
  keywords: ["campervan", "Algeria", "3D builder", "van conversion", "off-grid", "overland", "Chéraga", "Algiers", "Kouini", "caravane"],
  authors: [{ name: "Kouini Caravane Engineering Team" }],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Kouini Caravane | Premier Algerian Campervans",
    description: "Design and build your premium off-grid campervan in immersive 3D. Hand-built in Zone Industrielle Chéraga, Algiers.",
    url: "https://kouinicaravane.dz",
    siteName: "Kouini Caravane",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kouini Caravane 3D Studio Preview",
      },
    ],
    locale: "fr_DZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kouini Caravane | Premier Algerian Campervans",
    description: "Design and build your premium off-grid campervan in immersive 3D. Hand-built in Algiers.",
    images: ["/og-image.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  "name": "Kouini Caravane",
  "description": "Premium custom campervan conversions and off-grid overland builders in Algiers, Algeria.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Zone Industrielle Chéraga",
    "addressLocality": "Algiers",
    "postalCode": "16014",
    "addressCountry": "DZ"
  },
  "telephone": "+213-555-12-34-56",
  "url": "https://kouinicaravane.dz",
  "priceRange": "$$$$"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased bg-[#0B0C10] text-white`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
