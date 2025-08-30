# GridPulse

Electric grid data visualization platform providing near real-time insights from EIA-930 hourly electric grid data. This is a research-driven open source project.

## Licensing

[![Software: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Docs/Data: CC BY 4.0](https://img.shields.io/badge/Docs%2FData-CC--BY_4.0-green.svg)](https://creativecommons.org/licenses/by/4.0/)

### TL;DR

This repository uses a multi-license structure depending on content type:

- Software is licensed under Apache 2.0 
- Documentation and datasets are under CC BY 4.0 
- You’re free to use and adapt them; just keep the notices and cite us (see [NOTICE](NOTICE) for details).

### Details

- Software (everything except `docs/` and `data/`): Apache License 2.0. See [LICENSE](LICENSE).
- Documentation (`docs/`): Creative Commons Attribution 4.0 International (CC BY 4.0). See [docs/LICENSE](docs/LICENSE).
- Datasets (`data/`): CC BY 4.0. See [data/LICENSE](data/LICENSE).
- NOTICE: See [NOTICE](NOTICE) (must be preserved per Apache-2.0 §4(d)). It includes a non-binding citation request for both distributed software and publications.

## Documentation

All project documentation is located in the [`docs/`](./docs/) directory.

**Start here:** [docs/README.md](./docs/README.md)

The documentation includes:
- Development workflows and coding standards
- Technical specifications and implementation status  
- Product requirements and feature definitions
- Setup guides and deployment instructions

<!-- Removed redundant link to docs/README.md to avoid duplication. -->

## Releases

For the GitOps release flow (build image → PR bump → apply infra), see `infrastructure/cdktf/README.md` (Release Flow). In short:
- Publish Image (GHCR): builds/pushes the container image (no deploy).
- Release Build: builds/pushes and opens a PR to bump `docker_image` in SOPS tfvars.
- Plan + Apply Prod (CDKTF): applies the tag change to deploy; container runs migrations on startup.
