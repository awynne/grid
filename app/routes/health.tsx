import { PrismaClient } from '@prisma/client';

export async function loader() {
  const checks: Record<string, any> = {
    timestamp: new Date().toISOString(),
    service: "web",
    status: "healthy",
    version: process.env.npm_package_version || "unknown",
    environment: process.env.NODE_ENV || "unknown",
    deployment_test: "option_b_workflow",
    railway_environment: process.env.RAILWAY_ENVIRONMENT || "unknown"
  };

  // Test database connection with timeout
  try {
    if (process.env.DATABASE_URL) {
      const prisma = new PrismaClient();
      
      // Quick connection test with 5-second timeout
      const dbTest = await Promise.race([
        prisma.$queryRaw`SELECT 1 as test`,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 5000)
        )
      ]);
      
      checks.database = "connected";
      await prisma.$disconnect();
    } else {
      checks.database = "not_configured";
      checks.status = "degraded";
    }
  } catch (error) {
    checks.database = `error: ${error instanceof Error ? error.message : 'unknown'}`;
    checks.status = "degraded";
    // Don't fail health check for database issues - app can still serve static content
  }

  // Test Redis connection if available  
  if (process.env.REDIS_URL) {
    checks.redis = "configured";
  } else {
    checks.redis = "not_configured";
  }

  return new Response(JSON.stringify(checks), {
    status: 200, // Always return 200 for Railway health checks
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache"
    }
  });
}