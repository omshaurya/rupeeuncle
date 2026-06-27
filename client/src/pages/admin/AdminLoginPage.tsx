import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ShieldAlert } from "lucide-react";
import { setAdminKey, isAdminLoggedIn } from "../../utils/adminApiClient";
import adminApiClient from "../../utils/adminApiClient";
import { useSeo } from "../../hooks/useSeo";

/**
 * Admin login. There's no real username/password/JWT system here (per this project's
 * design — see adminAuth.js) — just a single shared secret key the backend checks against
 * ADMIN_API_KEY in its .env file. This page does NOT verify the password itself; it sets
 * the entered value as the candidate key, then makes a real authenticated request to the
 * backend and checks whether that request succeeds (200) or is rejected (401). This is the
 * only honest way to "check a password" against a system that has no separate
 * authentication endpoint — the backend's existing protected routes ARE the verification.
 */
export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "error">("idle");

  useSeo({
    title: "Admin Login",
    description: "RupeeUncle admin panel login.",
    noindex: true,
  });

  useEffect(() => {
    if (isAdminLoggedIn()) {
      navigate("/admin/blogs");
    }
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("checking");
    setAdminKey(password);

    try {
      // Use the real admin blogs list endpoint purely as a verification probe — if the
      // key is wrong, adminAuth.js middleware on the backend returns 401 and we catch it
      // below. If it's right, this also happens to pre-warm the data the next page needs.
      await adminApiClient.get("/blogs?limit=1");
      navigate("/admin/blogs");
    } catch (err) {
      setStatus("error");
      setAdminKey(""); // clear the bad key so it isn't sent on subsequent public requests
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="card-surface w-full max-w-sm p-8">
        <div className="flex justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl2 bg-gold-gradient text-ink-950">
            <Lock size={22} />
          </span>
        </div>
        <h1 className="mt-4 text-center font-display text-xl font-semibold text-ink-900 dark:text-ink-50">
          Admin Access
        </h1>
        <p className="mt-1 text-center text-sm text-ink-500 dark:text-ink-400">
          Enter the admin key to manage blog posts.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
              Admin Key
            </label>
            <input
              id="password"
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-800 dark:border-surface-500 dark:bg-surface-700 dark:text-ink-50"
            />
          </div>

          {status === "error" && (
            <p className="flex items-center gap-1.5 rounded-lg bg-loss/10 px-3 py-2 text-sm text-loss dark:text-loss-dark">
              <ShieldAlert size={15} />
              Incorrect admin key.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "checking"}
            className="btn-primary w-full disabled:opacity-60"
          >
            {status === "checking" ? "Checking..." : "Sign In"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-ink-400">
          This matches the <code>ADMIN_API_KEY</code> set in your server's .env file.
        </p>
      </div>
    </div>
  );
}
