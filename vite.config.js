import { defineConfig } from 'vite'
import { ngrok } from 'vite-plugin-ngrok'
import react from '@vitejs/plugin-react'
import dotenv from "dotenv";

dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    ...(process.env.VITE_NGROK_TOKEN ? [ngrok(process.env.VITE_NGROK_TOKEN)] : []),
    react()
  ],
  preview: {
    allowedHosts: 'all',
  },
})
