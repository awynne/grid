#!/bin/bash
# GridPulse CDKTF Environment Management
# Idempotent, declarative infrastructure lifecycle management

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CDKTF_DIR="$(dirname "$SCRIPT_DIR")"
# Ensure local node_modules/.bin is on PATH for locally installed CLIs (cdktf, tsc, etc.)
export PATH="$CDKTF_DIR/node_modules/.bin:$PATH"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

show_help() {
    cat << EOF
GridPulse CDKTF Environment Management

USAGE:
    $0 <command> [environment]

COMMANDS:
    plan [env]        Plan infrastructure changes for environment
    deploy [env]      Deploy infrastructure for environment  
    destroy [env]     Destroy environment infrastructure
    force-destroy [env] Force destroy all Railway services (bypasses Terraform state)
    recreate [env]    Destroy and recreate environment (idempotent)
    status [env]      Show environment status
    diff [env]        Show infrastructure differences
    
    list              List all environments
    init              Initialize CDKTF project
    build             Compile TypeScript infrastructure code
    
    # Docker Deployment Commands
    docker-build      Build and deploy using Docker (recommended)
    docker-status     Show Docker deployment configuration
    
    help              Show this help message

ENVIRONMENTS:
    prod              Production environment stack

EXAMPLES:
    # Docker deployment (recommended)
    $0 docker-build prod
    
    # Traditional deployment
    $0 deploy prod
    
    # Recreate production environment from scratch
    $0 recreate prod

SETUP:
    1. Copy terraform.tfvars.example to terraform.tfvars
    2. Update terraform.tfvars with your Railway token and secrets
    3. Run: $0 init
    4. Deploy: $0 deploy prod

EOF
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js not found. Please install Node.js 18+"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm not found. Please install Node.js with npm"
        exit 1
    fi
    
    if ! command -v cdktf &> /dev/null; then
        log_error "CDKTF CLI not found. Install locally: npm i -D cdktf-cli (already handled in CI)"
        exit 1
    fi

    if ! command -v terraform &> /dev/null; then
        log_error "Terraform CLI not found. Install from https://developer.hashicorp.com/terraform/install"
        exit 1
    fi
    
    if [[ ! -f "$CDKTF_DIR/terraform.tfvars" ]]; then
        log_warning "terraform.tfvars not found. Copy from terraform.tfvars.example and edit with your values"
        return 1
    fi
    
    log_success "Prerequisites check passed"
}

build_project() {
    log_info "Building CDKTF project..."
    cd "$CDKTF_DIR"
    
    npm run compile
    log_success "Project built successfully"
}

cdktf_init() {
    log_info "Initializing CDKTF project..."
    cd "$CDKTF_DIR"
    
    if [[ ! -d "node_modules" ]]; then
        log_info "Installing dependencies..."
        npm install
    fi
    
    log_info "Generating provider bindings..."
    npm run get
    
    build_project
    log_success "CDKTF project initialized"
}

get_stack_name() {
    local env="$1"
    case "$env" in
        prod|production) echo "gridpulse-prod" ;;
        *)               echo "" ;;
    esac
}

plan_environment() {
    local env="$1"
    local stack_name=$(get_stack_name "$env")
    
    cd "$CDKTF_DIR"
    
    if [[ -z "$stack_name" ]]; then
        log_error "Environment required. Use: prod"
        exit 1
    fi
    log_info "Planning $env environment ($stack_name)..."
    cdktf plan "$stack_name" -var-file="terraform.tfvars"
}

deploy_environment() {
    local env="$1"
    local stack_name=$(get_stack_name "$env")
    
    cd "$CDKTF_DIR"
    
    if [[ -z "$stack_name" ]]; then
        log_error "Environment required. Use: prod"
        exit 1
    fi
    log_info "Deploying $env environment ($stack_name)..."
    cdktf deploy "$stack_name" --auto-approve -var-file="terraform.tfvars"
    
    log_success "Deployment completed for $env"
}

destroy_environment() {
    local env="$1"
    local stack_name=$(get_stack_name "$env")
    
    if [[ -z "$stack_name" ]]; then
        log_error "Environment required. Use: prod"
        exit 1
    fi
    log_warning "Destroying $env environment ($stack_name)..."
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Cancelled"
        return 1
    fi
    cd "$CDKTF_DIR"
    cdktf destroy "$stack_name" --auto-approve -var-file="terraform.tfvars"
    
    log_success "Environment $env destroyed"
}

recreate_environment() {
    local env="$1"
    
    if [[ -z "$env" ]]; then
        log_error "Environment required for recreate command"
        show_help
        exit 1
    fi
    
    log_info "🔄 Recreating $env environment (idempotent operation)..."
    
    # Destroy first (ignore errors if doesn't exist)
    destroy_environment "$env" || log_warning "Destroy failed or environment didn't exist"
    
    # Deploy fresh
    deploy_environment "$env"
    
    log_success "🎉 Environment $env recreated successfully"
}

