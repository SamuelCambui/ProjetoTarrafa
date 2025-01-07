module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        white: "#fff",
        indigo: {
          400: "#6479d3",
          500: "#374daa",
          950: "#00002b",
        },
      },
      boxShadow: {
        'shape': 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;',
      },
      backgroundImage: {
        'pattern': "url('/assets/img/bg-vortex.svg')",
      },
    },
  },
  plugins: [],
};
