import axios from "axios";

const ADMIN_KEY_STORAGE = "rupeeuncle_admin_key";

/**
 * Separate axios instance for admin endpoints. Auto-injects the x-admin-key header on
 * every request from sessionStorage (not localStorage) — sessionStorage clears when the
 * browser tab closes, which is a reasonable default given this project has no real
 * login/JWT system, just a single shared secret key (see server/src/middleware/adminAuth.js).
 *
 * This is NOT a substitute for real authentication if RupeeUncle ever has multiple admin
 * users needing distinct permissions or audit trails — it's the same single-shared-key
 * model the backend already implements, just consumed correctly from the frontend.
 */
const adminApiClient = axios.create({
  baseURL: "/api/admin",
  timeout: 15000,
});

adminApiClient.interceptors.request.use((config) => {
  const key = sessionStorage.getItem(ADMIN_KEY_STORAGE);
  if (key) {
    config.headers["x-admin-key"] = key;
  }
  return config;
});

export function setAdminKey(key: string) {
  sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
}

export function clearAdminKey() {
  sessionStorage.removeItem(ADMIN_KEY_STORAGE);
}

export function getAdminKey(): string | null {
  return sessionStorage.getItem(ADMIN_KEY_STORAGE);
}

export function isAdminLoggedIn(): boolean {
  return !!getAdminKey();
}

export default adminApiClient;
