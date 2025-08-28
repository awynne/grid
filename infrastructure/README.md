# GridPulse Infrastructure as Code (IaC)

This directory contains **declarative, idempotent** infrastructure management for GridPulse, addressing the limitations of Railway CLI's interactive-only, non-declarative approach.

## 🎯 **Solutions Provided**

### **Option 1: Terraform (Recommended for Production)**
- ✅ **Declarative** - Define desired state
- ✅ **Idempotent** - Safe to run multiple times  
- ✅ **Version controlled** - Infrastructure changes tracked in git
- ✅ **Automated** - No manual clicking in dashboards

### **Option 2: Docker Compose (Local Development)**
- ✅ **Consistent environments** - Same setup locally and remotely
- ✅ **Fast iteration** - Instant local testing
- ✅ **Service dependencies** - Proper startup ordering

### **Option 3: GraphQL API Scripts (Immediate Fix)**
- ✅ **Programmatic control** - Script Railway operations
- ✅ **Cleanup automation** - Remove redundant services
- ✅ **Status reporting** - Current state visibility

## 🚀 **Quick Start**

### **Immediate Fix (Cleanup Current Mess)**
```bash
# Clean up the 3 postgres services issue
./scripts/manage-infrastructure.sh railway-cleanup
```

### **Local Development Setup**
```bash
# Start clean local environment
./scripts/manage-infrastructure.sh docker-local

# Access services
# - Web: http://localhost:3000
# - Database: localhost:5432  
# - Redis: localhost:6379
```

### **Production Infrastructure (Terraform)**
```bash
# Initialize Terraform
./scripts/manage-infrastructure.sh terraform-init

# Edit terraform.tfvars with your secrets
# Then apply infrastructure
./scripts/manage-infrastructure.sh terraform-apply
```

## 📁 **Directory Structure**

```
infrastructure/
├── terraform/              # Terraform IaC files
│   ├── main.tf             # Main infrastructure definition
│   ├── terraform.tfvars.example  # Variables template
│   └── .gitignore          # Ignore sensitive files
├── docker-compose.yml      # Local development environment
├── env.example             # Environment variables template
└── README.md               # This file
```

## 🔧 **Infrastructure Components**

### **Services Defined:**
- **web-test** - React Router v7 application
- **postgres-test** - TimescaleDB-enabled PostgreSQL  
- **redis-test** - Redis cache

### **Features:**
- **Health checks** - Proper startup verification
- **Service dependencies** - Correct startup order
- **Environment variables** - Secure secrets management
- **Volume persistence** - Data survives restarts

## 🛠️ **Management Commands**

```bash
# Infrastructure Management
./scripts/manage-infrastructure.sh help

# Terraform commands
./scripts/manage-infrastructure.sh terraform-init
./scripts/manage-infrastructure.sh terraform-plan
./scripts/manage-infrastructure.sh terraform-apply
./scripts/manage-infrastructure.sh terraform-destroy

# Local development
./scripts/manage-infrastructure.sh docker-local
./scripts/manage-infrastructure.sh docker-stop
./scripts/manage-infrastructure.sh docker-clean

# Railway operations
./scripts/manage-infrastructure.sh railway-status
./scripts/manage-infrastructure.sh railway-cleanup
```

## 🚨 **Current Railway Issues**

### **Problems with Railway CLI:**
1. **Interactive only** - Cannot be automated
2. **Not declarative** - Imperative commands only  
3. **Not idempotent** - Multiple runs create duplicates
4. **No cleanup commands** - Cannot delete services programmatically

### **Our Solutions:**
1. **Terraform provider** - Declarative infrastructure
2. **GraphQL API scripts** - Programmatic control
3. **Docker Compose** - Local consistency
4. **Management scripts** - Unified interface

## 🔐 **Security**

### **Sensitive Files (Git Ignored):**
- `terraform.tfvars` - Contains secrets
- `.env` - Local environment variables
- `*.tfstate` - Terraform state files

### **Setup Process:**
1. Copy `*.example` files
2. Edit with your actual values
3. Never commit secrets to git

## 📋 **Migration Path**

### **From Current Broken State:**
1. **Cleanup** - `railway-cleanup` to remove redundant services
2. **Local Development** - Use Docker Compose for consistent testing
3. **Production** - Migrate to Terraform for proper IaC

### **Benefits:**
- ✅ **No more manual clicking** in Railway dashboard
- ✅ **Consistent environments** across team members
- ✅ **Version controlled infrastructure** changes
- ✅ **Automated deployments** without human error
- ✅ **Easy environment recreation** from scratch

## 🎯 **Next Steps**

1. **Immediate**: Run `railway-cleanup` to fix current mess
2. **Short-term**: Use Docker Compose for local development  
3. **Long-term**: Implement Terraform for production infrastructure

This approach provides **true Infrastructure as Code** with declarative, idempotent, version-controlled infrastructure management. 🚀
