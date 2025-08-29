# React Router v7 Technical Standards

> **📋 Purpose**: Technology-specific guidelines for React Router v7 including TypeScript, React, Prisma, shadcn/ui, and deployment patterns.

> **🔗 See Also**: [General Coding Standards](./coding.md) for language-agnostic principles, Git workflow, and universal development practices.

 

## Table of Contents
- [TypeScript Guidelines](#typescript-guidelines)
- [React Router v7 Conventions](#react-router-v7-conventions)
- [React Component Guidelines](#react-component-guidelines)
- [Database Guidelines](#database-guidelines)
- [CSS/Styling Conventions](#cssstyling-conventions)
- [File Naming & Structure](#file-naming--structure)
- [Environment & Configuration](#environment--configuration)
- [Progressive Web App Guidelines](#progressive-web-app-guidelines)
- [Testing Standards](#testing-standards)
- [Tools & Setup](#tools--setup)
- [Performance Guidelines](#performance-guidelines)

## TypeScript Guidelines

### Type Definitions
```typescript
// ✅ Use explicit return types for functions
export function calculateTax(amount: number): number {
  return amount * 0.08;
}

// ✅ Use const assertions for immutable data
const PAYMENT_METHODS = ['credit', 'debit', 'paypal'] as const;
type PaymentMethod = typeof PAYMENT_METHODS[number];

// ✅ Use branded types for domain-specific values
type UserId = string & { readonly brand: unique symbol };
type Email = string & { readonly brand: unique symbol };

// ✅ Prefer interfaces for object shapes
interface User {
  id: UserId;
  email: Email;
  createdAt: Date;
}

// ✅ Use utility types for transformations
type CreateUserInput = Omit<User, 'id' | 'createdAt'>;
```

### Error Handling
```typescript
// ✅ Use Result pattern for operations that can fail
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

// ✅ Create specific error types
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public code: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

## React Router v7 Conventions

### Route Configuration (routes.ts)
```typescript
// ✅ Define routes in app/routes.ts using the new configuration API
import { type RouteConfig, route, index, layout } from "@react-router/dev/routes";

export default [
  // Layout route with nested children
  layout("layouts/dashboard.tsx", [
    index("routes/home.tsx"),
    route("projects", "routes/projects.tsx", [
      index("routes/projects/index.tsx"),
      route(":projectId", "routes/projects/project.tsx"),
      route("new", "routes/projects/new.tsx"),
    ]),
  ]),
  route("about", "routes/about.tsx"),
] satisfies RouteConfig;
```

### File-Based Routing (Alternative)
```typescript
// ✅ Use flatRoutes for file-based routing (legacy-style alternative)
import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default flatRoutes() satisfies RouteConfig;
```

### Route File Structure
```bash
app/
├── routes.ts              # Route configuration
├── routes/
│   ├── home.tsx          # / route
│   ├── about.tsx         # /about route
│   ├── projects.tsx      # /projects layout
│   └── projects/
│       ├── index.tsx     # /projects index
│       ├── project.tsx   # /projects/:projectId
│       └── new.tsx       # /projects/new
└── layouts/
    └── dashboard.tsx     # Shared layout
```

### Data Loading Patterns
```typescript
// ✅ Use React Router v7 loader patterns with type safety
import type { Route } from "./+types/project";

export async function loader({ params, request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search') || '';
  
  try {
    // Validate params early to provide better error messages
    const projectId = z.string().uuid().parse(params.projectId);
    
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: { tasks: true }
    });
    
    if (!project) {
      throw new Response('Project not found', { status: 404 });
    }
    
    return { project, search };
  } catch (error) {
    // Log error for debugging while providing user-friendly message
    console.error('Failed to load project:', error);
    throw new Response('Unable to load project', { status: 500 });
  }
}

// ✅ Use typed component with generated route types
export default function ProjectPage({ loaderData }: Route.ComponentProps) {
  const { project, search } = loaderData;
  // TypeScript knows the exact shape of loaderData
  return <div>{project.name}</div>;
}
```

### Action Patterns
```typescript
// ✅ Use React Router v7 action patterns with type safety
import type { Route } from "./+types/project";
import { redirect } from "react-router";

export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');
  
  // Use intent pattern for multiple actions in one route
  switch (intent) {
    case 'create': {
      const result = await createProject(formData);
      if (!result.success) {
        // Return validation errors for the form to display
        return { errors: result.errors };
      }
      return redirect(`/projects/${result.data.id}`);
    }
    
    case 'delete': {
      // Confirm destructive actions
      const projectId = z.string().uuid().parse(params.projectId);
      await db.project.delete({ where: { id: projectId } });
      return redirect('/projects');
    }
    
    default:
      throw new Response('Invalid action', { status: 400 });
  }
}

// ✅ Access action data with type safety
export default function ProjectPage({ actionData }: Route.ComponentProps) {
  if (actionData?.errors) {
    // TypeScript knows actionData structure
    return <div>Error: {actionData.errors.message}</div>;
  }
  return <div>Project form</div>;
}
```

## React Component Guidelines

### Component Structure
```typescript
// ✅ Use this order for component elements
interface ComponentProps {
  // Props interface at the top
}

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks (useState, useEffect, etc.)
  // 2. Computed values and derived state
  // 3. Event handlers
  // 4. Effects
  // 5. Early returns/conditional rendering
  // 6. Main render
}
```

### Component Naming & Organization
```typescript
// ✅ Use PascalCase for components
export function ProjectCard({ project }: { project: Project }) {
  return <div>{project.name}</div>;
}

// ✅ Use descriptive names that indicate purpose
export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  // Badge color indicates urgency level for quick visual scanning
  const badgeColor = status === 'urgent' ? 'red' : 'green';
  return <Badge color={badgeColor}>{status}</Badge>;
}

// ✅ Co-locate related components
// components/
//   project/
//     ProjectCard.tsx
//     ProjectStatusBadge.tsx
//     ProjectForm.tsx
//     index.ts              // Export barrel
```

### State Management
```typescript
// ✅ Keep state as close to where it's used as possible
function ProjectForm() {
  // Form state stays in form component
  const [formData, setFormData] = useState<CreateProjectInput>({
    name: '',
    description: ''
  });
  
  // Derived state for validation
  const isValid = formData.name.length > 0 && formData.description.length > 0;
  
  return (
    <Form>
      <input 
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
      />
      <Button disabled={!isValid}>Create Project</Button>
    </Form>
  );
}
```

## Database Guidelines

### Prisma Schema Conventions
```prisma
// ✅ Use consistent naming conventions
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  // Use createdAt/updatedAt for all models that need timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Explicit relation naming prevents confusion
  projects Project[] @relation("UserProjects")
  
  @@map("users") // Map to snake_case table names
}

model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  // Foreign keys should be explicit
  ownerId     String
  owner       User     @relation("UserProjects", fields: [ownerId], references: [id])
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("projects")
}
```

### Database Query Patterns
```typescript
// ✅ Create reusable query functions
export async function findProjectWithTasks(projectId: string) {
  return await db.project.findUnique({
    where: { id: projectId },
    include: {
      tasks: {
        orderBy: { createdAt: 'desc' },
        // Only include what we need to reduce payload size
        select: { id: true, title: true, status: true, dueDate: true }
      },
      owner: {
        select: { id: true, name: true, email: true }
      }
    }
  });
}

// ✅ Use transactions for data consistency
export async function createProjectWithInitialTask(
  projectData: CreateProjectInput,
  taskData: CreateTaskInput
) {
  return await db.$transaction(async (tx) => {
    const project = await tx.project.create({ data: projectData });
    
    const task = await tx.task.create({
      data: { ...taskData, projectId: project.id }
    });
    
    return { project, task };
  });
}
```

### Authentication Patterns
```typescript
// ✅ Use React Router built-in session management with signed cookies
import { createCookieSessionStorage } from "react-router";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days (sliding expiration)
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET!],
    secure: process.env.NODE_ENV === "production",
  },
});

// ✅ OAuth provider configuration
const providers = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: `${process.env.BASE_URL}/auth/google/callback`
  },
  microsoft: {
    clientId: process.env.MICROSOFT_CLIENT_ID!,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
    redirectUri: `${process.env.BASE_URL}/auth/microsoft/callback`
  }
};

