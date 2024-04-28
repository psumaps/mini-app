import { default as flattenColorPalette } from "tailwindcss/lib/util/flattenColorPalette";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', '../shared/**/*.{js,jsx,ts,tsx}'],
  theme: {
    darkMode: "class",
    extend: {
      borderRadius: {
        half: "50%",
      },
      fontSize: {
        'xl_': '1.31rem',
        'b': '0.81rem',
      }
    },
    fontFamily: {
      'montserrat': ['Montserrat', 'sans-serif'],
    },
    colors: {
      // main colors
      'c_accent': '#D01F36',
      'c_main': '#333333',
      'c_secondary': '#828282',
      'c_inactive': '#BDBDBD',
      'c_textHeader': '#000000',
      'c_bg': '#F9F9F9',
      'c_bg-block': '#FEFEFE',
      'c_bg-secondary': '#DADADA1A',
      'c_shadow': '#DFDFDF',
      'c_border': '#EBEBEB',
      // dark mode
      'cd_main': '#FEFEFE',
      'cd_secondary': '#7D7D7D',
      'cd_inactive': '#424242',
      'cd_textHeader': '#FFFFFF',
      'cd_bg': '#060606',
      'cd_bg-block': '#333333',
      'cd_bg-secondary': '#2525251A',
      'cd_border': '#141414',
    }
  },
  plugins: [addVariablesForColors],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
 
  addBase({
    ":root": newVars,
  });
}