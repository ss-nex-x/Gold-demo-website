import { defineConfig } from 'vite';

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
      name: 'ezgif-alias-plugin',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/ezgif/')) {
            req.url = req.url.replace('/ezgif/', '/ezgif-27fd5a89d62bf8c0-png-split/');
          }
          next();
        });
      }
    }
  ],
  publicDir: false // allows serving files directly from root
});
