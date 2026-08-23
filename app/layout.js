import "./globals.css";
import HeaderNav from "./HeaderNav";

const SITE_URL = "https://www.hmtfinancialservices.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "HMT Success Academy",
  title: {
    default: "HMT Financial and Digital Services",
    template: "%s | HMT Financial and Digital Services",
  },
  description:
    "Professional accounting, ERP, website, mobile app development, digital services, and HMT Success Academy student learning portal.",
  keywords: [
    "HMT Financial Services",
    "HMT Success Academy",
    "student portal",
    "computer course",
    "digital services",
    "accounting services",
    "ERP services",
  ],
  authors: [{ name: "HMT Financial and Digital Services" }],
  creator: "HMT Financial and Digital Services",
  publisher: "HMT Financial and Digital Services",
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "HMT Financial and Digital Services",
    title: "HMT Financial and Digital Services",
    description:
      "Professional accounting, ERP, website, mobile app development, digital services, and HMT Success Academy student learning portal.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "HMT Financial and Digital Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HMT Financial and Digital Services",
    description:
      "Professional accounting, ERP, website, mobile app development, digital services, and HMT Success Academy student learning portal.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: "HMT Success Academy",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  verification: {
    google: "982W_dh6Z4IVJl5yVg82LZh_OqGq3SRzZiG1K_Tyapk",
  },
};

export const viewport = {
  themeColor: "#031735",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-black m-0 p-0">
        <HeaderNav />

        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
