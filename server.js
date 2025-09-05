import { createRequestHandler } from "@react-router/express";
import express from "express";

console.log("🔄 Starting server initialization...");

async function startServer() {
  console.log("📦 Creating Express app...");
  const app = express();

  // Serve static assets in production
  if (process.env.NODE_ENV === "production") {
    console.log("🏭 Running in production mode");
    console.log("📁 Setting up static asset serving...");
    app.use(express.static("build/client"));
    
    console.log("📥 Importing server build...");
    const serverBuild = await import("./build/server/index.js");
    console.log("✅ Server build imported successfully");
    
    console.log("🔌 Setting up request handler...");
    app.use(
      createRequestHandler({
        build: serverBuild,
      }),
    );
    console.log("✅ Request handler configured");
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
  console.log(`🌐 Port configured: ${port}`);

  // CRITICAL: Bind to 0.0.0.0 to accept connections from Railway's proxy
  console.log("🚀 Starting server listener...");
  app.listen(port, "0.0.0.0", () => {
    console.log(`✅ Server listening on http://0.0.0.0:${port}`);
  });
}

// Start the server
console.log("🎬 Calling startServer function...");
startServer().catch((error) => {
  console.error("❌ Failed to start server:", error);
  console.error("Stack trace:", error.stack);
  process.exit(1);
});

console.log("📋 Server startup script completed");