import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { FileText, LogOut, ExternalLink, MessageSquare } from "lucide-react";
import { isAdminLoggedIn, clearAdminKey } from "../../utils/adminApiClient";
import { useEffect } from "react";

/**
 * Shell for every /admin/* page. Guards access by redirecting to /admin/login if no
 * admin key is present in sessionStorage — this is a client-side convenience redirect
 * only, NOT real security (the actual enforcement is server-side in adminAuth.js; a
 * request without a valid key is rejected by the backend regardless of what the
 * frontend does). Hiding the UI without a key just avoids showing forms that would
 * immediately fail.
 */
export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAdminLoggedIn() && location.pathname !== "/admin/login") {
      navigate("/admin/login");
    }
  }, [location.pathname, navigate]);

  function handleLogout() {
    clearAdminKey();
    navigate("/admin/login");
  }

  if (!isAdminLoggedIn()) return null;

  return (
    <div className="flex min-h-screen bg-ink-50 dark:bg-surface-900">
      <aside className="hidden w-60 shrink-0 border-r border-ink-100 bg-white p-4 dark:border-surface-500/40 dark:bg-surface-800 sm:block">
        <div className="mb-6 flex items-center gap-2 px-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-gradient text-ink-950 font-display text-sm font-bold">
            R
          </span>
          <div>
            <p className="font-display text-sm font-semibold text-ink-900 dark:text-ink-50">
              RupeeUncle
            </p>
            <p className="text-[11px] text-ink-400">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-1">
          <Link
            to="/admin/blogs"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-surface-700"
          >
            <FileText size={16} />
            Blog Posts
          </Link>
          <Link
            to="/admin/contact"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-surface-700"
          >
            <MessageSquare size={16} />
            Contact Submissions
          </Link>
          <a
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-500 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-surface-700"
          >
            <ExternalLink size={16} />
            View Public Blog
          </a>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-8 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-loss hover:bg-loss/10 dark:text-loss-dark"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </aside>

      <main className="min-w-0 flex-1 p-5 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}
