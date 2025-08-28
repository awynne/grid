# Railway Infrastructure as Code with Terraform
# Declarative, idempotent infrastructure management

terraform {
  required_providers {
    railway = {
      source  = "railway/railway"
      version = "~> 0.3.0"
    }
  }
}

# Configure the Railway Provider
provider "railway" {
  # Token will be provided via RAILWAY_TOKEN environment variable
}

# Data source for existing project
data "railway_project" "gridpulse" {
  name = "gridpulse"
}

# Test Environment
resource "railway_environment" "test" {
  name       = "test"
  project_id = data.railway_project.gridpulse.id
}

# PostgreSQL Database Service
resource "railway_service" "postgres_test" {
  name           = "postgres-test"
  project_id     = data.railway_project.gridpulse.id
  environment_id = railway_environment.test.id
  
  source {
    image = "postgres:15"
  }
  
  variables = {
    POSTGRES_DB       = "railway"
    POSTGRES_USER     = "postgres"
    POSTGRES_PASSWORD = var.postgres_password
  }
}

# Redis Cache Service
resource "railway_service" "redis_test" {
  name           = "redis-test"
  project_id     = data.railway_project.gridpulse.id
  environment_id = railway_environment.test.id
  
  source {
    image = "redis:7-alpine"
  }
}

# Web Application Service
resource "railway_service" "web_test" {
  name           = "web-test"
  project_id     = data.railway_project.gridpulse.id
  environment_id = railway_environment.test.id
  
  source {
    repo = "awynne/grid"
    branch = "main"
  }
  
  variables = {
    NODE_ENV                 = "production"
    RAILWAY_ENVIRONMENT_NAME = "test"
    PORT                     = "3000"
    SESSION_SECRET          = var.session_secret
    
    # Database connection (reference to postgres service)
    DATABASE_URL = railway_service.postgres_test.database_url
    
    # Redis connection (reference to redis service)
    REDIS_URL = railway_service.redis_test.redis_url
  }
  
  # Health check configuration
  health_check_path    = "/health"
  health_check_timeout = 180
  
  # Service dependencies
  depends_on = [
    railway_service.postgres_test,
    railway_service.redis_test
  ]
}

# Variables
variable "postgres_password" {
  description = "PostgreSQL password"
  type        = string
  sensitive   = true
}

variable "session_secret" {
  description = "Session secret for web application"
  type        = string
  sensitive   = true
}

# Outputs
output "web_url" {
  description = "Web application URL"
  value       = railway_service.web_test.url
}

output "postgres_connection" {
  description = "PostgreSQL connection details"
  value = {
    host     = railway_service.postgres_test.host
    port     = railway_service.postgres_test.port
    database = "railway"
  }
  sensitive = true
}
