import { ref, watchEffect } from 'vue';

type Theme = 'fantasy' | 'dracula';
const THEME_KEY = 'ftc.theme.v1';

const storage =
  typeof chrome !== 'undefined' && chrome.storage?.local
    ? chrome.storage.local
    : null;

export function useTheme() {
  const theme = ref<Theme>('fantasy');

  const apply = (next: Theme) => {
    theme.value = next;
    document.documentElement.setAttribute('data-theme', next);
  };

  const toggle = () => apply(theme.value === 'fantasy' ? 'dracula' : 'fantasy');

  const load = async () => {
    if (storage) {
      const saved = await new Promise<{ [k: string]: unknown }>((resolve) => {
        storage.get([THEME_KEY], (v) => resolve(v));
      });
      const next = saved[THEME_KEY];
      if (next === 'fantasy' || next === 'dracula') {
        apply(next);
        return;
      }
    }
    const prefersDark =
      window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    apply(prefersDark ? 'dracula' : 'fantasy');
  };

  watchEffect(() => {
    if (storage) {
      storage.set({ [THEME_KEY]: theme.value });
    }
  });

  void load();

  return { theme, toggle };
}
