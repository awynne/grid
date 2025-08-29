# GridPulse Project Context

This repository uses comprehensive documentation in `docs/` to guide development. See [docs/README.md](./docs/README.md) for complete navigation and detailed descriptions.

## Quick References

**Start here:** [docs/README.md](./docs/README.md) - Complete documentation overview with navigation guide

**Key workflows:**
- [Process guidelines](./docs/process.md) - Spec-first development rule and project workflow
- [Universal coding standards](./docs/coding.md) - Language-agnostic principles and security
- [React Router specifics](./docs/coding-react-router.md) - TypeScript, React, database patterns
- [Current status](./docs/specs/status.md) - Implementation progress and active work

**For specific tasks:**
- Creating features: Follow [process.md](./docs/process.md) spec-first development
- Code implementation: Apply [coding.md](./docs/coding.md) + [coding-react-router.md](./docs/coding-react-router.md)
- Understanding context: Check [activity/daily.md](./docs/activity/daily.md) for recent decisions

## Project Overview
GridPulse is an electric grid data visualization platform built with React Router stack, providing near real-time insights from EIA-930 hourly electric grid data. The platform follows spec-first development methodology with comprehensive documentation standards.

## Infrastructure Commands

**IMPORTANT**: All Railway CLI commands require auto-confirmation. Always prefix with `yes |`:

```bash
# Infrastructure management (CDKTF)
cd infrastructure/cdktf
yes | ./scripts/manage-environments.sh destroy prod
yes | ./scripts/manage-environments.sh deploy prod  
yes | ./scripts/manage-environments.sh recreate prod
yes | ./scripts/manage-environments.sh plan prod
```

**Deployment Method**: Docker-based deployment using `railway.json` with `"builder": "DOCKERFILE"`