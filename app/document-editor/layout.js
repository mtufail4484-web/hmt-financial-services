const SITE_URL = "https://www.hmtfinancialservices.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Free Mobile MS Word to PDF Creator & Rich Document Editor | HMT Success Academy",
  description:
    "Create, format, and convert rich text documents to PDF online on mobile and desktop. Supports Urdu (Jameel Noori Nastaleeq), English (Times New Roman), and Arabic (Sakal Majalla / Amiri) fonts.",
  keywords: [
    "Online MS Word Alternative",
    "Mobile Word to PDF Converter",
    "Jameel Noori Nastaleeq PDF Editor",
    "Urdu Document Generator",
    "Times New Roman PDF Editor",
    "Sakal Majalla Arabic Document Creator",
    "HMT Rich Text Editor",
    "Free PDF Creator Pakistan",
  ],
  alternates: {
    canonical: "/document-editor",
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/document-editor`,
    siteName: "HMT Success Academy",
    title: "Free Mobile MS Word to PDF Creator & Rich Document Editor",
    description:
      "Create, format, and convert rich text documents to PDF online. Built for mobile and desktop with Urdu, English, and Arabic font support.",
    images: [{ url: "/hmt-logo-new.png", width: 1200, height: 630, alt: "Free Document Editor & PDF Creator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Mobile MS Word to PDF Creator & Rich Document Editor",
    description:
      "Create, format, and convert rich text documents to PDF online. Built for mobile and desktop with Urdu, English, and Arabic font support.",
    images: ["/hmt-logo-new.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DocumentEditorLayout({ children }) {
  return children;
}
