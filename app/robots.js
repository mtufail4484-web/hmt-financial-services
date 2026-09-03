const SITE_URL = "https://www.hmtfinancialservices.com";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/free-services", "/mock-test", "/computer-course", "/portal", "/tools", "/verify"],
        disallow: ["/api/", "/_next/", "/sw.js"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
