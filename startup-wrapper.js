#!/usr/bin/env node
// Startup wrapper to catch and log all errors from server initialization

console.log("🔧 Startup wrapper: Beginning server initialization...");

// Set up global error handlers
process.on('uncaughtException', (error) => {
  console.error("❌ UNCAUGHT EXCEPTION:", error.message);
  console.error("Stack trace:", error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error("❌ UNHANDLED REJECTION at:", promise);
  console.error("Reason:", reason);
  process.exit(1);
});

// Simple fallback server using only built-in Node.js modules
async function startFallbackServer() {
  console.log("🆘 Starting fallback HTTP server...");
  
  const http = await import('http');
  const port = process.env.PORT || 3000;
  
  const server = http.createServer((req, res) => {
    console.log(`📡 ${req.method} ${req.url}`);
    
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        status: 'fallback_mode', 
        timestamp: new Date().toISOString(),
        message: 'Main server failed - running fallback server'
      }));
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('GridPulse Fallback Server - Main application failed to start');
    }
  });
  
  server.listen(port, '0.0.0.0', () => {
    console.log(`🆘 Fallback server listening on http://0.0.0.0:${port}`);
  });
}

// Wrap the actual server import and startup
async function startServerSafely() {
  try {
    console.log("📥 Importing server module...");
    
    // Dynamic import of the main server file
    await import('./server.js');
    
    console.log("✅ Server module imported successfully");
    
  } catch (error) {
    console.error("❌ Failed to import/start server:", error.message);
    console.error("Error type:", error.name);
    console.error("Full stack trace:", error.stack);
    
    // Additional debugging for module resolution errors
    if (error.code) {
      console.error("Error code:", error.code);
    }
    if (error.path) {
      console.error("Error path:", error.path);
    }
    
    console.log("🔄 Attempting to start fallback server...");
    await startFallbackServer();
  }
}

console.log("🚀 Starting server with error handling...");
startServerSafely();