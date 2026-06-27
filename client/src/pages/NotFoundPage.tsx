import { Link } from "react-router-dom";
import { useSeo } from "../hooks/useSeo";

export default function NotFoundPage() {
  useSeo({
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist or has moved.",
    noindex: true,
  });

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl font-semibold text-ink-200 dark:text-ink-700">404</p>
      <h1 className="mt-3 font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
        Page not found
      </h1>
      <p className="mt-2 text-ink-500">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link to="/" className="btn-primary mt-6">Back to Home</Link>
    </div>
  );
}
