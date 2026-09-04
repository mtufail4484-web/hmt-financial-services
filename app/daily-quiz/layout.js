export const metadata = {
  title: "Daily ETEA & KPPSC MCQ Quiz of the Day (Streak) | HMT Success Academy",
  description:
    "Practice 5 fresh competitive exam MCQs every day. Track your daily streak, earn badges, and prepare for ETEA KP, KPPSC, FPSC, PPSC, and NTS exams with Muhammad Tufail.",
  keywords: [
    "Daily MCQ Quiz Pakistan",
    "ETEA daily quiz",
    "KPPSC MCQ of the day",
    "FPSC daily practice quiz",
    "Daily streak quiz",
    "HMT Success Academy daily quiz",
    "Muhammad Tufail daily quiz",
  ],
  openGraph: {
    title: "Daily MCQ Quiz of the Day | HMT Success Academy",
    description:
      "Test your competitive exam readiness every day with 5 fresh questions and maintain your practice streak!",
    url: "https://www.hmtfinancialservices.com/daily-quiz",
    siteName: "HMT Financial Services & Success Academy",
    images: [
      {
        url: "https://www.hmtfinancialservices.com/hmt-logo-new.png",
        width: 800,
        height: 800,
        alt: "HMT Success Academy Daily Quiz",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function DailyQuizLayout({ children }) {
  return <>{children}</>;
}