// ✅ Session management with sliding expiration
export async function getSession(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  
  // Extend session on each request (sliding expiration)
  if (session.has("userId")) {
    session.set("lastActivity", Date.now());
  }
  
  return session;
}
```

### Route Protection
```typescript
// ✅ Protected route pattern
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    throw redirect("/login?message=Please sign in to continue");
  }
  return json({ user });
}

// ✅ Admin-only routes
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    throw redirect("/login?message=Please sign in to continue");
  }
  if (user.role !== "admin") {
    throw redirect("/?message=Access denied. Admin privileges required.");
  }
  return json({ user });
}
```

### Input Validation
```typescript
// ✅ Validate all form inputs with Zod
const CreateProjectSchema = z.object({
  name: z.string().min(1, "Project name required").max(100),
  description: z.string().max(500).optional(),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const result = CreateProjectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });
  
  if (!result.success) {
    return json({ errors: result.error.flatten() }, { status: 400 });
  }
  
  // Process valid data
}
```

## CSS/Styling Conventions

### shadcn/ui Component Library
```typescript
// ✅ Use shadcn/ui components as foundation
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ✅ Extend shadcn components for domain-specific use cases
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{project.description}</p>
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline">
            Edit
          </Button>
          <Button size="sm" variant="destructive">
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### Design System with CSS Variables
```css
/* ✅ Extend shadcn's CSS variables for custom themes */
:root {
  /* shadcn base variables */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  
  /* Custom project-specific variables */
  --project-status-active: 142.1 76.2% 36.3%;
  --project-status-pending: 47.9 95.8% 53.1%;
  --project-status-completed: 215.4 16.3% 46.9%;
  
  /* Custom spacing for grid layouts */
  --grid-gap: 1.5rem;
  --container-max-width: 1280px;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 84% 4.9%;
  
  /* Adjust custom variables for dark mode */
  --project-status-active: 142.1 70.6% 45.3%;
  --project-status-pending: 47.9 95.8% 53.1%;
  --project-status-completed: 215.4 16.3% 56.9%;
}
```

