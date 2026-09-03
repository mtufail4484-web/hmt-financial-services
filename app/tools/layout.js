const SITE_URL = "https://www.hmtfinancialservices.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Free Student Tools & Professional CV Generator | HMT Success Academy",
  description:
    "Free online student tools by Muhammad Tufail. Build professional CVs, practice MS Office shortcuts, calculate financial ratios, and access free productivity tools.",
  keywords: [
    "Free CV Maker Pakistan",
    "HMT Student Tools",
    "Muhammad Tufail Tools",
    "MS Office Shortcuts",
    "Financial Calculators Online",
    "Free Professional Resume Maker",
  ],
  alternates: {
    canonical: "/tools",
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/tools`,
    siteName: "HMT Success Academy",
    title: "Free Student Tools & Professional CV Generator | HMT Success Academy",
    description:
      "Free online student tools by Muhammad Tufail. Build professional CVs, practice MS Office shortcuts, calculate financial ratios, and access free productivity tools.",
    images: [{ url: "/hmt-logo-new.png", width: 1200, height: 630, alt: "Free Student Tools - HMT Success Academy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Student Tools & Professional CV Generator | HMT Success Academy",
    description:
      "Free online student tools by Muhammad Tufail. Build professional CVs, practice MS Office shortcuts, calculate financial ratios, and access free productivity tools.",
    images: ["/hmt-logo-new.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolsLayout({ children }) {
  return children;
}
