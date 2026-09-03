const SITE_URL = "https://www.hmtfinancialservices.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Free Live Computer Course Batch 02 | HMT Success Academy",
  description:
    "Join FREE live computer classes by Muhammad Tufail at HMT Success Academy. Learn Computer Basics, MS Word, Excel, PowerPoint, CV Making & Office Productivity with verified certificates.",
  keywords: [
    "Free Computer Course Pakistan",
    "HMT Success Academy Computer Course",
    "Muhammad Tufail Computer Classes",
    "MS Office Course Free",
    "Excel Training Online",
    "CV Design Course",
    "HMT Student Learning",
  ],
  alternates: {
    canonical: "/computer-course",
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/computer-course`,
    siteName: "HMT Success Academy",
    title: "Free Live Computer Course Batch 02 | HMT Success Academy",
    description:
      "Join FREE live computer classes by Muhammad Tufail at HMT Success Academy. Learn Computer Basics, MS Word, Excel, PowerPoint & Office Productivity.",
    images: [{ url: "/computer-course.jpg", width: 1200, height: 630, alt: "Free Computer Course - HMT Success Academy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Live Computer Course Batch 02 | HMT Success Academy",
    description:
      "Join FREE live computer classes by Muhammad Tufail at HMT Success Academy. Learn Computer Basics, MS Word, Excel, PowerPoint & Office Productivity.",
    images: ["/computer-course.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ComputerCourseLayout({ children }) {
  return children;
}
