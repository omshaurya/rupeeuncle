interface Props {
  html: string;
}

/**
 * Renders blog article HTML content with consistent prose styling.
 *
 * Content here is authored/seeded by the site's own admin/content team (via the admin
 * panel or seed scripts) — not arbitrary third-party or user-submitted input — so
 * rendering it as HTML is an accepted content-management pattern, the same way any CMS
 * (WordPress, Contentful, etc.) renders author-authored rich text. This is not a public
 * comment system or user-generated content surface.
 */
export default function ArticleBody({ html }: Props) {
  return (
    <div
      className="prose-article max-w-none text-ink-700 dark:text-ink-200"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
