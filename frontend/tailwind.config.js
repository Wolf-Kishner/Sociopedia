import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],

  daisyui: {
    themes: [
      {
        light: {
          ...daisyUIThemes["light"],
          primary: "#0f172a", // Custom primary color
          secondary: "#FFE9D0", // Custom secondary color
        },
      },
      {
        black: {
          ...daisyUIThemes["black"],
          primary: "rgb(29, 155, 240)", // Custom primary color for black theme
          secondary: "#0f172a", // Custom secondary color for black theme
        },
      },
    ],
  },
};
