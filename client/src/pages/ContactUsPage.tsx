import { useState } from "react";
import { Mail, MessageSquare, CheckCircle2 } from "lucide-react";
import apiClient from "../utils/apiClient";
import { useSeo } from "../hooks/useSeo";

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const INITIAL_STATE: FormState = { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContactUsPage() {
  useSeo({
    title: "Contact Us",
    description: "Get in touch with the RupeeUncle team — questions, feedback, or partnership inquiries.",
    canonicalPath: "/contact-us",
  });

  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      await apiClient.post("/contact", form);
      setStatus("success");
      setForm(INITIAL_STATE);
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        "We couldn't reach our server right now. Please try again shortly, or email us directly."
      );
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold text-ink-900 dark:text-ink-50 sm:text-4xl">
          Get in Touch
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-500 dark:text-ink-400">
          Questions about a calculator, found something inaccurate, or want to partner
          with us? We'd like to hear from you.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          <div className="card-surface flex items-start gap-3 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-gradient text-ink-950">
              <Mail size={18} />
            </span>
            <div>
              <p className="font-display text-sm font-semibold text-ink-900 dark:text-ink-50">
                Email
              </p>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
                For general queries, corrections, or partnerships.
              </p>
            </div>
          </div>
          <div className="card-surface flex items-start gap-3 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-gradient text-ink-950">
              <MessageSquare size={18} />
            </span>
            <div>
              <p className="font-display text-sm font-semibold text-ink-900 dark:text-ink-50">
                Response Time
              </p>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
                We typically respond within 2-3 business days.
              </p>
            </div>
          </div>
        </div>

        <div className="card-surface p-6 sm:p-8">
          {status === "success" ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle2 size={40} className="text-gain dark:text-gain-dark" />
              <p className="mt-3 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
                Message sent
              </p>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
                Thanks for reaching out — we'll get back to you soon.
              </p>
              <button onClick={() => setStatus("idle")} className="btn-secondary mt-5">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
                    Name *
                  </label>
                  <input
                    id="name"
                    required
                    maxLength={100}
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-800 dark:border-surface-500 dark:bg-surface-700 dark:text-ink-50"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-800 dark:border-surface-500 dark:bg-surface-700 dark:text-ink-50"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
                    Phone (optional)
                  </label>
                  <input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-800 dark:border-surface-500 dark:bg-surface-700 dark:text-ink-50"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
                    Subject
                  </label>
                  <input
                    id="subject"
                    maxLength={200}
                    placeholder="General Inquiry"
                    value={form.subject}
                    onChange={(e) => update("subject", e.target.value)}
                    className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-800 dark:border-surface-500 dark:bg-surface-700 dark:text-ink-50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-200">
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  maxLength={5000}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-800 dark:border-surface-500 dark:bg-surface-700 dark:text-ink-50"
                />
              </div>

              {status === "error" && (
                <p className="rounded-lg bg-loss/10 px-3 py-2 text-sm text-loss dark:text-loss-dark">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="btn-primary w-full disabled:opacity-60"
              >
                {status === "submitting" ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
