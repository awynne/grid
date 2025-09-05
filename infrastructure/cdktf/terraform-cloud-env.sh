#!/bin/bash
# Terraform Cloud environment variables for local development
# 
# USAGE:
#   Source this file before running any terraform or cdktf commands locally:
#   $ source terraform-cloud-env.sh
#   
#   Or for a single command:
#   $ source terraform-cloud-env.sh && terraform plan
#
# This configures local Terraform to use the same remote state as GitHub Actions

export TF_CLOUD_ORG="awynne"
export TF_CLOUD_WORKSPACE="gridpulse-prod"
export TF_TOKEN_app_terraform_io="YOUR_TF_API_TOKEN_HERE"

echo "✅ Terraform Cloud environment configured:"
echo "   Organization: $TF_CLOUD_ORG"
echo "   Workspace: $TF_CLOUD_WORKSPACE" 
echo "   Token: ${TF_TOKEN_app_terraform_io:0:20}..."
echo ""
echo "Now you can run:"
echo "  terraform plan"
echo "  terraform apply"
echo "  npx cdktf synth && terraform -C cdktf.out/stacks/gridpulse-prod plan"