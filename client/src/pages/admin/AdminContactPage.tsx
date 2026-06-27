import { useEffect, useState } from "react";
import { Trash2, Mail, MailOpen, MessageSquareReply, Archive, ChevronDown, ChevronUp, Phone } from "lucide-react";
import adminApiClient from "../../utils/adminApiClient";
import { useSeo } from "../../hooks/useSeo";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  ipAddress?: string;
  createdAt: string;
}

type StatusFilter = "all" | "new" | "read" | "replied" | "archived";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-gold-100 text-gold-800 dark:bg-gold-900/30 dark:text-gold-300",
  read: "bg-ink-100 text-ink-600 dark:bg-surface-700 dark:text-ink-300",
  replied: "bg-gain/10 text-gain dark:text-gain-dark",
  archived: "bg-loss/10 text-loss dark:text-loss-dark",
};

const FILTER_TABS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "read", label: "Read" },
  { key: "replied", label: "Replied" },
  { key: "archived", label: "Archived" },
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminContactPage() {
  useSeo({ title: "Contact Submissions", description: "Admin contact messages", noindex: true });

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  function load(p = page) {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: "20" });
    if (statusFilter !== "all") params.set("status", statusFilter);
    adminApiClient
      .get(`/contact-messages?${params}`)
      .then((res) => {
        setMessages(res.data.data);
        setTotal(res.data.total);
        setTotalPages(res.data.pages);
      })
      .catch(() => setError("Couldn't load messages — is the backend running?"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    setPage(1);
    load(1);
  }, [statusFilter]);

  async function updateStatus(id: string, status: ContactMessage["status"]) {
    setUpdatingId(id);
    try {
      await adminApiClient.put(`/contact-messages/${id}`, { status });
      setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, status } : m)));
    } catch {
      setError("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm("Delete this message permanently?")) return;
    try {
      await adminApiClient.delete(`/contact-messages/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      setTotal((t) => t - 1);
    } catch {
      setError("Failed to delete message.");
    }
  }

  const filtered = statusFilter === "all"
    ? messages
    : messages.filter((m) => m.status === statusFilter);

  const newCount = messages.filter((m) => m.status === "new").length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
            Contact Submissions
          </h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            {total} message{total !== 1 ? "s" : ""}
            {newCount > 0 && (
              <span className="ml-2 rounded-full bg-gold-100 px-2 py-0.5 text-xs font-semibold text-gold-800 dark:bg-gold-900/30 dark:text-gold-300">
                {newCount} new
              </span>
            )}
          </p>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-loss/10 px-4 py-2.5 text-sm text-loss dark:text-loss-dark">
          {error}
        </p>
      )}

      {/* Status filter tabs */}
      <div className="mb-5 flex gap-1 rounded-xl border border-ink-100 bg-white p-1 dark:border-surface-500/40 dark:bg-surface-800">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              statusFilter === tab.key
                ? "bg-ink-800 text-white dark:bg-gold-400 dark:text-ink-950"
                : "text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Messages list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-20 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-ink-100 bg-white py-16 text-center dark:border-surface-500/40 dark:bg-surface-800">
          <p className="text-sm text-ink-400">No messages found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => {
            const isExpanded = expandedId === msg._id;
            return (
              <div
                key={msg._id}
                className={`card-surface overflow-hidden transition-shadow ${
                  msg.status === "new" ? "border-l-4 border-l-gold-400" : ""
                }`}
              >
                {/* Row header — click to expand */}
                <button
                  type="button"
                  onClick={() => {
                    setExpandedId(isExpanded ? null : msg._id);
                    if (msg.status === "new") updateStatus(msg._id, "read");
                  }}
                  className="flex w-full items-start gap-4 p-5 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-ink-900 dark:text-ink-50">
                        {msg.name}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[msg.status]}`}>
                        {msg.status}
                      </span>
                      <span className="text-xs text-ink-400">{timeAgo(msg.createdAt)}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-ink-500 dark:text-ink-400">
                      {msg.email}{msg.phone ? ` · ${msg.phone}` : ""}
                    </p>
                    <p className="mt-1 text-sm font-medium text-ink-700 dark:text-ink-200 truncate">
                      {msg.subject}
                    </p>
                    {!isExpanded && (
                      <p className="mt-0.5 text-sm text-ink-400 truncate">{msg.message}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-ink-400">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>

                {/* Expanded body */}
                {isExpanded && (
                  <div className="border-t border-ink-100 px-5 pb-5 pt-4 dark:border-surface-600">
                    <div className="mb-4 grid gap-3 rounded-lg bg-ink-50 p-4 text-sm dark:bg-surface-700 sm:grid-cols-2">
                      <div>
                        <span className="text-xs font-medium uppercase tracking-wide text-ink-400">Name</span>
                        <p className="mt-0.5 text-ink-800 dark:text-ink-100">{msg.name}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium uppercase tracking-wide text-ink-400">Email</span>
                        <p className="mt-0.5">
                          <a href={`mailto:${msg.email}`} className="text-gold-600 hover:underline dark:text-gold-400">
                            {msg.email}
                          </a>
                        </p>
                      </div>
                      {msg.phone && (
                        <div>
                          <span className="text-xs font-medium uppercase tracking-wide text-ink-400">Phone</span>
                          <p className="mt-0.5 flex items-center gap-1 text-ink-800 dark:text-ink-100">
                            <Phone size={13} className="text-ink-400" />
                            {msg.phone}
                          </p>
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-medium uppercase tracking-wide text-ink-400">Submitted</span>
                        <p className="mt-0.5 text-ink-800 dark:text-ink-100">
                          {new Date(msg.createdAt).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-xs font-medium uppercase tracking-wide text-ink-400">Subject</span>
                        <p className="mt-0.5 text-ink-800 dark:text-ink-100">{msg.subject}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="text-xs font-medium uppercase tracking-wide text-ink-400">Message</span>
                      <p className="mt-2 whitespace-pre-wrap rounded-lg border border-ink-100 bg-white p-4 text-sm leading-relaxed text-ink-700 dark:border-surface-600 dark:bg-surface-800 dark:text-ink-200">
                        {msg.message}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        onClick={() => updateStatus(msg._id, "replied")}
                        className="flex items-center gap-1.5 rounded-lg bg-ink-800 px-3 py-2 text-xs font-semibold text-white hover:bg-ink-700 dark:bg-gold-400 dark:text-ink-950 dark:hover:bg-gold-300"
                      >
                        <MessageSquareReply size={14} />
                        Reply via Email
                      </a>

                      {msg.status !== "read" && msg.status !== "replied" && (
                        <button
                          type="button"
                          disabled={updatingId === msg._id}
                          onClick={() => updateStatus(msg._id, "read")}
                          className="flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 py-2 text-xs font-medium text-ink-700 hover:bg-ink-50 disabled:opacity-50 dark:border-surface-500 dark:bg-surface-700 dark:text-ink-200"
                        >
                          <MailOpen size={14} />
                          Mark Read
                        </button>
                      )}

                      {msg.status !== "replied" && (
                        <button
                          type="button"
                          disabled={updatingId === msg._id}
                          onClick={() => updateStatus(msg._id, "replied")}
                          className="flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 py-2 text-xs font-medium text-ink-700 hover:bg-ink-50 disabled:opacity-50 dark:border-surface-500 dark:bg-surface-700 dark:text-ink-200"
                        >
                          <Mail size={14} />
                          Mark Replied
                        </button>
                      )}

                      {msg.status !== "archived" && (
                        <button
                          type="button"
                          disabled={updatingId === msg._id}
                          onClick={() => updateStatus(msg._id, "archived")}
                          className="flex items-center gap-1.5 rounded-lg border border-ink-200 bg-white px-3 py-2 text-xs font-medium text-ink-700 hover:bg-ink-50 disabled:opacity-50 dark:border-surface-500 dark:bg-surface-700 dark:text-ink-200"
                        >
                          <Archive size={14} />
                          Archive
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => deleteMessage(msg._id)}
                        className="ml-auto flex items-center gap-1.5 rounded-lg border border-loss/30 bg-white px-3 py-2 text-xs font-medium text-loss hover:bg-loss/5 dark:border-loss/30 dark:bg-surface-700 dark:text-loss-dark"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm">
          <p className="text-ink-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => { setPage(page - 1); load(page - 1); }}
              className="rounded-lg border border-ink-200 px-4 py-2 font-medium text-ink-700 hover:bg-ink-50 disabled:opacity-40 dark:border-surface-500 dark:text-ink-200"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => { setPage(page + 1); load(page + 1); }}
              className="rounded-lg border border-ink-200 px-4 py-2 font-medium text-ink-700 hover:bg-ink-50 disabled:opacity-40 dark:border-surface-500 dark:text-ink-200"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
