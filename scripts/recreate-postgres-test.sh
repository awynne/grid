#!/bin/bash
# Programmatically recreate postgres-test database service
# This ensures a clean database state for proper migration testing

set -e

echo "🗄️ Recreating postgres-test database service..."

# Check if railway CLI is logged in
if ! railway whoami > /dev/null 2>&1; then
    echo "🔑 Please log in to Railway first:"
    echo "   railway login"
    exit 1
fi

echo "👤 Logged in as: $(railway whoami)"

# Link to gridpulse project and test environment
echo "🔗 Linking to gridpulse project (test environment)..."
railway link --project gridpulse --environment test

echo "📊 Current project status:"
railway status

echo ""
echo "🚨 IMPORTANT: Railway CLI limitations"
echo "   The CLI cannot delete services programmatically."
echo "   You need to delete postgres-test manually, then run this script again."
echo ""
echo "📋 Manual deletion steps:"
echo "   1. Open: https://railway.app/project/gridpulse"
echo "   2. Switch to 'test' environment" 
echo "   3. Click on 'postgres-test' service"
echo "   4. Go to Settings → Danger Zone → Delete Service"
echo "   5. Confirm deletion"
echo ""

read -p "❓ Have you deleted the postgres-test service? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please delete postgres-test service first, then run this script again."
    exit 1
fi

# Create new PostgreSQL database
echo "📦 Creating new postgres-test database service..."
railway add --database postgres --service postgres-test

echo "✅ New postgres-test database service created!"

# Check variables
echo "🔍 Checking environment variables..."
railway variables

echo ""
echo "🔗 Connecting web-test service to new database..."
echo "   ⚠️  You may need to manually connect web-test to postgres-test in Railway dashboard"
echo "   📍 Go to: web-test service → Settings → Service Connections → Connect to postgres-test"
echo ""

echo "🚀 Ready for clean deployment!"
echo "   Run: git push origin main"
echo "   Or trigger manual deployment in Railway dashboard"

echo "🎉 Database recreation completed!"
