# Railway Domain Configuration

The GridPulse environment now supports configuring custom domains for your Railway web service using Terraform. There are two domain options available:

## Domain Options

### 1. Railway Service Domain (Railway-provided subdomain)

Configure a custom subdomain on Railway's domain (e.g., `myapp.up.railway.app`):

```hcl
# In your tfvars file, add:
railway_subdomain = "gridpulse-prod"  # Results in: gridpulse-prod.up.railway.app
```

### 2. Custom Domain (Your own domain)

Use your own domain (requires DNS configuration):

```hcl
# In your tfvars file, add:
custom_domain = "app.yourdomain.com"  # Your custom domain
```

## Configuration Examples

### Example 1: Railway Subdomain Only

```hcl
# secrets/prod.dec.tfvars (add this line)
railway_subdomain = "gridpulse"
```

This creates: `https://gridpulse.up.railway.app`

### Example 2: Custom Domain Only

```hcl
# secrets/prod.dec.tfvars (add this line)
custom_domain = "gridpulse.yourdomain.com"
```

This configures: `https://gridpulse.yourdomain.com`

**Note**: You must configure DNS for your custom domain:
- Add a CNAME record pointing `gridpulse.yourdomain.com` to your Railway service URL

### Example 3: Both Domains (Railway + Custom)

```hcl
# secrets/prod.dec.tfvars (add these lines)
railway_subdomain = "gridpulse-prod"
custom_domain = "app.yourdomain.com"
```

This creates both:
- `https://gridpulse-prod.up.railway.app` 
- `https://app.yourdomain.com`

## Implementation Details

The domain configuration is handled in `GridPulseEnvironment.ts` using these Terraform resources:

- **`railway_service_domain`**: For Railway-provided subdomains
- **`railway_custom_domain`**: For custom domains you own

### Terraform Variable Mapping

The domain configuration maps to these infrastructure variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `railway_subdomain` | Railway subdomain | `"myapp"` → `myapp.up.railway.app` |
| `custom_domain` | Custom domain | `"app.example.com"` |

### Outputs

After deployment, these outputs show your configured domains:

- `web_service_domain`: Railway subdomain URL (if configured)
- `web_custom_domain`: Custom domain URL (if configured)

## DNS Setup for Custom Domains

When using custom domains, you need to configure DNS:

1. **Get your Railway service URL** from the Railway dashboard or Terraform output
2. **Create a CNAME record** in your DNS provider:
   ```
   Name: app (or your subdomain)
   Type: CNAME
   Value: your-app-production-abc123.up.railway.app
   ```

3. **Wait for DNS propagation** (5-60 minutes typically)
4. **Apply your Terraform configuration** with the custom domain

Railway will automatically provision and manage SSL certificates for your custom domain.

## Usage in Production Stack

To add domain configuration to your production environment:

1. **Decrypt your tfvars**:
   ```bash
   sops -d secrets/prod.enc.tfvars > secrets/prod.dec.tfvars
   ```

2. **Add domain variables**:
   ```hcl
   # Add to secrets/prod.dec.tfvars
   railway_subdomain = "gridpulse-prod"
   # OR/AND
   custom_domain = "app.yourdomain.com"
   ```

3. **Re-encrypt and deploy**:
   ```bash
   sops -e secrets/prod.dec.tfvars > secrets/prod.enc.tfvars
   rm secrets/prod.dec.tfvars
   cd infrastructure/cdktf
   ./scripts/manage-environments.sh deploy prod
   ```

The domain configuration is optional - if not specified, Railway will still provide a default generated URL for your service.