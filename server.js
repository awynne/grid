import { createRequestHandler } from "@react-router/node";
import express from "express";

const app = express();

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("build/client"));
  app.use(
    createRequestHandler({
      build: await import("./build/server/index.js"),
    }),
  );
} else {
  // Development mode with Vite middleware (fallback)
  try {
    const viteDevServer = await import("vite").then((vite) =>
      vite.createServer({
        server: { middlewareMode: true },
      }),
    );
    app.use(viteDevServer.middlewares);
    app.use(
      createRequestHandler({
        build: () =>
          viteDevServer.ssrLoadModule(
            "virtual:react-router/server-build",
          ),
      }),
    );
  } catch (error) {
    console.warn("Vite dev server not available, using production build");
    app.use(express.static("build/client"));
    app.use(
      createRequestHandler({
        build: await import("./build/server/index.js"),
      }),
    );
  }
}

// Get port from environment variable (Railway sets this)
const port = process.env.PORT || 3000;

// CRITICAL: Bind to 0.0.0.0 to accept connections from Railway's proxy
app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${port}`);
});