### Component Styling Strategy
```typescript
// ✅ Layer custom styles on shadcn components
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";

interface ProjectButtonProps extends ButtonProps {
  status: "active" | "pending" | "completed";
}

export function ProjectStatusButton({ status, className, ...props }: ProjectButtonProps) {
  return (
    <Button
      className={cn(
        // Base styles from shadcn
        "relative",
        // Custom status styles
        {
          "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300": 
            status === "active",
          "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300": 
            status === "pending",
          "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300": 
            status === "completed",
        },
        className
      )}
      {...props}
    />
  );
}

// ✅ Custom component variants using cva (class-variance-authority)
import { cva, type VariantProps } from "class-variance-authority";

const projectCardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm transition-all",
  {
    variants: {
      priority: {
        low: "border-gray-200 dark:border-gray-800",
        medium: "border-yellow-200 dark:border-yellow-800",
        high: "border-red-200 dark:border-red-800 shadow-md",
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      priority: "low",
      size: "md",
    },
  }
);

export interface ProjectCardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof projectCardVariants> {}

export function ProjectCard({ className, priority, size, ...props }: ProjectCardProps) {
  return (
    <div className={cn(projectCardVariants({ priority, size }), className)} {...props} />
  );
}
```

### Responsive Design Patterns
```typescript
// ✅ Mobile-first responsive design with Tailwind
export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

// ✅ Responsive container patterns
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <nav className="flex h-16 items-center justify-between">
            {/* Navigation content */}
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
        {children}
      </main>
    </div>
  );
}
```

### Dark Mode Implementation
```typescript
// ✅ Theme provider setup
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: "system",
  setTheme: () => null,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ✅ Theme toggle component
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
```

