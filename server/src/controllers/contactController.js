import ContactMessage from "../models/ContactMessage.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { sendContactNotification } from "../utils/mailer.js";

/**
 * @desc    Submit contact form
 * @route   POST /api/contact
 * @access  Public
 */
export const submitContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    throw new ApiError(400, "Name, email, and message are required");
  }

  const contactMessage = await ContactMessage.create({
    name,
    email,
    phone,
    subject,
    message,
    ipAddress: req.ip,
  });

  // Best-effort email notification; form submission still succeeds even if email fails
  try {
    await sendContactNotification(contactMessage);
  } catch (err) {
    console.error("Failed to send contact notification email:", err.message);
  }

  res.status(201).json({
    success: true,
    message: "Thank you for reaching out. We'll get back to you soon.",
    data: { id: contactMessage._id },
  });
});

/**
 * @desc    Get all contact messages (admin)
 * @route   GET /api/admin/contact-messages
 * @access  Admin
 */
export const getContactMessages = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = status ? { status } : {};
  const skip = (Number(page) - 1) * Number(limit);

  const [messages, total] = await Promise.all([
    ContactMessage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    ContactMessage.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    count: messages.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: messages,
  });
});

/**
 * @desc    Update contact message status (mark read/replied/archived)
 * @route   PUT /api/admin/contact-messages/:id
 * @access  Admin
 */
export const updateContactMessageStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  if (!message) throw new ApiError(404, "Message not found");
  res.status(200).json({ success: true, data: message });
});

/**
 * @desc    Delete contact message
 * @route   DELETE /api/admin/contact-messages/:id
 * @access  Admin
 */
export const deleteContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) throw new ApiError(404, "Message not found");
  res.status(200).json({ success: true, message: "Message deleted", data: {} });
});
