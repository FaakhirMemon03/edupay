/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "Noto Sans", "sans-serif"],
        urdu: ["Noto Nastaliq Urdu", "Noto Sans", "serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#6366f1", // Indigo 500
          light: "#818cf8",
          dark: "#4f46e5",
          accent: "#c084fc", // Violet 400
        },
        success: {
          DEFAULT: "#10b981", // Emerald 500
          light: "#34d399",
        },
        danger: {
          DEFAULT: "#f43f5e", // Rose 500
          light: "#fb7185",
        },
        warning: {
          DEFAULT: "#f59e0b", // Amber 500
          light: "#fbbf24",
        },
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        neutral: {
          bg: "#f8fafc", // Light gray background
          card: "#ffffff",
          text: "#0f172a",
          secondary: "#64748b",
          border: "#e2e8f0",
        }
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
        'full': '9999px',
      },
      boxShadow: {
        'premium': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'elevated': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
