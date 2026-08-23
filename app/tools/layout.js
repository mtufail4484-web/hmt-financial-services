export const metadata = {
  title: {
    absolute: "Free Student Calculators, GPA & Result Card Generator | HMT Services",
  },
  description:
    "Calculate academic grades instantly with our Free Student Calculators. Features a standard Marksheet generator, university GPA calculator, age finder, percentage calculator, and accurate Zakat & Income Tax calculators updated for Pakistan 2026.",
  keywords: [
    "free student calculators Pakistan",
    "GPA calculator Pakistan",
    "marksheet generator",
    "result card generator",
    "percentage calculator",
    "age calculator",
    "Pakistan income tax calculator 2026",
    "Zakat calculator Pakistan",
    "HMT Financial and Digital Services",
  ],
  alternates: {
    canonical: "/tools",
  },
  openGraph: {
    type: "website",
    url: "/tools",
    siteName: "HMT Financial and Digital Services",
    title: "Free Student Calculators, GPA & Result Card Generator | HMT Services",
    description:
      "Calculate grades, GPA, age, percentages, Zakat, income tax, and printable marksheet result cards with free HMT Services tools for Pakistan students.",
    images: [
      {
        url: "/hmt-logo-new.png",
        width: 1200,
        height: 630,
        alt: "HMT Services Free Student Calculators and Result Card Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Student Calculators, GPA & Result Card Generator | HMT Services",
    description:
      "Use free GPA, marksheet, percentage, age, Zakat, and income tax calculators from HMT Financial and Digital Services.",
    images: ["/hmt-logo-new.png"],
  },
};

export default function ToolsLayout({ children }) {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Free Student Calculators by HMT Services",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    url: "https://www.hmtfinancialservices.com/tools",
    description:
      "Free student calculators for Pakistan including GPA Calculator, Marksheet Generator, Percentage Utility, Age Finder, Zakat Calculator, and Income Tax Calculator.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "PKR",
    },
    provider: {
      "@type": "Organization",
      name: "HMT Financial and Digital Services",
      url: "https://www.hmtfinancialservices.com",
    },
    featureList: [
      "GPA Calculator",
      "Marksheet Generator",
      "Percentage Utility",
      "Age Finder",
      "Zakat Calculator Pakistan",
      "Income Tax Calculator Pakistan 2026",
      "Printable Result Card Generator",
    ],
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I calculate the percentage of my exam marks?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Enter your obtained marks and total marks in the Percentage Mark Calculator. The tool divides obtained marks by total marks and multiplies the result by 100 to show your exam percentage instantly.",
        },
      },
      {
        "@type": "Question",
        name: "How does the online GPA calculator compute semester grades?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The GPA calculator multiplies each subject grade point by its credit hours, adds all quality points, and divides the total by credit hours to estimate your semester GPA.",
        },
      },
      {
        "@type": "Question",
        name: "Are the Zakat and Income Tax rates aligned with Pakistan regulations?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Zakat calculator uses the standard 2.5% rate with gold and silver Nisab values, while the Income Tax calculator follows the Pakistan slab structure added for 2026 educational estimates. Always confirm final religious or tax decisions with a qualified scholar or tax professional.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
