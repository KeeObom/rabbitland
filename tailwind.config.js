/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#1B3B1F",
          dark: "#122B15",
          light: "#274F2B",
        },
        gold: {
          DEFAULT: "#C79A3D",
          light: "#E0BE72",
          dark: "#9C7A2E",
        },
        cream: "#F5EFE1",
        charcoal: "#2B2620",
        sage: "#7C9473",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      backgroundImage: {
        "sunrise-arc":
          "radial-gradient(circle at 50% 100%, rgba(199,154,61,0.35) 0%, rgba(199,154,61,0) 60%)",
      },
    },
  },
  plugins: [],
};
