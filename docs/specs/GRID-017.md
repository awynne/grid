# GRID-017: Minimal GridPulse UI Setup

**Status**: 🆕 New  
**Priority**: High  
**Created**: 2025-08-22  
**Updated**: 2025-08-22  
**Type**: Infrastructure Spec

**Issue Link**: https://github.com/awynne/grid/issues/19

## Overview

Initialize the minimal GridPulse UI application with React Router v7 (formerly Remix), TypeScript, shadcn/ui, and basic dashboard structure to enable local development and Railway deployment.

## Problem Statement

Currently, the GridPulse project has comprehensive specifications and design system documentation but no running application code. We need a minimal working UI that can:
- Run locally for development
- Deploy to Railway for production testing
- Serve as foundation for implementing F0-F4 features
- Demonstrate the design system in action

## Scope

### In Scope
- React Router v7 application initialization with TypeScript
- shadcn/ui component library setup
- Basic dashboard layout with navigation
- Minimal BA selector and date picker components
- Placeholder cards for F1-F4 features
- Local development environment setup
- Production build configuration
- React Router v7 routing structure with routes.ts

### Out of Scope
- Data ingestion or API integration (GRID-013)
- Database setup (GRID-012)
- Railway deployment (GRID-011)
- Full feature implementations (F1-F4)
- Authentication system
- Real data visualization

## Technical Requirements

### Application Structure
Following the coding standards from `docs/coding-react-router.md`:

```
app/
├── components/
│   ├── ui/                 # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── select.tsx
│   │   └── index.ts
│   ├── gridpulse/         # GridPulse-specific components
│   │   ├── BASelector.tsx
│   │   ├── DateRangePicker.tsx
│   │   ├── DashboardCard.tsx
│   │   └── index.ts
│   └── layout/
│       ├── Header.tsx
│       ├── Navigation.tsx
│       └── Layout.tsx
├── lib/
│   ├── utils.ts           # cn utility and helpers
│   └── constants.ts       # BA codes, fuel types
├── types/
│   ├── GridPulse.ts       # Domain types
│   └── index.ts
├── routes/
│   ├── _index.tsx         # Dashboard home
│   ├── daily.tsx          # F1 Daily Pulse placeholder
│   ├── wpm.tsx            # F2 What's Powering Me placeholder
│   ├── ducks.tsx          # F3 Duck Days placeholder
│   └── diff.tsx           # F4 What Changed placeholder
├── root.tsx               # Root layout with design system
└── entry.client.tsx
```

### Dependencies
Based on the design system and coding standards:

```json
{
  "dependencies": {
    "react-router": "^7.0.0",
    "@react-router/node": "^7.0.0", 
    "@react-router/serve": "^7.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "@react-router/dev": "^7.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "@tailwindcss/typography": "^0.5.0",
    "vite": "^5.0.0"
  }
}
```

**shadcn/ui Setup:**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card select calendar popover badge alert table
```

### Design System Integration

#### CSS Variables (from GRID-016)
```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* shadcn/ui base variables */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    
    /* GridPulse fuel colors */
    --fuel-solar: 45 93% 47%;
    --fuel-wind: 142 76% 36%;
    --fuel-gas: 25 95% 53%;
    --fuel-coal: 0 84% 60%;
    --fuel-nuclear: 262 83% 58%;
    --fuel-hydro: 199 89% 48%;
    
    /* GridPulse spacing */
    --dashboard-gap: 1.5rem;
    --container-max-width: 1280px;
  }
}
```

#### Component Examples

**BASelector Component:**
```typescript
// app/components/gridpulse/BASelector.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BALANCING_AUTHORITIES } from "@/lib/constants";

