import "../globals.css";

const SITE_URL = "https://www.hmtfinancialservices.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Competitive Exam Mock Test Student Portal | HMT Success Academy",
  description:
    "Free online competitive exam mock test portal for CSS, PMS, PPSC, FPSC, NTS, Banking, MDCAT, ECAT, and IT Specialist exams with real-time timers, negative marking analysis, and detailed explanations.",
  keywords: [
    "Competitive Exam Mock Test",
    "PPSC Mock Test",
    "FPSC Practice Test",
    "NTS Online Test",
    "CSS Exam Portal",
    "HMT Student Portal",
    "General Knowledge MCQs",
    "Pakistan Studies MCQs",
    "Everyday Science Test",
    "Banking Exam Mock Test",
  ],
  openGraph: {
    title: "Competitive Exam Mock Test Student Portal | HMT Success Academy",
    description:
      "Practice competitive exam mock tests with live timers, detailed solutions, and instant performance scorecards.",
    url: `${SITE_URL}/mock-test`,
    siteName: "HMT Financial and Digital Services",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "HMT Success Academy Mock Test Portal" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Competitive Exam Mock Test Student Portal | HMT Success Academy",
    description:
      "Prepare for CSS, PPSC, FPSC, NTS, and Banking competitive exams with live mock tests and detailed analytics.",
    images: ["/logo.png"],
  },
};

export default function MockTestLayout({ children }) {
  return children;
}
