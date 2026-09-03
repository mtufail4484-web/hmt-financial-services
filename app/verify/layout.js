const SITE_URL = "https://www.hmtfinancialservices.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Official Student Certificate & ID Card Verification | HMT Success Academy",
  description:
    "Official verification portal for HMT Success Academy certificates and student ID cards founded by Muhammad Tufail. Scan QR codes or enter Roll Numbers for instant verification.",
  keywords: [
    "HMT Certificate Verification",
    "HMT Success Academy Student Verification",
    "Muhammad Tufail Academy Verification",
    "Verify Roll Number",
    "Student ID QR Code Verification",
  ],
  alternates: {
    canonical: "/verify",
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/verify`,
    siteName: "HMT Success Academy",
    title: "Official Student Certificate & ID Card Verification | HMT Success Academy",
    description:
      "Official verification portal for HMT Success Academy certificates and student ID cards founded by Muhammad Tufail.",
    images: [{ url: "/hmt-logo-new.png", width: 1200, height: 630, alt: "HMT Certificate Verification" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Official Student Certificate & ID Card Verification | HMT Success Academy",
    description:
      "Official verification portal for HMT Success Academy certificates and student ID cards founded by Muhammad Tufail.",
    images: ["/hmt-logo-new.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function VerifyLayout({ children }) {
  return children;
}
