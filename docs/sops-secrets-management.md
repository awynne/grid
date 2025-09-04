# SOPS Secrets Management

> **📋 Purpose**: Documentation for managing encrypted secrets using SOPS (Secrets OPerationS) and age encryption in the GridPulse project.

## Table of Contents
- [Introduction & Overview](#introduction--overview)
- [Age Encryption Key Management](#age-encryption-key-management)
- [Local Development Setup](#local-development-setup)
- [Working with Encrypted Secrets](#working-with-encrypted-secrets)
- [GitHub Actions Integration](#github-actions-integration)
- [Best Practices & Security](#best-practices--security)
- [Troubleshooting](#troubleshooting)

## Introduction & Overview

### What is SOPS?

SOPS (Secrets OPerationS) is a tool for managing encrypted files that supports YAML, JSON, ENV, INI, and binary formats. It encrypts only the values of structured data, leaving the keys in plaintext for better diffs and merge conflicts resolution.

### Why We Use SOPS for GridPulse

1. **Infrastructure as Code**: Enables version control of encrypted infrastructure secrets alongside CDKTF code
2. **Security**: Secrets are encrypted at rest and in transit, never stored in plaintext
3. **Collaboration**: Team members can collaborate on configuration changes without exposing secrets
4. **CI/CD Integration**: Automated decryption in GitHub Actions workflows for deployment
5. **Audit Trail**: Git history tracks changes to encrypted configuration files

### Current Implementation

- **Encryption**: Uses age (modern encryption tool) with public/private key pairs
- **Configuration**: `.sops.yaml` defines encryption rules and recipients
- **Secrets File**: `secrets/prod.enc.tfvars` contains encrypted infrastructure variables
- **Workflows**: 3 GitHub Actions workflows automatically decrypt/encrypt secrets

## Age Encryption Key Management

### How Age Encryption Works

Age uses a simple public/private key pair system:

- **Public Key** (`age1...`): Used for encryption, safe to commit to repository
- **Private Key** (`AGE-SECRET-KEY-1...`): Used for decryption, kept secret

### Key Storage

```bash
# Public key (safe to share/commit)
# Stored in: .sops.yaml
age1q4qh3tay0jdchhcc5q0gkhhk7pdr2lx3dlpf5vpjsf69qen2g95sxmyfjh

# Private key (secret)
# Local: ~/.config/sops/age/keys.txt
# CI/CD: GitHub repository secret AGE_PRIVATE_KEY
AGE-SECRET-KEY-1...
```

### Key Locations

| Location | Key Type | Purpose |
|----------|----------|---------|
| `.sops.yaml` | Public | Repository encryption rules |
| `~/.config/sops/age/keys.txt` | Private | Local development |
| GitHub Secrets `AGE_PRIVATE_KEY` | Private | CI/CD workflows |

## Local Development Setup

### 1. Install Required Tools

```bash
# Install age encryption tool
sudo apt-get update
sudo apt-get install -y age

# Install SOPS (pinned to version used in CI)
SOPS_VERSION=v3.8.1
curl -Ls https://github.com/getsops/sops/releases/download/$SOPS_VERSION/sops-$SOPS_VERSION.linux.amd64 -o sops
sudo install -m 0755 sops /usr/local/bin/sops

# Verify installations
age --version
sops --version
```

### 2. Set Up Age Key

```bash
# Create SOPS age directory
mkdir -p ~/.config/sops/age

# Request the AGE_PRIVATE_KEY from team member with access
# Save it to the keys file:
echo "AGE-SECRET-KEY-1..." > ~/.config/sops/age/keys.txt

# Set proper permissions
chmod 600 ~/.config/sops/age/keys.txt
```

### 3. Verify Setup

```bash
# Test decryption (should show plaintext)
sops -d secrets/prod.enc.tfvars

# Test encryption (should show encrypted format)
echo 'test_var = "test_value"' | sops -e /dev/stdin
```

## Working with Encrypted Secrets

### File Structure

```
secrets/
├── prod.enc.tfvars     # Encrypted production variables
└── .gitignore          # Ensures no plaintext files committed

.sops.yaml              # SOPS configuration
```

### Decryption

```bash
# Decrypt to stdout (view only)
sops -d secrets/prod.enc.tfvars

# Decrypt to temporary file for editing
sops -d secrets/prod.enc.tfvars > /tmp/prod.tfvars
```

### Editing Workflow

```bash
# Method 1: Direct editing (recommended)
sops secrets/prod.enc.tfvars

# Method 2: Manual decrypt/encrypt
sops -d secrets/prod.enc.tfvars > /tmp/prod.tfvars
# Edit /tmp/prod.tfvars with your editor
sops -e /tmp/prod.tfvars > secrets/prod.enc.tfvars
# Clean up
shred -u /tmp/prod.tfvars
```

### Encryption

```bash
# Encrypt existing plaintext file
sops -e plaintext-file.tfvars > secrets/prod.enc.tfvars

# Encrypt in-place (overwrites original)
sops --encrypt --in-place secrets/prod.enc.tfvars
```

### Adding New Variables

```bash
# Edit the encrypted file directly
sops secrets/prod.enc.tfvars

# Add your new variables in HCL format:
# new_variable = "new_value"
# database_password = "secure-password-123"
```

## GitHub Actions Integration

### Automatic Decryption

All infrastructure workflows automatically decrypt secrets:

```yaml
- name: Install sops and age
  run: |
    sudo apt-get update
    sudo apt-get install -y age
    SOPS_VERSION=v3.8.1
    curl -Ls https://github.com/getsops/sops/releases/download/$SOPS_VERSION/sops-$SOPS_VERSION.linux.amd64 -o sops
    sudo install -m 0755 sops /usr/local/bin/sops

- name: Decrypt tfvars
  env:
    AGE_PRIVATE_KEY: ${{ secrets.AGE_PRIVATE_KEY }}
  run: |
    set -euo pipefail
    mkdir -p ~/.config/sops/age
    printf "%s\n" "$AGE_PRIVATE_KEY" > ~/.config/sops/age/keys.txt
    sops -d secrets/prod.enc.tfvars > infrastructure/cdktf/terraform.tfvars
```

### Automatic Re-encryption

The Release Build workflow automatically updates and re-encrypts secrets:

```yaml
- name: Bump docker_image in prod.enc.tfvars
  run: |
    set -euo pipefail
    tmpfile=$(mktemp)
    # Decrypt to temp file
    sops -d secrets/prod.enc.tfvars > "$tmpfile"
    # Update docker_image variable
    sed -E -i "s|^\\s*docker_image\\s*=.*$|docker_image = \"$full_image\"|" "$tmpfile"
    # Re-encrypt in place
    mv "$tmpfile" secrets/prod.enc.tfvars
    sops --encrypt --in-place secrets/prod.enc.tfvars
    # Clean up
    shred -u "$tmpfile" || rm -f "$tmpfile"
```

### Security Measures

- Private key loaded from GitHub Secrets
- Temporary files are shredded after use
- Strict error handling (`set -euo pipefail`)
- No plaintext secrets in logs or artifacts

## Best Practices & Security

### ✅ Do This

```bash
# Always use direct editing when possible
sops secrets/prod.enc.tfvars

# Use secure temporary files when needed
tmpfile=$(mktemp)
# ... work with tmpfile ...
shred -u "$tmpfile"

# Verify encryption before committing
sops -d secrets/prod.enc.tfvars | head -5

# Use proper file permissions
chmod 600 ~/.config/sops/age/keys.txt
```

### ❌ Never Do This

```bash
# Don't create plaintext secret files in the repo
echo "secret=value" > secrets/prod.tfvars  # ❌

# Don't leave temporary files around
sops -d secrets/prod.enc.tfvars > secrets/plaintext.tfvars  # ❌

# Don't commit without verifying encryption
git add secrets/prod.enc.tfvars  # Verify it's encrypted first!

# Don't share private keys in chat/email
echo "My age key is: AGE-SECRET-KEY-1..."  # ❌
```

### Security Checklist

- [ ] Private keys are never committed to repository
- [ ] Temporary plaintext files are immediately cleaned up
- [ ] File permissions are restrictive (`600` for keys)
- [ ] Changes are verified as encrypted before committing
- [ ] Regular key rotation schedule is followed
- [ ] Team members have secure key sharing process

## Troubleshooting

### "Failed to get data key"

```bash
# Check if age key is properly set up
ls -la ~/.config/sops/age/keys.txt

# Verify key format (should start with AGE-SECRET-KEY-1)
head -1 ~/.config/sops/age/keys.txt

# Check if key matches public key in .sops.yaml
age-keygen -y ~/.config/sops/age/keys.txt
```

### "No SOPS configuration found"

```bash
# Ensure you're in the repository root
pwd  # Should be /path/to/grid

# Check .sops.yaml exists
ls -la .sops.yaml

# Verify file path matches SOPS rules
cat .sops.yaml
```

### "Age recipient not found"

```bash
# Check if public key in .sops.yaml matches your private key
age-keygen -y ~/.config/sops/age/keys.txt

# Compare with public key in .sops.yaml
grep age .sops.yaml
```

### GitHub Actions Failing

```bash
# Verify AGE_PRIVATE_KEY is set in repository secrets
# Go to: Repository Settings → Secrets and variables → Actions
# Check that AGE_PRIVATE_KEY exists and contains valid key

# Test key format locally
echo "$AGE_PRIVATE_KEY" | head -1  # Should start with AGE-SECRET-KEY-1
```

### File Not Decrypting

```bash
# Check if file is actually encrypted
head -5 secrets/prod.enc.tfvars  # Should show SOPS metadata

# Try manual decryption with verbose output
sops -d --verbose secrets/prod.enc.tfvars
```

### Emergency Recovery

If you lose access to secrets:

1. **Generate new age key pair**:
   ```bash
   age-keygen -o ~/.config/sops/age/keys.txt
   ```

2. **Update .sops.yaml with new public key**

3. **Re-encrypt all secret files**:
   ```bash
   sops updatekeys secrets/prod.enc.tfvars
   ```

4. **Update GitHub repository secret** with new private key

5. **Share new private key** securely with team members

---

For additional help, refer to:
- [SOPS Documentation](https://github.com/getsops/sops)
- [Age Documentation](https://github.com/FiloSottile/age)
- Repository `.sops.yaml` configuration
- GitHub Actions workflow files in `.github/workflows/`