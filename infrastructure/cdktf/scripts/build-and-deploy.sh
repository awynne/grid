#!/bin/bash
# GridPulse Docker Build and Deploy Script
# Complete workflow for Docker-based deployments

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CDKTF_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(dirname "$(dirname "$CDKTF_DIR")")"

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
GridPulse Docker Build and Deploy

USAGE:
    $0 <command> [environment] [options]

COMMANDS:
    build [tag]               Build Docker image with optional tag
    push [tag]                Push Docker image to registry
    deploy [env] [tag]        Deploy specific Docker image to environment
    build-and-deploy [env]    Complete build, push, and deploy workflow
    
    list-images              List available Docker images
    cleanup-images           Clean up old Docker images
    
    help                     Show this help message

OPTIONS:
    --registry REGISTRY      Docker registry (default: ghcr.io/awynne)
    --latest                 Also tag as :latest
    --force                  Force rebuild without cache

EXAMPLES:
    # Complete workflow for production
    $0 build-and-deploy prod
    
    # Build and deploy specific version to production
    $0 build v1.2.3 --latest
    $0 push v1.2.3
    $0 deploy prod v1.2.3
    
    # Quick development build
    $0 build dev-$(git rev-parse --short HEAD)

ENVIRONMENT VARIABLES:
    DOCKER_REGISTRY         Override default registry
    GITHUB_TOKEN           GitHub token for registry authentication
    
EOF
}

# Configuration
DEFAULT_REGISTRY="ghcr.io/awynne"
IMAGE_NAME="grid"
REGISTRY="${DOCKER_REGISTRY:-$DEFAULT_REGISTRY}"

# Parse command line arguments
COMMAND="${1:-help}"
ENVIRONMENT="$2"
TAG="$3"
FORCE_BUILD=false
TAG_LATEST=false

# Parse options
while [[ $# -gt 0 ]]; do
    case $1 in
        --registry)
            REGISTRY="$2"
            shift 2
            ;;
        --latest)
            TAG_LATEST=true
            shift
            ;;
        --force)
            FORCE_BUILD=true
            shift
            ;;
        *)
            shift
            ;;
    esac
done

# Generate tag if not provided
if [[ -z "$TAG" && "$COMMAND" != "help" ]]; then
    GIT_SHA=$(git rev-parse --short HEAD)
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    TAG="v${TIMESTAMP}-${GIT_SHA}"
fi

FULL_IMAGE_NAME="${REGISTRY}/${IMAGE_NAME}:${TAG}"

check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker not found. Please install Docker."
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        log_error "Docker daemon not running. Please start Docker."
        exit 1
    fi
}

check_git_clean() {
    if [[ -n $(git status --porcelain) ]]; then
        log_warning "Working directory has uncommitted changes"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Cancelled"
            exit 1
        fi
    fi
}

docker_login() {
    log_info "Logging into Docker registry..."
    
    if [[ -n "$GITHUB_TOKEN" ]]; then
        echo "$GITHUB_TOKEN" | docker login ghcr.io -u USERNAME --password-stdin
        log_success "Logged into GitHub Container Registry"
    else
        log_warning "GITHUB_TOKEN not set. You may need to login manually:"
        log_warning "  echo \$GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin"
    fi
}

build_image() {
    local build_tag="${1:-$TAG}"
    local full_name="${REGISTRY}/${IMAGE_NAME}:${build_tag}"
    
    log_info "Building Docker image: $full_name"
    
    cd "$PROJECT_ROOT"
    
    # Build arguments
    local build_args=()
    if [[ "$FORCE_BUILD" == true ]]; then
        build_args+=("--no-cache")
    fi
    
    docker build "${build_args[@]}" -t "$full_name" .
    
    # Tag as latest if requested
    if [[ "$TAG_LATEST" == true ]]; then
        docker tag "$full_name" "${REGISTRY}/${IMAGE_NAME}:latest"
        log_success "Also tagged as: ${REGISTRY}/${IMAGE_NAME}:latest"
    fi
    
    log_success "Built image: $full_name"
    
    # Show image info
    docker images "$full_name"
}

