import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES_BRANCH_FALLBACK === 'true'
    ? '/revolta_dos_pinguins_card_game/dist/'
    : process.env.GITHUB_ACTIONS
      ? '/revolta_dos_pinguins_card_game/'
      : '/',
});