### Form Styling with shadcn
```typescript
// ✅ Consistent form styling patterns
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  description: z.string().max(500).optional(),
});

export function ProjectForm() {
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter project name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter project description"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-2">
          <Button type="submit">Create Project</Button>
          <Button type="button" variant="outline">Cancel</Button>
        </div>
      </form>
    </Form>
  );
}
```

## File Naming & Structure

### File Naming Conventions
```bash
# ✅ PascalCase for all files (except routes)
ProjectCard.tsx           # Components
UserService.ts           # Services/utilities
ProjectTypes.ts          # Type definitions
DatabaseUtils.ts         # Utility functions
AuthContext.tsx          # Context providers

# ✅ Route conventions (legacy file-based)
dashboard.tsx            # /dashboard
dashboard.projects.tsx   # /dashboard/projects
dashboard.projects.$id.tsx  # /dashboard/projects/:id
_auth.login.tsx         # /login (with auth layout)
```

### Folder Organization
```bash
app/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── index.ts     # Barrel export
│   ├── project/         # Domain-specific components
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectForm.tsx
│   │   ├── ProjectList.tsx
│   │   └── index.ts
│   └── layout/          # Layout components
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Layout.tsx
├── lib/                 # Utility functions and configurations
│   ├── utils.ts         # General utilities (cn, etc.)
│   ├── auth.ts          # Authentication utilities
│   ├── database.ts      # Database configuration
│   └── validations.ts   # Zod schemas
├── types/               # TypeScript type definitions
│   ├── User.ts
│   ├── Project.ts
│   └── index.ts
├── hooks/               # Custom React hooks
│   ├── UseAuth.ts
│   ├── UseProjects.ts
│   └── index.ts
└── routes/              # Route files
    ├── _index.tsx       # Home page
    ├── login.tsx
    └── dashboard/
        ├── _layout.tsx
        └── projects/
            ├── _index.tsx
            └── $id.tsx
```

### Import/Export Patterns
```typescript
// ✅ Use barrel exports for clean imports
// components/project/index.ts
export { ProjectCard } from './ProjectCard';
export { ProjectForm } from './ProjectForm';
export { ProjectList } from './ProjectList';

// ✅ Import from barrel
import { ProjectCard, ProjectForm } from '@/components/project';

// ✅ Absolute imports for app code
import { Button } from '@/components/ui/Button';
import { UserService } from '@/lib/UserService';
import { User } from '@/types/User';

// ✅ Relative imports only for closely related files
import { ProjectCardSkeleton } from './ProjectCardSkeleton';

// ✅ Import ordering (use eslint-plugin-import)
// 1. React and external libraries
import React from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';

// 2. Internal imports (absolute paths)
import { UserService } from '@/lib/UserService';
import { User } from '@/types/User';

// 3. Relative imports
import { ProjectCardSkeleton } from './ProjectCardSkeleton';
```

### Component File Structure
```typescript
// ✅ Consistent internal component structure
// ProjectCard.tsx
import React from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Project } from '@/types/Project';

// Types at the top
interface ProjectCardProps {
  project: Project;
  onEdit?: () => void;
  onDelete?: () => void;
}

// Main component
export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{project.description}</p>
        <div className="flex gap-2 mt-4">
          {onEdit && (
            <Button size="sm" variant="outline" onClick={onEdit}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button size="sm" variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Sub-components (if needed)
function ProjectCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
      </CardContent>
    </Card>
  );
}

// Named exports for sub-components
export { ProjectCardSkeleton };
```

### Route File Organization
```typescript
// ✅ Route file structure
// routes/projects/project.tsx
import type { Route } from "./+types/project";
import { redirect } from "react-router";
import { ProjectForm } from '@/components/project';
import { ProjectService } from '@/lib/ProjectService';

// Types for this route
interface LoaderData {
  project: Project;
}

// Loader function with type safety
export async function loader({ params }: Route.LoaderArgs) {
  // Loader implementation
  const project = await ProjectService.findById(params.projectId);
  return { project };
}

// Action function with type safety
export async function action({ request, params }: Route.ActionArgs) {
  // Action implementation
  const formData = await request.formData();
  // Handle form submission
  return redirect('/projects');
}

// Route component with generated types
export default function ProjectDetailPage({ loaderData, actionData }: Route.ComponentProps) {
  const { project } = loaderData; // TypeScript knows the shape
  
  return (
    <div>
      <h1>{project.name}</h1>
      <ProjectForm project={project} />
    </div>
  );
}
```

