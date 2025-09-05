#!/bin/bash
set -e

echo "🧹 Cleaning up old Docker images from GHCR..."
echo "⚠️  This will keep only the LATEST version and delete ALL others"
echo ""

# Get package versions, skip the first (latest) one, delete the rest
gh api /user/packages/container/grid/versions --paginate | \
jq -r '.[1:] | .[] | .id' | \
while read -r version_id; do
    if [ -n "$version_id" ]; then
        echo "🗑️  Deleting version ID: $version_id"
        gh api -X DELETE "/user/packages/container/grid/versions/$version_id" || echo "⚠️ Failed to delete $version_id"
    fi
done

echo "✅ Cleanup completed - only latest version remains"