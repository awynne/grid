# Ubuntu Development Setup Guide

**Status**: 🆕 New
**Created**: 2025-08-27

This guide provides detailed, step-by-step instructions for setting up the GridPulse development environment on a fresh Ubuntu 22.04 LTS installation.

## 1. System Update

First, update your system's package list and upgrade installed packages:

```bash
sudo apt-get update && sudo apt-get upgrade -y
```

## 2. Install Dependencies

### 2.1. Install Node.js and npm

GridPulse requires Node.js version 20 and npm version 10. We'll use `nvm` (Node Version Manager) to install and manage Node.js versions.

```bash
# Install curl
sudo apt-get install curl -y

# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Load nvm into the current shell session
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Install Node.js v20 and set it as the default
nvm install 20
nvm use 20
nvm alias default 20

# Verify the installation
node -v # Should be v20.x.x
npm -v  # Should be 10.x.x
```

### 2.2. Install PostgreSQL and TimescaleDB

GridPulse uses PostgreSQL with the TimescaleDB extension.

```bash
# Add PostgreSQL repository
sudo sh -c "echo 'deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main' > /etc/apt/sources.list.d/pgdg.list"
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update

# Install PostgreSQL 15
sudo apt-get -y install postgresql-15

# Add TimescaleDB repository
sudo add-apt-repository -y ppa:timescale/timescaledb-ppa
sudo apt-get update

# Install TimescaleDB for PostgreSQL 15
sudo apt-get -y install timescaledb-2-postgresql-15

# Run the TimescaleDB setup
sudo timescaledb-tune --pg-config=/usr/bin/pg_config --yes

# Restart PostgreSQL to apply the changes
sudo service postgresql restart
```

## 3. Database Configuration

### 3.1. Create a Database and User

We'll create a dedicated user and database for the GridPulse application.

```bash
# Switch to the postgres user
sudo -u postgres psql

# Inside the psql shell, run the following commands:
CREATE DATABASE gridpulse_dev;
CREATE USER gridpulse_user WITH ENCRYPTED PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE gridpulse_dev TO gridpulse_user;

# Exit the psql shell
\q
```

### 3.2. Enable TimescaleDB Extension

Now, connect to the new database and enable the TimescaleDB extension.

```bash
# Connect to the new database as the new user
psql -U gridpulse_user -d gridpulse_dev

# Inside the psql shell, run the following command:
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

# Exit the psql shell
\q
```

## 4. Project Setup

### 4.1. Clone the Repository

```bash
git clone https://github.com/awynne/grid.git
cd grid
```

### 4.2. Install Project Dependencies

```bash
npm install
```

### 4.3. Configure Environment Variables

Copy the example `.env` file and update it with your local database credentials.

```bash
cp .env.example .env
```

Now, open the `.env` file and update the `DATABASE_URL`:

```
DATABASE_URL="postgresql://gridpulse_user:your_strong_password@localhost:5432/gridpulse_dev"
```

You will also need to generate a `SESSION_SECRET`:

```bash
openssl rand -base64 32
```

Copy the output and add it to your `.env` file:

```
SESSION_SECRET="your_generated_secret"
```

## 5. Database Setup

Now that the project is configured, we can set up the database schema and seed it with data.

```bash
npm run db:setup
```

This command will:

1.  Generate the Prisma client.
2.  Push the database schema to your local database.
3.  Apply TimescaleDB-specific features.
4.  Seed the database with initial data.

## 6. Run the Development Server

Finally, you can start the development server:

```bash
npm run dev
```

The application should now be running at `http://localhost:3000`.

## 7. Troubleshooting

*   **PostgreSQL Connection Issues**: Ensure that the PostgreSQL service is running (`sudo service postgresql status`) and that your credentials in the `.env` file are correct.
*   **nvm command not found**: If you get `nvm: command not found` in a new terminal, you may need to add the following lines to your `~/.bashrc` or `~/.zshrc` file:

    ```bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
    ```
