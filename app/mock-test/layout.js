import "../globals.css";

const SITE_URL = "https://www.hmtfinancialservices.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ETEA, KPPSC, PPSC, FPSC & CSS Mock Test Portal | HMT Success Academy - Muhammad Tufail",
  description:
    "Free ETEA KP, KPPSC, PPSC, FPSC, CSS, NTS & Banking mock test portal by Muhammad Tufail at HMT Success Academy. Features skip MCQ option, live progress bar, auto-review mode & instant scorecard certificates.",
  keywords: [
    "ETEA KP Mock Test",
    "KPPSC Mock Test",
    "PPSC Practice Test",
    "FPSC Mock Test",
    "CSS Exam Portal",
    "HMT Success Academy Mock Test",
    "Muhammad Tufail Mock Test Portal",
    "ETEA MCQs Skip Option",
    "NTS GAT Practice Test",
    "Banking Exam Preparation",
  ],
  alternates: {
    canonical: "/mock-test",
  },
  openGraph: {
    title: "ETEA, KPPSC, PPSC, FPSC & CSS Mock Test Portal | HMT Success Academy - Muhammad Tufail",
    description:
      "Practice authentic ETEA, KPPSC, PPSC, FPSC & CSS mock tests with live timers, skip question engine, detailed solutions, and instant performance scorecards.",
    url: `${SITE_URL}/mock-test`,
    siteName: "HMT Success Academy",
    images: [{ url: "/hmt-logo-new.png", width: 1200, height: 630, alt: "HMT Success Academy Mock Test Portal - Muhammad Tufail" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ETEA, KPPSC, PPSC, FPSC & CSS Mock Test Portal | HMT Success Academy - Muhammad Tufail",
    description:
      "Practice ETEA KP, KPPSC, PPSC, FPSC, and CSS competitive exams with live mock tests, skip options, and detailed analytics.",
    images: ["/hmt-logo-new.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MockTestLayout({ children }) {
  return children;
}
