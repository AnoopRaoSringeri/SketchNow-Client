import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), mkcert()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    },
    server: {
        port: 3000,
        https: {
            key: fs.readFileSync("../cert/key.pem"), // replace it with your key path
            cert: fs.readFileSync("../cert/cert.pem") // replace it with your certificate path
        }
    }
});
