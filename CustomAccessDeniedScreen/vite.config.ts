import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

const versionId = process.env.VERSION_ID || "custom-access-denied-screen";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: versionId,
      filename: "remoteEntry.js",
      exposes: {
        "./CustomAccessDeniedScreen": "./src/components/CustomAccessDeniedScreen"
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "18.3.1"
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "18.3.1"
        }
      },
      manifest: true
    })
  ],
  build: {
    target: "esnext",
    outDir: "dist",
    emptyOutDir: true
  },
  server: {
    port: 5173,
    strictPort: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  }
});
