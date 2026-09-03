const SITE_URL = "https://www.hmtfinancialservices.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Free Educational Services & Student Resources | HMT Success Academy",
  description:
    "Explore free educational resources by Muhammad Tufail at HMT Success Academy. Free ETEA & KPPSC mock tests, live computer course, CV generators, and certificate verification.",
  keywords: [
    "HMT Free Services",
    "HMT Success Academy Free Resources",
    "Muhammad Tufail",
    "ETEA KP Mock Test",
    "KPPSC Practice Test",
    "Free Computer Course",
    "Student CV Maker",
    "Certificate Verification",
  ],
  alternates: {
    canonical: "/free-services",
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/free-services`,
    siteName: "HMT Success Academy",
    title: "Free Educational Services & Student Resources | HMT Success Academy",
    description:
      "Free ETEA & KPPSC competitive exam mock tests, live computer training, student CV tools, and certificate verification by Muhammad Tufail.",
    images: [{ url: "/hmt-logo-new.png", width: 1200, height: 630, alt: "HMT Free Services Hub - Muhammad Tufail" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Educational Services & Student Resources | HMT Success Academy",
    description:
      "Free ETEA & KPPSC competitive exam mock tests, live computer training, student CV tools, and certificate verification by Muhammad Tufail.",
    images: ["/hmt-logo-new.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FreeServicesLayout({ children }) {
  return children;
}
