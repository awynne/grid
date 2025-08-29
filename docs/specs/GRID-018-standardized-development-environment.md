# GRID-018: Standardized Development Environment

**Status**: 🆕 New
**Priority**: High
**Created**: 2025-08-27
**Updated**: 2025-08-27
**Type**: Infrastructure Spec

**Issue Link**:

## Overview

This document proposes a standardized development environment for the GridPulse project to improve developer onboarding, reduce setup friction, and ensure consistency across all development machines.

## Problem Statement

The current development setup process is manual, error-prone, and dependent on a shared cloud database. This leads to several problems:

*   **Inconsistent Environments**: Developers may have different versions of Node.js, npm, or other dependencies, leading to "it works on my machine" issues.
*   **Complex Onboarding**: New developers have to follow a lengthy and complex set of instructions to set up their environment, which can be a significant barrier to contribution.
*   **Shared Database Bottleneck**: The reliance on a shared Railway database for development can lead to conflicts, and makes it difficult to work offline or in isolation.
*   **Manual and Error-Prone Setup**: The manual process of creating `.env` files and setting up the database is tedious and prone to errors.

## Research and Analysis

### Current Development Environment

The existing development environment is documented in `docs/development-setup.md`. It consists of:

*   **Languages and Frameworks**: React, TypeScript, Node.js
*   **Build Tools**: Vite, npm
*   **Database**: PostgreSQL with TimescaleDB (hosted on Railway)
*   **Dependencies**: Node.js >= 20.0.0, npm >= 10.0.0

The setup process involves manual installation of dependencies, manual configuration of environment variables, and a multi-step database setup process.

### Proposed Solutions

I have researched three potential solutions to standardize the development environment:

1.  **Dev Container (VS Code Remote - Containers)**
2.  **Setup Script**
3.  **Nix/NixOS**

#### 1. Dev Container

A Dev Container defines a development environment using a `devcontainer.json` file and a `Dockerfile`. This allows for a fully containerized, pre-configured, and reproducible development environment.

*   **Pros**:
    *   **Maximum Consistency**: The exact same environment for every developer, every time.
    *   **Fully Automated Setup**: `npm install`, database setup, and other initialization steps can be fully automated.
    *   **Isolated Environment**: The development environment is completely isolated from the host machine.
    *   **Excellent Tooling**: Great integration with VS Code.
    *   **Self-Contained Database**: Can include a local PostgreSQL/TimescaleDB container, removing the dependency on a shared cloud database.

*   **Cons**:
    *   **Docker Dependency**: Requires developers to have Docker installed.
    *   **Learning Curve**: A small learning curve for those unfamiliar with Docker.

#### 2. Setup Script

A shell script (e.g., `setup-dev-env.sh`) can be created to automate the setup process on the developer's local machine.

*   **Pros**:
    *   **Simple to Create**: Relatively easy to write and understand for simple setups.
    *   **No Docker Required**: No need for developers to install Docker.

*   **Cons**:
    *   **Brittle and Unreliable**: The script would need to handle different operating systems, shell environments, and existing tool versions, making it complex and prone to breaking.
    *   **Incomplete Isolation**: Does not provide the same level of isolation as a containerized solution.
    *   **Complex Database Setup**: Automating PostgreSQL/TimescaleDB setup across different OSs is very difficult.

#### 3. Nix/NixOS

Nix is a powerful package manager that can create reproducible development environments defined in a `shell.nix` or `flake.nix` file.

*   **Pros**:
    *   **High Reproducibility**: Guarantees that every developer has the exact same package versions.
    *   **Declarative Configuration**: The environment is defined in a declarative file.

*   **Cons**:
    *   **Steep Learning Curve**: Nix has a reputation for being difficult to learn.
    *   **Smaller Community**: Less community support and a smaller ecosystem compared to Docker.
    *   **Limited Tooling Integration**: Not as well-integrated with IDEs like VS Code compared to Dev Containers.

### Comparison

| Feature | Dev Container | Setup Script | Nix/NixOS |
| :--- | :--- | :--- | :--- |
| **Consistency** | ✅ High | ❌ Low | ✅ High |
| **Automation** | ✅ High | 🟡 Medium | ✅ High |
| **Isolation** | ✅ High | ❌ Low | ✅ High |
| **Ease of Use** | 🟡 Medium | ✅ High | ❌ Low |
| **Database Mgmt** | ✅ Easy | ❌ Hard | 🟡 Medium |
| **Dependencies** | Docker | Shell | Nix |

## Recommendation

I recommend adopting the **Dev Container** approach for the GridPulse project.

The Dev Container provides the best balance of consistency, automation, and ease of use for developers. It directly addresses all the pain points of the current setup process. While it does require Docker, the benefits of a fully reproducible and automated development environment far outweigh this requirement. The ability to include a local, containerized TimescaleDB instance is a major advantage, as it will allow developers to work more efficiently and independently.

## Implementation Plan

1.  **Create `docs/ubuntu-development-setup.md`**: This new file will contain a detailed, step-by-step guide for setting up the development environment on a fresh Ubuntu installation.
2.  **The guide will include instructions for**:
    *   Installing Node.js (v20) and npm (v10).
    *   Installing PostgreSQL (v15) and the TimescaleDB extension.
    *   Configuring PostgreSQL for local development.
    *   Cloning the repository.
    *   Installing project dependencies using `npm install`.
    *   Creating and configuring a `.env` file for local development.
    *   Running the database setup scripts (`npm run db:setup`).
    *   Starting the development server (`npm run dev`).
3.  **Update `docs/development-setup.md`**: This file will be updated to link to the new Ubuntu-specific guide and deprecate the old instructions.

## Future Considerations

*   **Dev Container**: After evaluating the effectiveness of the manual setup guide, the team can decide whether to proceed with a Dev Container implementation for even greater consistency and automation.
*   **Other Operating Systems**: Guides for other operating systems like macOS and Windows could be created if there is demand from the community.

Future Considerations

*   **Dev Container**: After evaluating the effectiveness of the manual setup guide, the team can decide whether to proceed with a Dev Container implementation for even greater consistency and automation.
*   **Other Operating Systems**: Guides for other operating systems like macOS and Windows could be created if there is demand from the community.