### Type Definition Organization
```typescript
// ✅ Group related types in single files
// types/Project.ts
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}

export type ProjectStatus = 'active' | 'pending' | 'completed';

export type CreateProjectInput = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateProjectInput = Partial<CreateProjectInput>;

// types/index.ts - Barrel export
export type { Project, ProjectStatus, CreateProjectInput, UpdateProjectInput } from './Project';
export type { User, UserRole, CreateUserInput } from './User';
```

## Environment & Configuration

### React Router v7 Configuration
```typescript
// ✅ react-router.config.ts - Main configuration file
import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "app",
  buildDirectory: "build", 
  ssr: true, // Enable server-side rendering
  async prerender() {
    // Pre-render static routes
    return ["/", "/about"];
  },
  // Enable type generation for routes
  future: {
    unstable_typegen: true,
  },
} satisfies Config;
```

### TypeScript Configuration for Route Types
```json
// ✅ tsconfig.json - Include generated route types
{
  "include": [
    "app/**/*",
    ".react-router/types/**/*"
  ],
  "compilerOptions": {
    "rootDirs": [".", "./.react-router/types"]
  }
}
```

### Package.json Scripts
```json
{
  "scripts": {
    "build": "react-router build",
    "dev": "react-router dev",
    "start": "react-router-serve ./build/server/index.js",
    "typegen": "react-router typegen",
    "typecheck": "react-router typegen && tsc"
  }
}
```

### Environment Variable Naming
```bash
# ✅ Server-side only (never expose these)
DATABASE_URL="postgresql://user:pass@host:port/db"
SESSION_SECRET="your-secret-key-min-32-chars"
GOOGLE_CLIENT_SECRET="your-google-secret"
MICROSOFT_CLIENT_SECRET="your-microsoft-secret"

# ✅ Client-side safe (VITE_ prefix for Vite)
VITE_GOOGLE_CLIENT_ID="your-google-client-id"
VITE_MICROSOFT_CLIENT_ID="your-microsoft-client-id"
VITE_BASE_URL="https://your-app.railway.app"

# ✅ Environment-specific
NODE_ENV="production"
PORT="3000"
```

### Type-Safe Environment Variables
```typescript
// ✅ Create env validation schema
// lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32),
  
  // OAuth secrets (server-side only)
  GOOGLE_CLIENT_SECRET: z.string(),
  MICROSOFT_CLIENT_SECRET: z.string(),
  
  // Public variables (client-side safe)
  VITE_GOOGLE_CLIENT_ID: z.string(),
  VITE_MICROSOFT_CLIENT_ID: z.string(),
  VITE_BASE_URL: z.string().url(),
  
  // Optional variables
  PORT: z.string().default("3000"),
});

export const env = envSchema.parse(process.env);

// ✅ Use in app
import { env } from "@/lib/env";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    secrets: [env.SESSION_SECRET],
    secure: env.NODE_ENV === "production",
  },
});
```

### Railway Deployment Setup
```bash
# Docker-based deployment on Railway
# - Railway will build using your repo Dockerfile
# - Health checks come from Dockerfile HEALTHCHECK
# - Configure env vars in Railway dashboard
```

```bash
# ✅ Set production environment variables in Railway dashboard
DATABASE_URL="${{Postgres.DATABASE_URL}}"  # Auto-generated by Railway
SESSION_SECRET="generate-secure-32-char-secret"
GOOGLE_CLIENT_SECRET="prod-google-secret"
MICROSOFT_CLIENT_SECRET="prod-microsoft-secret"
VITE_GOOGLE_CLIENT_ID="prod-google-client-id"
VITE_MICROSOFT_CLIENT_ID="prod-microsoft-client-id"
VITE_BASE_URL="https://your-app.railway.app"
NODE_ENV="production"
PORT="${{PORT}}"  # Auto-generated by Railway
```

