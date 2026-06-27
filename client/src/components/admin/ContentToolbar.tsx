import { useRef } from "react";
import { Bold, Italic, Heading2, Link2, Image as ImageIcon, List, Quote, Heading3 } from "lucide-react";

interface Props {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  value: string;
  onChange: (value: string) => void;
}

export default function ContentToolbar({ textareaRef, value, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function wrapSelection(before: string, after: string, placeholder: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end) || placeholder;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  function insertAtCursor(text: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const next = value.slice(0, start) + text + value.slice(start);
    onChange(next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    });
  }

  function insertLink() {
    const url = prompt("Link URL:");
    if (!url) return;
    wrapSelection(`<a href="${url}">`, `</a>`, "link text");
  }

  // Opens a file picker; on selection converts to base64 and inserts <img> tag
  function handleImageFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5 MB."); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      insertAtCursor(`\n<img src="${src}" alt="${alt}" />\n`);
    };
    reader.readAsDataURL(file);
  }

  // Also allow pasting a URL as a fallback via right-click context on the Image button
  function insertImageUrl() {
    const url = prompt("Or paste an image URL:");
    if (!url?.trim()) return;
    const alt = prompt("Alt text:") ?? "";
    insertAtCursor(`\n<img src="${url.trim()}" alt="${alt}" />\n`);
  }

  const buttons = [
    {
      icon: Heading2,
      label: "H2",
      title: "Heading 2",
      action: () => wrapSelection('<h2 id="">', "</h2>", "Section heading"),
    },
    {
      icon: Heading3,
      label: "H3",
      title: "Heading 3",
      action: () => wrapSelection('<h3>', "</h3>", "Sub-heading"),
    },
    {
      icon: Bold,
      label: "Bold",
      title: "Bold",
      action: () => wrapSelection("<strong>", "</strong>", "bold text"),
    },
    {
      icon: Italic,
      label: "Italic",
      title: "Italic",
      action: () => wrapSelection("<em>", "</em>", "italic text"),
    },
    {
      icon: Link2,
      label: "Link",
      title: "Insert link",
      action: insertLink,
    },
    {
      icon: List,
      label: "List",
      title: "Unordered list",
      action: () => wrapSelection("<ul>\n  <li>", "</li>\n</ul>", "List item"),
    },
    {
      icon: Quote,
      label: "Quote",
      title: "Blockquote",
      action: () => wrapSelection("<blockquote>", "</blockquote>", "Quoted text"),
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-lg border border-b-0 border-ink-200 bg-ink-50 p-2 dark:border-surface-500 dark:bg-surface-800">
      {buttons.map(({ icon: Icon, label, title, action }) => (
        <button
          key={label}
          type="button"
          onClick={action}
          title={title}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-ink-600 hover:bg-white dark:text-ink-300 dark:hover:bg-surface-700"
        >
          <Icon size={14} />
          {label}
        </button>
      ))}

      {/* Divider */}
      <div className="mx-1 h-5 w-px bg-ink-200 dark:bg-surface-500" />

      {/* Image upload button */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) { handleImageFile(f); e.target.value = ""; } }}
      />
      <button
        type="button"
        title="Insert image (upload file or paste URL)"
        onClick={() => fileInputRef.current?.click()}
        onContextMenu={(e) => { e.preventDefault(); insertImageUrl(); }}
        className="flex items-center gap-1.5 rounded-md bg-gold-50 px-2.5 py-1.5 text-xs font-medium text-gold-700 hover:bg-gold-100 dark:bg-surface-700 dark:text-gold-400 dark:hover:bg-surface-600"
      >
        <ImageIcon size={14} />
        Image
      </button>
      <span className="text-xs text-ink-400 dark:text-ink-500">
        (right-click → paste URL)
      </span>
    </div>
  );
}
