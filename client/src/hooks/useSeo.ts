import { useEffect } from "react";

interface SeoProps {
  title: string;
  description: string;
  canonicalPath?: string;
  /** Set true for pages that should NOT be indexed by search engines (404, admin, drafts). */
  noindex?: boolean;
}

/**
 * Lightweight SEO tag setter. Updates document.title and key meta tags on mount.
 * Avoids pulling in react-helmet just for this; sufficient for CSR meta tags.
 * (For true pre-render SEO, deploy with Vercel's prerendering or add SSR later —
 * noted as a follow-up since this MERN stack is CSR by default.)
 */
export function useSeo({ title, description, canonicalPath, noindex = false }: SeoProps) {
  useEffect(() => {
    document.title = `${title} | RupeeUncle`;

    setMetaTag("description", description);
    setMetaTag("og:title", title, "property");
    setMetaTag("og:description", description, "property");
    setMetaTag("twitter:title", title);
    setMetaTag("twitter:description", description);
    setMetaTag("robots", noindex ? "noindex, nofollow" : "index, follow");

    if (canonicalPath) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", `${window.location.origin}${canonicalPath}`);
    }
  }, [title, description, canonicalPath, noindex]);
}

function setMetaTag(name: string, content: string, attr: "name" | "property" = "name") {
  let tag = document.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}
