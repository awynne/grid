# Secrets Management (SOPS + age)

This repo uses SOPS with age to store secrets in Git as encrypted files you can still view and edit locally.

## What’s Encrypted
- `secrets/prod.enc.tfvars` (Terraform/CDKTF variables for production)
- Plain `.tfvars` are ignored by Git via `.gitignore`.

## One‑Time Setup
1. Install age and sops
   - macOS: `brew install age sops`
   - Linux: `sudo apt-get install -y age` and download sops from GitHub Releases
2. Generate an age key
   - `age-keygen -o ~/.config/sops/age/keys.txt`
3. Add your public key to `.sops.yaml`
   - Already configured in this repo. If rotating, update the `age: ["age1..."]` recipient.

## Editing and Encrypting
- Edit and auto-encrypt on save:
  - `sops secrets/prod.enc.tfvars`
  - For additional environments in the future, create corresponding `secrets/<env>.enc.tfvars` files and encrypt with `sops`.
- View plaintext (without editing):
  - `sops -d secrets/prod.enc.tfvars | less`

Tips
- Never commit plaintext `.tfvars` — they’re ignored by `.gitignore`.
- Only commit the `*.enc.tfvars` files.

## CI/CD Decryption (GitHub Actions)
- Add the private key to GitHub Environment secrets for the environment used by the workflow job.
  - Name: `AGE_PRIVATE_KEY`
  - Value: full contents of `~/.config/sops/age/keys.txt`
  - Example: if your environment is named `gridpulse/prod`, add `AGE_PRIVATE_KEY` under that environment.
- The deploy workflow will:
  1. Install age + sops
  2. Write `AGE_PRIVATE_KEY` to `~/.config/sops/age/keys.txt`
  3. Decrypt `secrets/prod.enc.tfvars` → `infrastructure/cdktf/terraform.tfvars`
  4. Run CDKTF with those variables

## Variables to Include
Example keys for `prod.enc.tfvars` (replace values when editing with `sops`):
```
railway_token     = "<Railway Project Token>"
project_id        = "<Railway Project UUID>"
postgres_password = "<password>"
session_secret    = "<32+ chars>"
eia_api_key       = "<optional>"

docker_image      = "ghcr.io/<owner>/grid:<tag>"
docker_username   = "<GHCR username>"
docker_password   = "<GHCR token>"
```

## Key Rotation
1. Generate a new age key and back it up
2. Update `.sops.yaml` with the new public key (you can list multiple recipients during transition)
3. Re-encrypt files:
   - `sops --encrypt --in-place secrets/prod.enc.tfvars`
4. Update `AGE_PRIVATE_KEY` secret in GitHub Environments

## Notes
- Railway tokens: Use a Project Token for CI. Store it encrypted in the tfvars file.
- Prefer GitHub Environment secrets for `AGE_PRIVATE_KEY` (prod/test) with protection rules.
