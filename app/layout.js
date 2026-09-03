import "./globals.css";
import HeaderNav from "./HeaderNav";

const SITE_URL = "https://www.hmtfinancialservices.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "HMT Success Academy & Financial Services",
  title: {
    default: "HMT Financial Services & HMT Success Academy | Founded by Muhammad Tufail",
    template: "%s | HMT Financial Services & Success Academy",
  },
  description:
    "HMT Financial Services & HMT Success Academy by Muhammad Tufail. Expert bookkeeping, financial reporting, Excel automation, ERP systems, digital services, ETEA KPPSC FPSC PPSC mock tests & free computer courses.",
  keywords: [
    "HMT Financial Services",
    "HMT Success Academy",
    "Muhammad Tufail",
    "Muhammad Tufail HMT",
    "Muhammad Tufail Financial Services",
    "ETEA KP Mock Test",
    "KPPSC Practice Test",
    "PPSC FPSC CSS Exam Portal",
    "Free Computer Course Pakistan",
    "HMT Student Portal",
    "Bookkeeping Services",
    "Financial Reporting",
    "Excel Automation",
    "ERP Accounting Systems",
    "Digital Business Solutions",
    "HMT Certificate Verification",
  ],
  authors: [{ name: "Muhammad Tufail", url: SITE_URL }],
  creator: "Muhammad Tufail",
  publisher: "HMT Financial Services & HMT Success Academy",
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "HMT Financial Services & Success Academy",
    title: "HMT Financial Services & HMT Success Academy | Founded by Muhammad Tufail",
    description:
      "Official portal for HMT Financial Services & HMT Success Academy by Muhammad Tufail. Premium bookkeeping, Excel automation, ERP solutions, ETEA KPPSC mock tests & free student courses.",
    images: [
      {
        url: "/hmt-logo-new.png",
        width: 1200,
        height: 630,
        alt: "HMT Financial Services & Success Academy - Muhammad Tufail",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HMT Financial Services & HMT Success Academy | Muhammad Tufail",
    description:
      "HMT Financial Services & Success Academy by Muhammad Tufail. Bookkeeping, ERP, Excel automation, ETEA KPPSC FPSC mock tests & free computer education.",
    images: ["/hmt-logo-new.png"],
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
    icon: "/hmt-logo-new.png",
    shortcut: "/hmt-logo-new.png",
    apple: "/hmt-logo-new.png",
  },
  verification: {
    google: "982W_dh6Z4IVJl5yVg82LZh_OqGq3SRzZiG1K_Tyapk",
  },
};

export const viewport = {
  themeColor: "#031735",
};

export default function RootLayout({ children }) {
  // Rich JSON-LD Structured Data Schema for Google Search Engine Indexing
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        "name": "HMT Financial Services",
        "url": SITE_URL,
        "logo": `${SITE_URL}/hmt-logo-new.png`,
        "founder": {
          "@type": "Person",
          "name": "Muhammad Tufail",
          "jobTitle": "Owner & Founder"
        },
        "sameAs": [
          "https://youtube.com/@hmtsuccessacademy",
          "https://www.facebook.com/HMTSuccessAcademy",
          "https://whatsapp.com/channel/0029Vb8QglDIHphB2UZcLW3H"
        ],
        "description": "Professional accounting, bookkeeping, ERP systems, Excel automation, and digital business solutions."
      },
      {
        "@type": "EducationalOrganization",
        "@id": `${SITE_URL}/#academy`,
        "name": "HMT Success Academy",
        "url": `${SITE_URL}/portal`,
        "logo": `${SITE_URL}/hmt-logo-new.png`,
        "founder": {
          "@type": "Person",
          "name": "Muhammad Tufail"
        },
        "description": "Educational academy offering free computer courses, ETEA & KPPSC competitive exam mock test portals, student ID cards, and verified certificate programs."
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        "name": "Muhammad Tufail",
        "jobTitle": "Founder & Director",
        "worksFor": {
          "@id": `${SITE_URL}/#organization`
        }
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        "url": SITE_URL,
        "name": "HMT Financial Services & Success Academy",
        "publisher": {
          "@id": `${SITE_URL}/#organization`
        }
      }
    ]
  };

  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-black m-0 p-0">
        <HeaderNav />
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
