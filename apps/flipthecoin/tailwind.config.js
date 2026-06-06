export default {
  theme: {
    extend: {
      fontFamily: {
        headings: [
          'Archivo',
          {
            weight: '500',
            fontVariationSettings: '"wdth" 125',
          },
        ],
        body: ['Fira Sans', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            // Was 65ch. The `ch` unit depends on the loaded font's glyph
            // width, so the article column jumped width when the webfont
            // swapped in (horizontal CLS). A `rem` measure is font-metric
            // independent, so the width stays stable across the swap.
            maxWidth: '39rem',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: [
      {
        light: require('daisyui/src/theming/themes')['fantasy'],
      },
      {
        dark: require('daisyui/src/theming/themes')['dracula'],
      },
    ],
  },
};
