// @ts-expect-error no types for this
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  const allColors = flattenColorPalette(theme('colors'));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
  );

  addBase({
    ':root': newVars,
  });
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', '../shared/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'selector',
  theme: {
    extend: {
      borderRadius: {
        half: '50%',
        fifty: '3.125rem',
        forty: '2.5rem',
      },
      fontSize: {
        xl_: '1.31rem',
        b: '0.81rem',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        // main colors
        c_accent: '#D01F36',
        c_main: '#333333',
        c_secondary: '#828282',
        c_inactive: '#BDBDBD',
        c_textHeader: '#000000',
        c_bg: '#F9F9F9',
        'c_bg-block': '#FEFEFE',
        'c_bg-secondary': '#DADADA1A',
        c_shadow: '#DFDFDF',
        c_border: '#EBEBEB',
        'c_border-secondary': '#DADADA',
        c_sub: '#444444',

        // dark mode
        cd_main: '#FEFEFE',
        cd_secondary: '#979797',
        cd_inactive: '#626262',
        cd_textHeader: '#FFFFFF',
        cd_bg: '#282828',
        'cd_bg-block': '#202020',
        'cd_bg-secondary': '#2525251A',
        cd_shadow: '#262626',
        cd_border: '#383838',
        'cd_border-secondary': '#545454',
      },
    },
  },
  plugins: [addVariablesForColors],
};
