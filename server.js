import { createRequestHandler } from "@react-router/express";
import express from "express";

async function startServer() {
  const app = express();

  // Serve static assets in production
  if (process.env.NODE_ENV === "production") {
    app.use(express.static("build/client"));
    const serverBuild = await import("./build/server/index.js");
    app.use(
      createRequestHandler({
        build: serverBuild,
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
  
  return new Promise((resolve, reject) => {
    const server = app.listen(port, "0.0.0.0", () => {
      console.log(`✅ Server listening on http://0.0.0.0:${port}`);
      resolve(server);
    });

    server.on('error', (error) => {
      console.error(`❌ Server error:`, error);
      reject(error);
    });

    server.on('close', () => {
      console.log(`🔚 Server closed`);
    });
  });
}

// Start the server
startServer()
  .then((server) => {
    console.log("🎉 Server started successfully!");
  })
  .catch((error) => {
    console.error("❌ Failed to start server:", error);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  });