push_image() {
    local push_tag="${1:-$TAG}"
    local full_name="${REGISTRY}/${IMAGE_NAME}:${push_tag}"
    
    docker_login
    
    log_info "Pushing Docker image: $full_name"
    docker push "$full_name"
    
    if [[ "$TAG_LATEST" == true ]]; then
        log_info "Pushing latest tag..."
        docker push "${REGISTRY}/${IMAGE_NAME}:latest"
    fi
    
    log_success "Pushed image: $full_name"
}

deploy_with_image() {
    local env="$1"
    local deploy_tag="${2:-$TAG}"
    local full_name="${REGISTRY}/${IMAGE_NAME}:${deploy_tag}"
    
    if [[ -z "$env" ]]; then
        log_error "Environment required for deployment"
        exit 1
    fi
    
    log_info "Deploying $full_name to $env environment..."
    
    # Update terraform.tfvars with the specific image
    local tfvars_file="$CDKTF_DIR/terraform.tfvars"
    if [[ -f "$tfvars_file" ]]; then
        # Update docker_image in terraform.tfvars
        if grep -q "docker_image" "$tfvars_file"; then
            sed -i.bak "s|docker_image = \".*\"|docker_image = \"$full_name\"|" "$tfvars_file"
            log_success "Updated docker_image in terraform.tfvars"
        else
            echo "docker_image = \"$full_name\"" >> "$tfvars_file"
            log_success "Added docker_image to terraform.tfvars"
        fi
    else
        log_error "terraform.tfvars not found. Run setup first."
        exit 1
    fi
    
    # Deploy using existing management script
    "$SCRIPT_DIR/manage-environments.sh" deploy "$env"
    
    log_success "Deployed $full_name to $env environment"
}

build_and_deploy() {
    local env="$1"
    
    if [[ -z "$env" ]]; then
        log_error "Environment required for build-and-deploy"
        exit 1
    fi
    
    log_info "🚀 Starting complete build and deploy workflow for $env"
    
    check_git_clean
    
    # Generate deployment tag
    local deploy_tag="$TAG"
    log_info "Using tag: $deploy_tag"
    
    # Build
    build_image "$deploy_tag"
    
    # Push
    push_image "$deploy_tag"
    
    # Deploy
    deploy_with_image "$env" "$deploy_tag"
    
    log_success "🎉 Complete deployment finished!"
    log_info "Image deployed: ${REGISTRY}/${IMAGE_NAME}:${deploy_tag}"
}

list_images() {
    log_info "Available Docker images:"
    docker images "${REGISTRY}/${IMAGE_NAME}" --format "table {{.Repository}}:{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
}

cleanup_images() {
    log_warning "Cleaning up old Docker images..."
    
    # Remove dangling images
    docker image prune -f
    
    # Remove old versions (keep last 5)
    local old_images=$(docker images "${REGISTRY}/${IMAGE_NAME}" --format "{{.ID}}" | tail -n +6)
    if [[ -n "$old_images" ]]; then
        echo "$old_images" | xargs docker rmi
        log_success "Cleaned up old images"
    else
        log_info "No old images to clean up"
    fi
}

# Main execution
check_docker

case "$COMMAND" in
    build)           build_image "$ENVIRONMENT" ;;
    push)            push_image "$ENVIRONMENT" ;;
    deploy)          deploy_with_image "$ENVIRONMENT" "$TAG" ;;
    build-and-deploy) build_and_deploy "$ENVIRONMENT" ;;
    list-images)     list_images ;;
    cleanup-images)  cleanup_images ;;
    help|--help|-h)  show_help ;;
    *)               log_error "Unknown command: $COMMAND"; show_help; exit 1 ;;
esac
