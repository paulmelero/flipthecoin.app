import { dark } from 'daisyui/src/theming/themes';

export default {
  theme: {
    extend: {
      fontFamily: {
        headings: [
          'Archivo',
          {
            fontVariationSettings: '"wdth" 125',
          },
        ],
        mono: ['IBM Plex Mono'],
        body: ['Fira Sans', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: [
      {
        light: require('daisyui/src/theming/themes')['bumblebee'],
      },
      {
        dark: require('daisyui/src/theming/themes')['dim'],
      },
    ],
  },
};
