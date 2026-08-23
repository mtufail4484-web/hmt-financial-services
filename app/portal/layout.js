export const metadata = {
  title: "HMT Success Academy Student Portal",
  description:
    "Login or register for the HMT Success Academy student portal to access computer course lectures, assignments, progress tracking, student card, certificate status, and upcoming AI course updates.",
  alternates: {
    canonical: "/portal",
  },
  openGraph: {
    type: "website",
    url: "/portal",
    siteName: "HMT Success Academy",
    title: "HMT Success Academy Student Portal",
    description:
      "Access HMT Success Academy computer course lectures, assignments, student card, progress tracking, certificate status, and upcoming AI course updates.",
    images: [
      {
        url: "/hmt-logo-new.png",
        width: 1200,
        height: 630,
        alt: "HMT Success Academy Student Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HMT Success Academy Student Portal",
    description:
      "Access HMT Success Academy computer course lectures, assignments, student card, progress tracking, certificate status, and upcoming AI course updates.",
    images: ["/hmt-logo-new.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PortalLayout({ children }) {
  return children;
}
