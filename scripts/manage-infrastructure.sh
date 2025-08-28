#!/bin/bash
# GridPulse Infrastructure Management Script
# Provides declarative, idempotent infrastructure management options

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
INFRA_DIR="$PROJECT_ROOT/infrastructure"

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
GridPulse Infrastructure Management

USAGE:
    $0 <command> [options]

COMMANDS:
    terraform-init    Initialize Terraform infrastructure
    terraform-plan    Plan Terraform changes
    terraform-apply   Apply Terraform infrastructure
    terraform-destroy Destroy Terraform infrastructure
    
    docker-local      Start local development with Docker Compose
    docker-stop       Stop local Docker environment
    docker-clean      Clean Docker volumes and containers
    
    railway-status    Show current Railway services status
    railway-cleanup   Interactive cleanup of Railway services
    
    help              Show this help message

EXAMPLES:
    # Set up Terraform infrastructure
    $0 terraform-init
    $0 terraform-apply
    
    # Local development
    $0 docker-local
    
    # Cleanup Railway mess
    $0 railway-cleanup

EOF
}

terraform_init() {
    log_info "Initializing Terraform infrastructure..."
    
    if [[ ! -d "$INFRA_DIR/terraform" ]]; then
        log_error "Terraform directory not found: $INFRA_DIR/terraform"
        exit 1
    fi
    
    cd "$INFRA_DIR/terraform"
    
    if [[ ! -f "terraform.tfvars" ]]; then
        log_warning "terraform.tfvars not found. Creating from example..."
        cp terraform.tfvars.example terraform.tfvars
        log_warning "Please edit terraform.tfvars with your values before proceeding"
        return 1
    fi
    
    terraform init
    log_success "Terraform initialized"
}

terraform_plan() {
    log_info "Planning Terraform changes..."
    cd "$INFRA_DIR/terraform"
    terraform plan
}

terraform_apply() {
    log_info "Applying Terraform infrastructure..."
    cd "$INFRA_DIR/terraform"
    terraform apply
}

terraform_destroy() {
    log_warning "This will destroy ALL infrastructure!"
    read -p "Are you sure? (yes/no): " -r
    if [[ $REPLY == "yes" ]]; then
        cd "$INFRA_DIR/terraform"
        terraform destroy
    else
        log_info "Cancelled"
    fi
}

docker_local() {
    log_info "Starting local development environment..."
    
    if [[ ! -f "$INFRA_DIR/.env" ]]; then
        log_warning ".env file not found. Creating from example..."
        cp "$INFRA_DIR/env.example" "$INFRA_DIR/.env"
        log_warning "Please edit .env with your values"
    fi
    
    cd "$INFRA_DIR"
    docker-compose up -d
    
    log_success "Local environment started"
    log_info "Services available at:"
    log_info "  - Web: http://localhost:3000"
    log_info "  - PostgreSQL: localhost:5432"
    log_info "  - Redis: localhost:6379"
}

docker_stop() {
    log_info "Stopping local Docker environment..."
    cd "$INFRA_DIR"
    docker-compose down
    log_success "Local environment stopped"
}

docker_clean() {
    log_warning "This will remove all local data!"
    read -p "Are you sure? (yes/no): " -r
    if [[ $REPLY == "yes" ]]; then
        cd "$INFRA_DIR"
        docker-compose down -v --remove-orphans
        docker system prune -f
        log_success "Local environment cleaned"
    else
        log_info "Cancelled"
    fi
}

railway_status() {
    log_info "Current Railway services status..."
    
    if ! command -v railway &> /dev/null; then
        log_error "Railway CLI not installed"
        exit 1
    fi
    
    if ! railway whoami &> /dev/null; then
        log_error "Not logged in to Railway"
        exit 1
    fi
    
    log_info "Linking to gridpulse project..."
    railway link --project gridpulse --environment test || true
    
    log_info "Current services:"
    railway status
    
    echo
    log_info "Environment variables:"
    railway variables
}

railway_cleanup() {
    log_warning "Interactive Railway cleanup"
    log_info "This will help you identify and remove redundant services"
    
    railway_status
    
    echo
    log_warning "Manual steps required:"
    log_warning "1. Go to Railway dashboard: https://railway.app/project/gridpulse"
    log_warning "2. Switch to 'test' environment"
    log_warning "3. Identify redundant services (multiple postgres, etc.)"
    log_warning "4. Delete redundant services one by one"
    log_warning "5. Keep only: web-test, postgres-test, redis-test"
    log_warning "6. Ensure web-test is connected to postgres-test and redis-test"
    
    echo
    read -p "Press Enter when cleanup is complete..."
    
    log_info "Verifying cleanup..."
    railway_status
}

# Main execution
case "${1:-}" in
    terraform-init)    terraform_init ;;
    terraform-plan)    terraform_plan ;;
    terraform-apply)   terraform_apply ;;
    terraform-destroy) terraform_destroy ;;
    docker-local)      docker_local ;;
    docker-stop)       docker_stop ;;
    docker-clean)      docker_clean ;;
    railway-status)    railway_status ;;
    railway-cleanup)   railway_cleanup ;;
    help|--help|-h)    show_help ;;
    "")                show_help ;;
    *)                 log_error "Unknown command: $1"; show_help; exit 1 ;;
esac
