#!/bin/bash
# GridPulse CDKTF Setup Script
# One-time setup for new developers

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CDKTF_DIR="$(dirname "$SCRIPT_DIR")"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }

main() {
    log_info "🚀 Setting up GridPulse CDKTF Infrastructure"
    echo
    
    cd "$CDKTF_DIR"
    
    # Step 1: Copy configuration template
    if [[ ! -f "terraform.tfvars" ]]; then
        log_info "Creating terraform.tfvars from template..."
        cp terraform.tfvars.example terraform.tfvars
        log_success "Created terraform.tfvars"
        echo
        log_warning "⚠️  IMPORTANT: Edit terraform.tfvars with your Railway token and secrets!"
        log_warning "   1. Get Railway token from: Railway Dashboard → Account Settings → Tokens"
        log_warning "   2. Update project_id if different from default"
        log_warning "   3. Set secure passwords and secrets"
        echo
        read -p "Press Enter after editing terraform.tfvars..."
    else
        log_info "terraform.tfvars already exists"
    fi
    
    # Step 2: Initialize CDKTF project
    log_info "Initializing CDKTF project..."
    ./scripts/manage-environments.sh init
    
    echo
    log_success "🎉 Setup complete!"
    echo
    log_info "Next steps:"
    log_info "  1. Deploy prod environment: ./scripts/manage-environments.sh deploy prod"
    log_info "  2. Check status: ./scripts/manage-environments.sh status prod"
    log_info "  3. View help: ./scripts/manage-environments.sh help"
}

main "$@"