environment_status() {
    local env="$1"
    cd "$CDKTF_DIR"
    
    local stack_name=$(get_stack_name "$env")
    if [[ -z "$stack_name" ]]; then
        log_error "Environment required. Use: prod"
        exit 1
    fi
    log_info "Status for $env environment:"
    cdktf output "$stack_name" 2>/dev/null || log_warning "Environment not deployed or no outputs available"
}

environment_diff() {
    local env="$1"
    cd "$CDKTF_DIR"
    
    build_project
    
    local stack_name=$(get_stack_name "$env")
    if [[ -z "$stack_name" ]]; then
        log_error "Environment required. Use: prod"
        exit 1
    fi
    log_info "Showing differences for $env environment..."
    cdktf diff "$stack_name" -var-file="terraform.tfvars"
}

list_environments() {
    cd "$CDKTF_DIR"
    log_info "Available environments:"
    cdktf list
}

docker_build_and_deploy() {
    local env="$1"
    
    if [[ -z "$env" ]]; then
        log_error "Environment required for Docker build and deploy"
        show_help
        exit 1
    fi
    
    log_info "🐳 Starting Docker build and deploy for $env environment..."
    
    # Use the dedicated Docker script
    "$SCRIPT_DIR/build-and-deploy.sh" build-and-deploy "$env"
}

docker_status() {
    local tfvars_file="$CDKTF_DIR/terraform.tfvars"
    
    log_info "Docker deployment configuration:"
    
    if [[ -f "$tfvars_file" ]]; then
        log_info "Current terraform.tfvars settings:"
        grep -E "(docker_|source_)" "$tfvars_file" || log_warning "No deployment configuration found"
    else
        log_warning "terraform.tfvars not found"
    fi
    
    echo
    log_info "Available Docker images:"
    if command -v docker &> /dev/null; then
        docker images ghcr.io/awynne/grid --format "table {{.Repository}}:{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}" || log_warning "No Docker images found"
    else
        log_warning "Docker not available"
    fi
}

force_destroy_environment() {
    local env="$1"
    
    if [[ -z "$env" ]]; then
        log_error "Environment required for force destroy command"
        show_help
        exit 1
    fi
    
    log_warning "🔥 Force destroying $env environment..."
    log_warning "This will delete ALL services directly from Railway, bypassing Terraform state"
    
    # Get expected service names for this environment
    local web_service="web"
    local postgres_service="postgres"  
    local redis_service="redis"
    
    log_info "Attempting to delete Railway services:"
    log_info "  - $web_service"
    log_info "  - $postgres_service"
    log_info "  - $redis_service"
    
    # Try to delete services using Railway CLI
    # Note: Railway CLI might not have direct service delete commands
    # This is a best-effort approach
    
    if command -v railway &> /dev/null; then
        log_info "Using Railway CLI to force delete services..."
        
        # Try to delete the environment entirely if it exists
        local env_name
        case "$env" in
          prod|production) env_name="prod" ;;
          *) env_name="$env" ;;
        esac
        log_info "Attempting to delete environment: $env_name"
        
        # Use -y flag for automatic confirmation
        railway environment delete "$env_name" -y 2>/dev/null || log_warning "Could not delete environment $env_name (may not exist)"
        
        log_info "Services should be deleted with the environment"
    else
        log_error "Railway CLI not found. Cannot force destroy services."
        log_error "Please delete the following services manually from Railway Dashboard:"
        log_error "  - $web_service"
        log_error "  - $postgres_service"  
        log_error "  - $redis_service"
        exit 1
    fi
    
    # Clear Terraform state to ensure clean slate
    log_info "Clearing Terraform state..."
    cd "$CDKTF_DIR"
    if [[ -d "cdktf.out/stacks/gridpulse-$env" ]]; then
        rm -rf "cdktf.out/stacks/gridpulse-$env"
        log_success "Cleared Terraform state for $env"
    fi
    
    log_success "🎉 Force destroy completed for $env environment"
    log_info "Next deployment will create fresh services"
}

# Main execution
case "${1:-}" in
    plan)      check_prerequisites && build_project && plan_environment "$2" ;;
    deploy)    check_prerequisites && build_project && deploy_environment "$2" ;;
    destroy)   check_prerequisites && destroy_environment "$2" ;;
    force-destroy) force_destroy_environment "$2" ;;
    recreate)  check_prerequisites && build_project && recreate_environment "$2" ;;
    status)    environment_status "$2" ;;
    diff)      check_prerequisites && environment_diff "$2" ;;
    list)      list_environments ;;
    init)      cdktf_init ;;
    build)     build_project ;;
    
    # Docker commands
    docker-build)   check_prerequisites && docker_build_and_deploy "$2" ;;
    docker-status)  docker_status ;;
    
    help|--help|-h) show_help ;;
    "")        show_help ;;
    *)         log_error "Unknown command: $1"; show_help; exit 1 ;;
esac