interface BASelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export function BASelector({ value, onValueChange }: BASelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select Balancing Authority" />
      </SelectTrigger>
      <SelectContent>
        {BALANCING_AUTHORITIES.map((ba) => (
          <SelectItem key={ba.code} value={ba.code}>
            {ba.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

**Dashboard Layout:**
```typescript
// app/routes/home.tsx
import type { Route } from "./+types/home";
import { BASelector } from "@/components/gridpulse/BASelector";
import { DashboardCard } from "@/components/gridpulse/DashboardCard";

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">GridPulse</h1>
        <div className="flex items-center gap-4">
          <BASelector />
          {/* DateRangePicker placeholder */}
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Daily Pulse"
          description="Auto-generated daily narrative with annotated chart"
          href="/daily"
          status="placeholder"
        />
        <DashboardCard
          title="What's Powering Me"
          description="Current CO₂ intensity and next clean window"
          href="/wpm"
          status="placeholder"
        />
        <DashboardCard
          title="Duck Days"
          description="Discoverable gallery of duck curve patterns"
          href="/ducks"
          status="placeholder"
        />
        <DashboardCard
          title="What Changed"
          description="Daily diff cards vs baseline metrics"
          href="/diff"
          status="placeholder"
        />
      </div>
    </div>
  );
}
```

### Development Environment

#### Database Strategy: Railway Development Database

**Chosen Approach**: Use Railway's PostgreSQL with TimescaleDB for local development

**Rationale:**
- ✅ **Same as production** (TimescaleDB with PostgreSQL)
- ✅ **No local setup complexity** (no Docker required)
- ✅ **Consistent environment** across dev/staging/prod
- ✅ **Railway free tier** covers development usage
- ✅ **Easy team sharing** of development data
- ✅ **Automatic backups** and managed infrastructure

#### Database Setup Process

**1. Railway Project Setup:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and create development project
railway login
railway init --name "gridpulse-dev"

# Add PostgreSQL with TimescaleDB
railway add postgresql
```

**2. Enable TimescaleDB Extension:**
```bash
# Connect to Railway database and enable TimescaleDB
railway run 'psql $DATABASE_URL -c "CREATE EXTENSION IF NOT EXISTS timescaledb;"'

# Verify extension is installed
railway run 'psql $DATABASE_URL -c "SELECT * FROM pg_extension WHERE extname = '\''timescaledb'\'';"'
```

**3. Local Environment Configuration:**
```bash
# Link local project to Railway
railway link

# Get database URL for local development
railway variables

# Copy DATABASE_URL to .env.local
echo "DATABASE_URL=postgresql://..." >> .env.local
echo "SESSION_SECRET=your-local-32-char-secret-key-here" >> .env.local
echo "NODE_ENV=development" >> .env.local
echo "PORT=3000" >> .env.local
```

#### Prisma Setup for Development

**1. Install and Initialize Prisma:**
```bash
# Install Prisma
npm install prisma @prisma/client

# Initialize Prisma (creates prisma/ directory)
npx prisma init

# Update DATABASE_URL in .env to match Railway
```

**2. Basic Schema for GRID-017:**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Basic schema for minimal UI
model BalancingAuthority {
  id        String   @id @default(cuid())
  code      String   @unique // "PJM", "CAISO", "MISO"
  name      String   // "PJM Interconnection"
  timezone  String   // "America/New_York"
  region    String?  // "Eastern", "Western", "Texas"
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("balancing_authorities")
}
```

**3. Database Operations:**
```bash
# Generate Prisma client
npx prisma generate

# Push schema to Railway development database
npx prisma db push

# Open Prisma Studio (visual database browser)
npx prisma studio

# Seed development data
npx prisma db seed
```

#### Development Seed Data

**Create seed script:**
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed balancing authorities for development
  const balancingAuthorities = [
    { code: 'PJM', name: 'PJM Interconnection', timezone: 'America/New_York', region: 'Eastern' },
    { code: 'CAISO', name: 'California ISO', timezone: 'America/Los_Angeles', region: 'Western' },
    { code: 'MISO', name: 'Midcontinent ISO', timezone: 'America/Chicago', region: 'Central' },
    { code: 'ERCOT', name: 'Electric Reliability Council of Texas', timezone: 'America/Chicago', region: 'Texas' },
    { code: 'SPP', name: 'Southwest Power Pool', timezone: 'America/Chicago', region: 'Central' },
  ];

  for (const ba of balancingAuthorities) {
    await prisma.balancingAuthority.upsert({
      where: { code: ba.code },
      update: {},
      create: ba,
    });
  }

  console.log('✅ Development database seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Configure seed in package.json:**
```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  },
  "scripts": {
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio",
    "db:push": "prisma db push",
    "db:reset": "prisma db push --force-reset && prisma db seed"
  }
}
```

#### Local Development Workflow

**Daily Development:**
```bash
# Start development server
npm run dev

# Database operations (as needed)
npm run db:studio    # Visual database browser
npm run db:push      # Push schema changes
npm run db:seed      # Seed development data
npm run db:reset     # Reset and reseed database
```

**Environment Variables (.env.local):**
```bash
# Railway development database
DATABASE_URL="postgresql://postgres:password@roundhouse.proxy.rlwy.net:12345/railway"

# Local development
SESSION_SECRET="your-local-32-char-secret-key-for-development-only"
NODE_ENV="development"
PORT="3000"

# Optional for minimal UI (will add later)
REDIS_URL=""  # Not needed for GRID-017
EIA_API_KEY=""  # Not needed for GRID-017
```

**Expected URLs:**
- Local: `http://localhost:3000`
- Dashboard: `/` (home page)
- Feature placeholders: `/daily`, `/wpm`, `/ducks`, `/diff`
- Database Studio: `http://localhost:5555` (via `npm run db:studio`)

#### Database Connection in App

**Type-safe environment setup:**
```typescript
// app/lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32),
  PORT: z.string().default("3000"),
  
  // Optional for minimal UI phase
  REDIS_URL: z.string().url().optional(),
  EIA_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
```

**Prisma client setup:**
```typescript
// app/lib/db.server.ts
import { PrismaClient } from '@prisma/client';

let db: PrismaClient;

declare global {
  var __db__: PrismaClient;
}

// Prevent multiple instances in development
if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient();
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient();
  }
  db = global.__db__;
}

export { db };
```

#### Migration Path to Production

**Development → Production Transition:**
1. **GRID-017**: Use Railway dev database with basic Prisma schema
2. **GRID-011**: Set up production Railway infrastructure
3. **GRID-012**: Implement full TimescaleDB schema with hypertables
4. **Data Migration**: Use Prisma migrations to transition from dev to prod schema

**Cost Management:**
- **Development**: Railway free tier (1GB storage, shared compute)
- **Production**: Railway Hobby plan (~$5/month for PostgreSQL)
- **Monitoring**: Set up Railway usage alerts at 80% of free tier limits

### Placeholder Data

**Constants for Development:**
```typescript
// app/lib/constants.ts
export const BALANCING_AUTHORITIES = [
  { code: 'CISO', name: 'California ISO' },
  { code: 'ERCOT', name: 'Electric Reliability Council of Texas' },
  { code: 'PJM', name: 'PJM Interconnection' },
  { code: 'MISO', name: 'Midcontinent ISO' },
  { code: 'SPP', name: 'Southwest Power Pool' },
];

export const FUEL_TYPES = {
  SOLAR: { color: 'hsl(var(--fuel-solar))', name: 'Solar' },
  WIND: { color: 'hsl(var(--fuel-wind))', name: 'Wind' },
  GAS: { color: 'hsl(var(--fuel-gas))', name: 'Natural Gas' },
  COAL: { color: 'hsl(var(--fuel-coal))', name: 'Coal' },
  NUCLEAR: { color: 'hsl(var(--fuel-nuclear))', name: 'Nuclear' },
  HYDRO: { color: 'hsl(var(--fuel-hydro))', name: 'Hydro' },
};
```

## Implementation Tasks

### Phase 1: Project Initialization
- [ ] Initialize Remix application with TypeScript
- [ ] Configure Tailwind CSS and PostCSS
- [ ] Set up shadcn/ui component library
- [ ] Create basic folder structure following coding standards

### Phase 2: Design System Integration
- [ ] Implement CSS variables from GRID-016 design system
- [ ] Create utility functions and constants
- [ ] Set up TypeScript types for GridPulse domain
- [ ] Configure absolute imports (@/components, @/lib, etc.)

### Phase 3: Core Components
- [ ] Build BASelector component with placeholder data
- [ ] Create DashboardCard component for feature placeholders
- [ ] Implement basic Header and Navigation components
- [ ] Create Layout component with responsive design

### Phase 4: Route Structure
- [ ] Set up dashboard home page (/)
- [ ] Create placeholder routes for F1-F4 features
- [ ] Implement basic navigation between routes
- [ ] Add loading states and error boundaries

### Phase 5: Local Development
- [ ] Configure development server with hot reload
- [ ] Test responsive design on different screen sizes
- [ ] Verify all components render correctly
- [ ] Validate accessibility basics (keyboard navigation, focus)

### Phase 6: Production Build
- [ ] Configure production build settings
- [ ] Test production build locally
- [ ] Optimize bundle size and performance
- [ ] Prepare for Railway deployment

## Success Criteria

### Functionality Requirements
- [ ] Application runs locally on `http://localhost:3000`
- [ ] Dashboard displays with GridPulse branding and layout
- [ ] BA selector shows 5 placeholder balancing authorities
- [ ] All 4 feature cards (F1-F4) are clickable and navigate to placeholder pages
- [ ] Responsive design works on mobile, tablet, and desktop
- [ ] Production build completes without errors

### Design System Compliance
- [ ] Uses shadcn/ui components as base layer
- [ ] Implements GridPulse color system with CSS variables
- [ ] Follows typography scale from design system
- [ ] Matches spacing and layout patterns from GRID-016
- [ ] Maintains accessibility standards (WCAG 2.1 AA basics)

### Code Quality Requirements
- [ ] Follows TypeScript guidelines from coding standards
- [ ] Uses proper component structure and file naming
- [ ] Implements absolute imports and barrel exports
- [ ] Includes proper error boundaries and loading states
- [ ] Passes basic linting and type checking

### Performance Requirements
- [ ] First paint < 2s on local development
- [ ] Production build < 500KB initial bundle
- [ ] Lighthouse performance score > 90
- [ ] No console errors or warnings

## Dependencies

### Prerequisite Specs
- **GRID-016**: Product Design System Specification (✅ Complete)
- **Remix Coding Standards**: Technical implementation guidelines

### Dependent Specs
- **GRID-011**: Railway Infrastructure Setup (for deployment)
- **GRID-012**: TimescaleDB Schema Implementation (for data layer)
- **GRID-013**: EIA Data Ingestion Service (for real data)

### External Dependencies
- Node.js 18+ for development environment
- npm or pnpm for package management
- Modern browser for testing (Chrome 90+, Firefox 88+, Safari 14+)

## Deliverables

### Primary Deliverable
- **Working Remix application** with minimal GridPulse UI

### Supporting Deliverables
- **Component library** with shadcn/ui + GridPulse extensions
- **Development setup** with hot reload and TypeScript
- **Production build** ready for Railway deployment
- **Documentation** for local development setup

## Future Considerations

### Immediate Next Steps (Post-GRID-017)
1. **GRID-011**: Deploy to Railway for production testing
2. **Feature Implementation**: Begin F1 Daily Pulse with real components
3. **Data Integration**: Connect to EIA API for real data

### Technical Debt Management
- **Component Testing**: Add Vitest unit tests for components
- **E2E Testing**: Playwright tests for user workflows  
- **Performance Monitoring**: Add performance tracking
- **Error Tracking**: Integrate Sentry for production monitoring

## Notes

This spec focuses on creating a working foundation that demonstrates the design system and provides a platform for feature development. The emphasis is on getting something running quickly while maintaining high code quality standards.

The minimal UI should feel professional and polished even with placeholder data, showcasing the GridPulse brand and design system effectively.
