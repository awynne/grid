#!/bin/bash
# Railway Infrastructure as Code (IaC) Script
# Declarative, idempotent environment management using Railway GraphQL API

set -e

# Configuration
PROJECT_NAME="gridpulse"
ENVIRONMENT_NAME="test"
REQUIRED_SERVICES=("web-test" "postgres-test" "redis-test")

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v railway &> /dev/null; then
        log_error "Railway CLI not found. Install: curl -fsSL https://railway.com/install.sh | sh"
        exit 1
    fi
    
    if ! railway whoami &> /dev/null; then
        log_error "Not logged in to Railway. Run: railway login"
        exit 1
    fi
    
    if ! command -v curl &> /dev/null; then
        log_error "curl not found. Please install curl."
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        log_warning "jq not found. Installing for JSON parsing..."
        # Try to install jq
        if command -v apt-get &> /dev/null; then
            sudo apt-get update && sudo apt-get install -y jq
        elif command -v brew &> /dev/null; then
            brew install jq
        else
            log_error "Cannot install jq. Please install manually."
            exit 1
        fi
    fi
    
    log_success "Prerequisites check passed"
}

# Get Railway API token
get_railway_token() {
    log_info "Getting Railway API token..."
    
    # Railway stores token in config
    RAILWAY_TOKEN=$(railway whoami --json 2>/dev/null | jq -r '.token' 2>/dev/null || echo "")
    
    if [[ -z "$RAILWAY_TOKEN" || "$RAILWAY_TOKEN" == "null" ]]; then
        # Try alternative method
        RAILWAY_CONFIG_PATH="$HOME/.railway/config.json"
        if [[ -f "$RAILWAY_CONFIG_PATH" ]]; then
            RAILWAY_TOKEN=$(jq -r '.user.token' "$RAILWAY_CONFIG_PATH" 2>/dev/null || echo "")
        fi
    fi
    
    if [[ -z "$RAILWAY_TOKEN" || "$RAILWAY_TOKEN" == "null" ]]; then
        log_error "Cannot extract Railway API token. Please ensure you're logged in."
        exit 1
    fi
    
    log_success "Railway API token obtained"
}

# GraphQL API functions
railway_graphql() {
    local query="$1"
    local variables="$2"
    
    curl -s -X POST \
        -H "Authorization: Bearer $RAILWAY_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"query\": \"$query\", \"variables\": $variables}" \
        https://backboard.railway.com/graphql/v2
}

# Get project ID
get_project_id() {
    log_info "Getting project ID for $PROJECT_NAME..."
    
    local query='query($name: String!) { 
        projects(first: 100) { 
            edges { 
                node { 
                    id 
                    name 
                } 
            } 
        } 
    }'
    
    local response=$(railway_graphql "$query" "{}")
    local project_id=$(echo "$response" | jq -r ".data.projects.edges[] | select(.node.name == \"$PROJECT_NAME\") | .node.id")
    
    if [[ -z "$project_id" || "$project_id" == "null" ]]; then
        log_error "Project '$PROJECT_NAME' not found"
        exit 1
    fi
    
    PROJECT_ID="$project_id"
    log_success "Project ID: $PROJECT_ID"
}

# Get environment ID
get_environment_id() {
    log_info "Getting environment ID for $ENVIRONMENT_NAME..."
    
    local query='query($projectId: String!) { 
        project(id: $projectId) { 
            environments { 
                edges { 
                    node { 
                        id 
                        name 
                    } 
                } 
            } 
        } 
    }'
    
    local response=$(railway_graphql "$query" "{\"projectId\": \"$PROJECT_ID\"}")
    local env_id=$(echo "$response" | jq -r ".data.project.environments.edges[] | select(.node.name == \"$ENVIRONMENT_NAME\") | .node.id")
    
    if [[ -z "$env_id" || "$env_id" == "null" ]]; then
        log_error "Environment '$ENVIRONMENT_NAME' not found"
        exit 1
    fi
    
    ENVIRONMENT_ID="$env_id"
    log_success "Environment ID: $ENVIRONMENT_ID"
}

# List current services
list_services() {
    log_info "Listing current services..."
    
    local query='query($projectId: String!, $environmentId: String!) { 
        project(id: $projectId) { 
            services(first: 100) { 
                edges { 
                    node { 
                        id 
                        name 
                    } 
                } 
            } 
        } 
    }'
    
    local response=$(railway_graphql "$query" "{\"projectId\": \"$PROJECT_ID\", \"environmentId\": \"$ENVIRONMENT_ID\"}")
    echo "$response" | jq -r '.data.project.services.edges[].node | "\(.name) (\(.id))"'
}

# Delete all PostgreSQL services (cleanup)
cleanup_postgres_services() {
    log_warning "Cleaning up existing PostgreSQL services..."
    
    # This would require implementing service deletion via GraphQL API
    # For now, provide manual instructions
    log_warning "Manual cleanup required:"
    log_warning "1. Go to Railway dashboard"
    log_warning "2. Delete all postgres services except the one you want to keep"
    log_warning "3. Re-run this script"
    
    read -p "Have you cleaned up redundant postgres services? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_error "Please cleanup services first"
        exit 1
    fi
}

# Main execution
main() {
    log_info "🏗️  Railway Infrastructure as Code (IaC)"
    log_info "Project: $PROJECT_NAME, Environment: $ENVIRONMENT_NAME"
    echo
    
    check_prerequisites
    get_railway_token
    get_project_id
    get_environment_id
    
    echo
    log_info "📋 Current services:"
    list_services
    echo
    
    cleanup_postgres_services
    
    log_success "🎉 IaC script completed!"
    log_info "Next: Implement proper service creation/deletion via GraphQL API"
}

# Run main function
main "$@"
