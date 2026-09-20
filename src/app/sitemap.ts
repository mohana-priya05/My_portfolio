import type { MetadataRoute } from "next";
import { readContentFile } from "@/lib/content/read";
import type { Projects } from "@/types/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  try {
    const { projects } = await readContentFile<Projects>("projects");
    for (const project of projects) {
      paths.push({
        url: siteUrl + "/projects/" + project.slug,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  } catch {
    // Sitemap should not break the build if content is missing.
  }

  return paths;
}