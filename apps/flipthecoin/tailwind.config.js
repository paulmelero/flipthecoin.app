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
