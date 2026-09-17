import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  server: {
    port: 5173,
    open: false,
    fs: {
      strict: false
    }
  },
  plugins: [
    {
      name: 'ezgif-alias-and-copy-plugin',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/ezgif/')) {
            req.url = req.url.replace('/ezgif/', '/ezgif-27fd5a89d62bf8c0-png-split/');
          }
          next();
        });
      },
      closeBundle() {
        const srcDir = path.resolve(__dirname, 'ezgif-27fd5a89d62bf8c0-png-split');
        const destDir = path.resolve(__dirname, 'dist/ezgif-27fd5a89d62bf8c0-png-split');
        if (fs.existsSync(srcDir)) {
          console.log('Copying frames to dist for production deployment (Vercel)...');
          fs.mkdirSync(path.dirname(destDir), { recursive: true });
          fs.cpSync(srcDir, destDir, { recursive: true });
          console.log('Frames successfully copied to dist!');
        }
        const imagesSrc = path.resolve(__dirname, 'images');
        const imagesDest = path.resolve(__dirname, 'dist/images');
        if (fs.existsSync(imagesSrc)) {
          console.log('Copying images to dist for production deployment...');
          fs.mkdirSync(path.dirname(imagesDest), { recursive: true });
          fs.cpSync(imagesSrc, imagesDest, { recursive: true });
          console.log('Images successfully copied to dist!');
        }
      }
    }
  ],
  publicDir: false
});
