const SITE_URL = "https://www.hmtfinancialservices.com";

export default function sitemap() {
  const now = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/free-services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/past-papers`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/daily-quiz`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/mock-test`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/portal`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.90,
    },
    {
      url: `${SITE_URL}/computer-course`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.90,
    },
    {
      url: `${SITE_URL}/tools`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/verify`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.80,
    },
    {
      url: `${SITE_URL}/computer-course/cv-template`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.70,
    },
    {
      url: `${SITE_URL}/computer-course/microsoft-office`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.70,
    },
  ];
}
