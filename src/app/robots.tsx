import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/u/"],
        disallow: ["/dashboard", "/login", "/register", "/api/"],
      },
    ],
    sitemap: "https://linkpilot.app/sitemap.xml",
  };
}
