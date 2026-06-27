import { Code2, Zap, ShieldAlert } from "lucide-react";
import { useSeo } from "../hooks/useSeo";

interface Endpoint {
  method: string;
  path: string;
  description: string;
  example?: string;
}

const CALCULATOR_ENDPOINTS: Endpoint[] = [
  { method: "GET", path: "/api/calculators", description: "List all calculators, optionally filtered by category." },
  { method: "GET", path: "/api/calculators/grouped", description: "All calculators grouped by category — useful for building a category navigation." },
  { method: "GET", path: "/api/calculators/:slug", description: "Get a single calculator's full config (inputs, outputs, FAQs) by its slug.", example: "/api/calculators/sip-calculator" },
];

const BLOG_ENDPOINTS: Endpoint[] = [
  { method: "GET", path: "/api/blogs", description: "List published blog posts, optionally filtered by category." },
  { method: "GET", path: "/api/blogs/:slug", description: "Get a single blog post's full content by its slug.", example: "/api/blogs/sip-vs-lumpsum-investment-strategy" },
];

const OTHER_ENDPOINTS: Endpoint[] = [
  { method: "GET", path: "/api/categories", description: "List all calculator and blog categories." },
  { method: "GET", path: "/api/dictionary", description: "List financial dictionary terms." },
  { method: "GET", path: "/api/health", description: "Health check — returns 200 OK if the API is running." },
  { method: "GET", path: "/sitemap.xml", description: "Dynamically generated XML sitemap, built live from the database." },
  { method: "GET", path: "/robots.txt", description: "Dynamically generated robots.txt." },
  { method: "POST", path: "/api/contact", description: "Submit a contact form message. Requires name, email, and message in the request body." },
];

function EndpointRow({ endpoint }: { endpoint: Endpoint }) {
  return (
    <div className="flex flex-col gap-1 border-b border-ink-100 py-3 last:border-0 dark:border-surface-500/40 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex items-center gap-2 sm:w-64 sm:shrink-0">
        <span
          className={`rounded-md px-2 py-0.5 text-xs font-bold ${
            endpoint.method === "GET"
              ? "bg-gain/10 text-gain dark:text-gain-dark"
              : "bg-gold-100 text-gold-700 dark:bg-surface-700 dark:text-gold-300"
          }`}
        >
          {endpoint.method}
        </span>
        <code className="font-mono text-sm text-ink-800 dark:text-ink-100">{endpoint.path}</code>
      </div>
      <p className="text-sm text-ink-500 dark:text-ink-400">{endpoint.description}</p>
    </div>
  );
}

export default function ApiDocsPage() {
  useSeo({
    title: "API for Developers",
    description: "RupeeUncle's public, read-only REST API for calculators and blog content.",
    canonicalPath: "/api-docs",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-xs font-medium text-gold-700 dark:bg-surface-700 dark:text-gold-300">
        <Code2 size={13} />
        Public API
      </span>
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink-900 dark:text-ink-50 sm:text-4xl">
        API for Developers
      </h1>
      <p className="mt-3 max-w-2xl text-ink-500 dark:text-ink-400">
        RupeeUncle exposes a free, public, read-only REST API covering our calculator
        configs and blog content. It's the same API our own frontend uses — nothing held
        back. Currently available without an API key, subject to the rate limit below.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="card-surface flex items-start gap-3 p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-gradient text-ink-950">
            <Zap size={18} />
          </span>
          <div>
            <p className="font-display text-sm font-semibold text-ink-900 dark:text-ink-50">
              Base URL
            </p>
            <code className="mt-1 block text-sm text-ink-500 dark:text-ink-400">
              https://rupeeuncle.com/api
            </code>
          </div>
        </div>
        <div className="card-surface flex items-start gap-3 p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-gradient text-ink-950">
            <ShieldAlert size={18} />
          </span>
          <div>
            <p className="font-display text-sm font-semibold text-ink-900 dark:text-ink-50">
              Rate Limit
            </p>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
              200 requests per 15 minutes, per IP, on all public endpoints.
            </p>
          </div>
        </div>
      </div>

      <div className="prose-article mt-10 text-ink-700 dark:text-ink-200">
        <h2 id="authentication">Authentication</h2>
        <p>
          All endpoints listed below are public and require no authentication or API key.
          Admin write endpoints (creating/editing calculators or blog posts) require a
          private admin key and are not intended for third-party use — they're not
          documented here on purpose.
        </p>
      </div>

      <div className="mt-8 space-y-10">
        <div>
          <h2 className="mb-1 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
            Calculators
          </h2>
          <div className="card-surface mt-3 divide-y divide-transparent p-5">
            {CALCULATOR_ENDPOINTS.map((e) => (
              <EndpointRow key={e.path} endpoint={e} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-1 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
            Blog
          </h2>
          <div className="card-surface mt-3 p-5">
            {BLOG_ENDPOINTS.map((e) => (
              <EndpointRow key={e.path} endpoint={e} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-1 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
            Other Endpoints
          </h2>
          <div className="card-surface mt-3 p-5">
            {OTHER_ENDPOINTS.map((e) => (
              <EndpointRow key={e.path} endpoint={e} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
            Example Request
          </h2>
          <pre className="overflow-x-auto rounded-xl2 bg-ink-900 p-4 text-sm text-ink-100 dark:bg-surface-800">
            <code>{`curl https://rupeeuncle.com/api/calculators/sip-calculator`}</code>
          </pre>
          <p className="mt-3 text-sm text-ink-500 dark:text-ink-400">
            Returns the full calculator config as JSON — inputs, outputs, FAQs, and
            category — the same data structure our own calculator pages render from.
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-xl2 border border-gold-200 bg-gold-50 p-5 text-sm text-ink-700 dark:border-surface-500/50 dark:bg-surface-800 dark:text-ink-200">
        <strong>Note:</strong> This API is provided as-is, free of charge, with no uptime
        guarantee. If you're building something that depends on it at scale, please{" "}
        <a href="/contact-us" className="font-medium text-gold-700 dark:text-gold-400">
          reach out
        </a>{" "}
        so we can make sure it stays available for your use case.
      </div>
    </div>
  );
}
