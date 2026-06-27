/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Deep navy-teal base — distinct from Groww's green / Zerodha's blue-black.
        // Evokes trust + depth (ink, ledger) rather than generic "fintech blue".
        ink: {
          50: "#f3f6f6",
          100: "#dde6e6",
          200: "#b8cccc",
          300: "#8aabac",
          400: "#5c8688",
          500: "#3d6566",
          600: "#2c4f51",
          700: "#1f3b3d",
          800: "#152a2c",
          900: "#0d1c1d",
          950: "#070f10",
        },
        // Warm gold accent — prosperity / rupee association, used sparingly.
        gold: {
          50: "#fdf8ed",
          100: "#faedc8",
          200: "#f5da91",
          300: "#edc05a",
          400: "#e2a934",
          500: "#c98c1f",
          600: "#a36c17",
          700: "#7d5117",
          800: "#5e3e18",
          900: "#3f2a13",
        },
        // Dark-mode is NOT just "ink inverted" — it gets its own warmer, richer surface
        // tones (deep charcoal-teal with a slight warmth, rather than flat near-black) so
        // cards and elevation read clearly instead of the muddy look generic dark themes get.
        surface: {
          900: "#0a1416", // page background — deepest layer
          800: "#0f1c1f", // base card surface
          700: "#15282b", // raised card / elevated surface
          600: "#1d3437", // hover / active surface
          500: "#274347", // border-on-dark, subtle dividers
        },
        // Functional colors for gains/losses (market data) — slightly desaturated/brighter
        // variants are used in dark mode via the `dark:` variants in components, since flat
        // green-on-black and red-on-black both have poor contrast/eye strain at night.
        gain: "#1f8a5f",
        "gain-dark": "#4ade80",
        loss: "#c23b3b",
        "loss-dark": "#f87171",
      },
      fontFamily: {
        // Display/numeric face: a serif with character for big result numbers —
        // distinguishes "the answer" from "the interface" (signature element).
        display: ["\"Fraunces\"", "\"Georgia\"", "serif"],
        sans: ["\"Inter\"", "system-ui", "sans-serif"],
        mono: ["\"JetBrains Mono\"", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(13,28,29,0.04), 0 8px 24px -4px rgba(13,28,29,0.08)",
        "card-hover": "0 2px 4px rgba(13,28,29,0.06), 0 16px 40px -8px rgba(13,28,29,0.14)",
        // Dark-mode shadows lean on a soft gold/teal glow rather than black-on-black shadow,
        // since a dark shadow is invisible on a dark background — elevation needs to be
        // communicated by light, not darkness, once the base surface is already dark.
        "card-dark": "0 1px 2px rgba(0,0,0,0.3), 0 8px 28px -6px rgba(0,0,0,0.5)",
        "card-dark-hover": "0 2px 4px rgba(0,0,0,0.35), 0 0 0 1px rgba(226,169,52,0.08), 0 20px 48px -8px rgba(0,0,0,0.6)",
        "glow-gold": "0 0 32px -4px rgba(226,169,52,0.35)",
        glass: "0 8px 32px rgba(0,0,0,0.12)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #e2a934 0%, #c98c1f 100%)",
        "ink-gradient": "linear-gradient(135deg, #152a2c 0%, #0d1c1d 100%)",
        // Premium hero gradients — used on the homepage hero and category section headers
        "hero-gradient": "linear-gradient(135deg, #0d1c1d 0%, #1f3b3d 50%, #0a1416 100%)",
        "hero-gradient-dark": "linear-gradient(135deg, #0a1416 0%, #15282b 45%, #0a1416 100%)",
        "gold-radial": "radial-gradient(circle at 30% 20%, rgba(226,169,52,0.18) 0%, transparent 60%)",
        "mesh-gold": "radial-gradient(at 20% 0%, rgba(226,169,52,0.15) 0px, transparent 50%), radial-gradient(at 80% 100%, rgba(31,59,61,0.4) 0px, transparent 50%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionTimingFunction: {
        // Used for premium micro-interactions (card hover lift, button press) — a slight
        // overshoot-then-settle reads as "polished" rather than the default linear/ease.
        "out-back": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        shimmer: "shimmer 1.8s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
    },
  },
  plugins: [],
};
