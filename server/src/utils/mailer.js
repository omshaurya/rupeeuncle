import nodemailer from "nodemailer";

let transporter = null;

/**
 * Lazily creates a singleton Nodemailer transporter using SMTP credentials from env vars.
 * Returns null if SMTP isn't configured, so callers can skip sending instead of crashing.
 */
const getTransporter = () => {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn("SMTP credentials not configured; email notifications are disabled.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return transporter;
};

/**
 * Sends an email notification to the site admin whenever a contact form is submitted.
 */
export const sendContactNotification = async (contactMessage) => {
  const t = getTransporter();
  if (!t) return;

  const receiver = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER;

  await t.sendMail({
    from: `"RupeeUncle" <${process.env.SMTP_USER}>`,
    to: receiver,
    replyTo: contactMessage.email,
    subject: `New Contact Form Submission: ${contactMessage.subject || "General Inquiry"}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${contactMessage.name}</p>
      <p><strong>Email:</strong> ${contactMessage.email}</p>
      <p><strong>Phone:</strong> ${contactMessage.phone || "N/A"}</p>
      <p><strong>Subject:</strong> ${contactMessage.subject || "General Inquiry"}</p>
      <p><strong>Message:</strong></p>
      <p>${contactMessage.message.replace(/\n/g, "<br/>")}</p>
    `,
  });
};
