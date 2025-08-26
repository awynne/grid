export async function loader() {
  const checks: Record<string, any> = {
    timestamp: new Date().toISOString(),
    service: "web",
    status: "healthy",
    version: process.env.npm_package_version || "unknown",
    environment: process.env.NODE_ENV || "unknown",
    deployment_test: "option_b_workflow"
  };

  // Database connection status (will implement actual testing later)
  if (process.env.DATABASE_URL) {
    checks.database = "configured";
  } else {
    checks.database = "not_configured";
  }

  // Test Redis connection if available  
  if (process.env.REDIS_URL) {
    checks.redis = "configured";
  } else {
    checks.redis = "not_configured";
  }

  return new Response(JSON.stringify(checks), {
    status: checks.status === "healthy" ? 200 : 503,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache"
    }
  });
}