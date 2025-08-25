import express from 'express';

const app = express();
const port = process.env.PORT || 3001;

// Health check endpoint for Railway
app.get('/worker/health', (req, res) => {
  const checks: Record<string, any> = {
    timestamp: new Date().toISOString(),
    service: 'worker',
    status: 'healthy',
    version: process.env.npm_package_version || 'unknown',
    environment: process.env.NODE_ENV || 'unknown'
  };

  // Test database connection if available
  if (process.env.DATABASE_URL) {
    checks.database = 'not_implemented'; // Will implement when database logic is added
  } else {
    checks.database = 'not_configured';
  }

  // Test Redis connection if available
  if (process.env.REDIS_URL) {
    checks.redis = 'not_implemented'; // Will implement when Redis is added
  } else {
    checks.redis = 'not_configured';
  }

  // Check if cron is enabled
  checks.cron_enabled = process.env.CRON_ENABLED === 'true';
  
  res.json(checks);
});

// Basic info endpoint
app.get('/worker', (req, res) => {
  res.json({
    service: 'GridPulse Worker Service',
    version: process.env.npm_package_version || 'unknown',
    uptime: process.uptime()
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Worker service health server listening on port ${port}`);
  console.log(`Health check available at: http://localhost:${port}/worker/health`);
});

// TODO: Implement actual cron job logic for data ingestion
// This will be implemented in GRID-013 (EIA Data Ingestion Service)
if (process.env.CRON_ENABLED === 'true') {
  console.log('Cron jobs enabled - actual implementation pending GRID-013');
}