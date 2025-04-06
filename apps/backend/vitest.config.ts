import { defineConfig, configDefaults } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    ...configDefaults,
    environment: 'node',
    env: process.env,
    setupFiles: ['dotenv/config'], //this line,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
    },
  },
  envDir: path.resolve(__dirname),
})
