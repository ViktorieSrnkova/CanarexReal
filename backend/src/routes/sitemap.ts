import { Router } from "express";
import prisma from "../lib/db.js";

const router = Router();

router.get("/sitemap.xml", async (req, res) => {
  const listings = await prisma.inzeraty.findMany();
  const news = await prisma.aktuality.findMany();

  const langs = ["cs", "en", "sk"];

  const staticUrls = ["", "/contact", "/gdpr", "/listings"];

  const base = "https://canarex-real-public.vercel.app";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>

${langs
  .flatMap((lang) =>
    staticUrls.map(
      (url) => `
  <url>
    <loc>${base}/${lang}${url}</loc>
  </url>
`,
    ),
  )
  .join("")}

${langs
  .flatMap((lang) =>
    listings.map(
      (l) => `
  <url>
    <loc>${base}/${lang}/listings/${l.id}</loc>
    <lastmod>${l.datum_zmeny.toISOString()}</lastmod>
  </url>
`,
    ),
  )
  .join("")}

${langs
  .flatMap((lang) =>
    news.map(
      (n) => `
  <url>
    <loc>${base}/${lang}/news/${n.id}</loc>
  </url>
`,
    ),
  )
  .join("")}

</urlset>`;

  res.header("Content-Type", "application/xml");
  res.set("Cache-Control", "public, max-age=3600");
  res.send(xml);
});

export default router;
