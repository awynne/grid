#!/usr/bin/env node
// Trigger a Railway redeploy via GraphQL API
// Requires env vars:
// - RAILWAY_API_TOKEN: Railway API token (Account Settings)
// - RAILWAY_ENVIRONMENT_ID: target environment ID
// - RAILWAY_SERVICE_ID: target service ID

const API_URL = 'https://backboard.railway.app/graphql/v2';

async function main() {
  const token = process.env.RAILWAY_API_TOKEN;
  const environmentId = process.env.RAILWAY_ENVIRONMENT_ID;
  const serviceId = process.env.RAILWAY_SERVICE_ID;

  if (!token) {
    console.error('Missing RAILWAY_API_TOKEN');
    process.exit(1);
  }
  if (!environmentId || !serviceId) {
    console.error('Missing RAILWAY_ENVIRONMENT_ID or RAILWAY_SERVICE_ID');
    process.exit(1);
  }

  const query = `
    mutation ServiceInstanceRedeploy($environmentId: String!, $serviceId: String!) {
      serviceInstanceRedeploy(environmentId: $environmentId, serviceId: $serviceId)
    }
  `;

  const body = JSON.stringify({
    query,
    variables: { environmentId, serviceId },
  });

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body,
    });

    const json = await res.json();

    if (!res.ok || json.errors) {
      console.error('Railway API error:', JSON.stringify(json.errors || json, null, 2));
      process.exit(1);
    }

    console.log('Redeploy triggered:', json.data?.serviceInstanceRedeploy);
  } catch (err) {
    console.error('Request failed:', err);
    process.exit(1);
  }
}

main();

