import PortalApp from "./PortalApp";

export const metadata = {
  title: "Student Portal — HMT Success Academy",
  description:
    "HMT Success Academy student portal: watch lectures, track your progress, and complete the free computer course.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PortalPage() {
  return <PortalApp />;
}