## Progressive Web App Guidelines

### App Manifest & Installability
```json
// ✅ public/manifest.json
{
  "name": "GridPulse",
  "short_name": "GridPulse",
  "description": "Electric grid insights from EIA-930 data",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "orientation": "portrait-primary",
  "categories": ["productivity", "business"],
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ]
}
```

```typescript
// ✅ Add manifest to root.tsx
// app/root.tsx
export function links(): LinksFunction {
  return [
    { rel: "manifest", href: "/manifest.json" },
    { rel: "icon", href: "/favicon.ico" },
    { rel: "apple-touch-icon", href: "/icons/icon-192.png" },
  ];
}

export function meta(): MetaFunction {
  return [
    { name: "theme-color", content: "#2563eb" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "default" },
    { name: "apple-mobile-web-app-title", content: "Grid" },
  ];
}
```

## Testing Standards

### Unit Tests
```typescript
// ✅ Test behavior, not implementation
import { describe, it, expect } from 'vitest';
import { calculateTax } from './tax-calculator';

describe('Tax Calculator', () => {
  it('should calculate correct tax for standard rate', () => {
    // Given a taxable amount
    const amount = 100;
    
    // When calculating tax
    const result = calculateTax(amount);
    
    // Then the tax should be 8% of the amount
    expect(result).toBe(8);
  });
  
  it('should handle edge case of zero amount', () => {
    expect(calculateTax(0)).toBe(0);
  });
});
```

### Integration Tests
```typescript
// ✅ Test complete user workflows
import { test, expect } from '@playwright/test';

test('user can create and view a project', async ({ page }) => {
  // Given a logged-in user
  await page.goto('/login');
  await page.fill('[data-testid=email]', 'user@example.com');
  await page.fill('[data-testid=password]', 'password');
  await page.click('[data-testid=login-button]');
  
  // When creating a new project
  await page.goto('/projects/new');
  await page.fill('[data-testid=project-name]', 'Test Project');
  await page.fill('[data-testid=project-description]', 'Test Description');
  await page.click('[data-testid=create-project]');
  
  // Then the project should be visible in the list
  await expect(page.locator('text=Test Project')).toBeVisible();
});
```

## Tools & Setup

### Required VS Code Extensions
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "vitest.explorer"
  ]
}
```

### Environment Setup
```bash
# Create React Router v7 project
npx create-react-router@latest my-app

# Or install dependencies manually
npm i react-router @react-router/node @react-router/serve react react-dom
npm i -D @react-router/dev vite typescript

# Setup database
npm run db:push
npm run db:seed

# Run development server
npm run dev       # React Router v7 app

# Build for production
npm run build

# Generate route types
npm run typegen

# Local validation in this repo
npm run typecheck
npm run lint
npm run test:local
npm run test:remote:test   # if linked to Railway test env
npm run test:remote:prod   # if linked to Railway prod env
```

## Performance Guidelines

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Optimization Strategies
```typescript
// ✅ Use React.lazy for code splitting
const Dashboard = lazy(() => import('./Dashboard'));

// ✅ Optimize database queries
export async function loader() {
  // Only select needed fields to reduce payload size
  const projects = await db.project.findMany({
    select: { id: true, name: true, status: true },
    take: 20, // Implement pagination
    orderBy: { updatedAt: 'desc' }
  });
  
  return json(projects);
}

// ✅ Use proper caching headers
export function headers() {
  return {
    "Cache-Control": "public, max-age=300" // 5 minutes
  };
}
```

## Cross-References

- [General Coding Standards](./coding.md) - Language-agnostic principles and Git workflow
- [Process Guidelines](./process.md) - Task management and development workflow
- [Documentation Standards](./documentation.md) - Documentation maintenance and guidelines
- [Design System](./product/design.md) - Visual design standards and component library
