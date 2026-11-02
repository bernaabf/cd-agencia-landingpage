import type { MetadataRoute } from "next";
import { paisagens } from "@/data/paisagens";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${site.url}/`, changeFrequency: "monthly", priority: 1, images: paisagens.filter(p => p.destaque).map(p => `${site.url}${p.src}-2400.jpg`) }];
}
