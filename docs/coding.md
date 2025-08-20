# Coding Standards & Guidelines

## Table of Contents
- [General Principles](#general-principles)
- [TypeScript Guidelines](#typescript-guidelines)
- [Remix Conventions](#remix-conventions)
- [React Component Guidelines](#react-component-guidelines)
- [Database Guidelines](#database-guidelines)
- [Security Guidelines](#security-guidelines)
- [Accessibility Standards](#accessibility-standards)
- [CSS/Styling Conventions](#cssstyling-conventions)
- [File Naming & Structure](#file-naming--structure)
- [Environment & Configuration](#environment--configuration)
- [Progressive Web App Guidelines](#progressive-web-app-guidelines)
- [Testing Standards](#testing-standards)
- [Git Workflow](#git-workflow)
- [Code Review Process](#code-review-process)

## General Principles

### Code Philosophy
- **Prefer explicit over implicit** - Code should be self-documenting
- **Fail fast and loud** - Use TypeScript and Zod validation to catch errors early
- **Progressive enhancement** - Build with web standards first, enhance with JavaScript
- **Performance by default** - Optimize for Core Web Vitals

### Comment Guidelines
Comments should explain **WHY**, not **WHAT**. The code itself should be clear about what it does.

```typescript
// ❌ Bad - explaining what
// Increment the counter by 1
const count = count + 1;

// ✅ Good - explaining why
// We increment after successful validation to prevent double-counting failed attempts
const count = count + 1;

// ✅ Good - explaining business context
// Customer retention drops significantly after 3 failed login attempts
const MAX_LOGIN_ATTEMPTS = 3;
```

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

## Remix Conventions

### Route Organization
```typescript
// ✅ Use nested routing for related functionality
app/routes/
  dashboard/
    _layout.tsx           // Layout for all dashboard routes
    _index.tsx           // /dashboard
    projects/
      _index.tsx         // /dashboard/projects
      $projectId.tsx     // /dashboard/projects/:projectId
      new.tsx            // /dashboard/projects/new
```

### Data Loading Patterns
```typescript
// ✅ Loader functions should be pure and handle errors gracefully
export async function loader({ params, request }: LoaderFunctionArgs) {
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
    
    return json({ project, search });
  } catch (error) {
    // Log error for debugging while providing user-friendly message
    console.error('Failed to load project:', error);
    throw new Response('Unable to load project', { status: 500 });
  }
}
```

### Action Patterns
```typescript
// ✅ Actions should validate input and provide clear feedback
export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');
  
  // Use intent pattern for multiple actions in one route
  switch (intent) {
    case 'create': {
      const result = await createProject(formData);
      if (!result.success) {
        // Return validation errors for the form to display
        return json({ errors: result.errors }, { status: 400 });
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



## Security Guidelines

### Authentication Patterns
```typescript
// ✅ Use Remix built-in session management with signed cookies
import { createCookieSessionStorage } from "@remix-run/node";

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

### Auth Error Handling
```typescript
// ✅ Simple, clear error messages for users
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Invalid email or password",
  OAUTH_ERROR: "Sign-in failed. Please try again.",
  SESSION_EXPIRED: "Your session has expired. Please sign in again.",
  ACCESS_DENIED: "Access denied. You don't have permission to view this page.",
  USER_NOT_FOUND: "Account not found",
} as const;

// ✅ Error handling in OAuth callback
export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  
  if (error) {
    return redirect("/login?message=" + encodeURIComponent(AUTH_ERRORS.OAUTH_ERROR));
  }
  
  // Process OAuth callback...
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

### Environment Variables
```bash
# ✅ Server-side only (never expose these)
SESSION_SECRET=your-secret-key-min-32-chars
GOOGLE_CLIENT_SECRET=your-google-secret
MICROSOFT_CLIENT_SECRET=your-microsoft-secret

# ✅ Client-side safe (PUBLIC_ prefix)
PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
PUBLIC_MICROSOFT_CLIENT_ID=your-microsoft-client-id
PUBLIC_BASE_URL=http://localhost:3000
```

### User Roles & Authorization
```typescript
// ✅ Simple role-based access
export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  provider: "google" | "microsoft";
  createdAt: Date;
}

// ✅ First user becomes admin
export async function createUser(userData: Omit<User, "id" | "role" | "createdAt">) {
  const userCount = await db.user.count();
  const role: UserRole = userCount === 0 ? "admin" : "user";
  
  return db.user.create({
    data: {
      ...userData,
      role,
      createdAt: new Date(),
    }
  });
}
```

## Accessibility Standards

### Semantic HTML & ARIA
```typescript
// ✅ Use semantic HTML elements first
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article aria-labelledby={`project-${project.id}-title`}>
      <header>
        <h3 id={`project-${project.id}-title`}>{project.name}</h3>
        <p>{project.description}</p>
      </header>
      <footer>
        <time dateTime={project.createdAt.toISOString()}>
          {formatDate(project.createdAt)}
        </time>
      </footer>
    </article>
  );
}

// ✅ ARIA labels for interactive elements
export function DeleteButton({ onDelete, itemName }: Props) {
  return (
    <button
      onClick={onDelete}
      aria-label={`Delete ${itemName}`}
      className="text-red-600 hover:text-red-800"
    >
      <TrashIcon aria-hidden="true" />
    </button>
  );
}
```

### Form Accessibility
```typescript
// ✅ Accessible form patterns
export function ProjectForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  return (
    <form>
      <div>
        <label htmlFor="project-name">
          Project Name <span aria-label="required">*</span>
        </label>
        <input
          id="project-name"
          name="name"
          required
          aria-describedby={errors.name ? "name-error" : undefined}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <div id="name-error" role="alert" className="text-red-600">
            {errors.name}
          </div>
        )}
      </div>
      
      <button type="submit">Create Project</button>
    </form>
  );
}
```

### Keyboard Navigation
```typescript
// ✅ Focus management for modals and navigation
export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      // Focus first focusable element
      const firstFocusable = modalRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusable?.focus();
      
      // Trap focus within modal
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

// ✅ Skip navigation link
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
      >
        Skip to main content
      </a>
      <nav aria-label="Main navigation">
        {/* Navigation items */}
      </nav>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </>
  );
}
```

### Color & Contrast (WCAG AA)
```css
/* ✅ WCAG AA compliant color palette */
:root {
  /* Text on white background - 4.5:1 ratio minimum */
  --text-primary: #1f2937;     /* 16.75:1 ratio */
  --text-secondary: #6b7280;   /* 7.59:1 ratio */
  
  /* Interactive elements */
  --primary-600: #2563eb;      /* 7.04:1 ratio on white */
  --primary-700: #1d4ed8;      /* 9.64:1 ratio on white */
  
  /* Status colors */
  --success-600: #16a34a;      /* 4.98:1 ratio */
  --error-600: #dc2626;        /* 5.93:1 ratio */
  --warning-600: #ca8a04;      /* 4.51:1 ratio */
}

/* ✅ Focus indicators */
.focus-visible {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2;
}

/* ✅ Don't rely solely on color */
.status-badge {
  /* Use icons + color for status */
}
.status-badge--success::before {
  content: "✓ ";
}
.status-badge--error::before {
  content: "✗ ";
}
```

### Screen Reader Support
```typescript
// ✅ Descriptive link text
export function ProjectLink({ project }: { project: Project }) {
  return (
    <Link to={`/projects/${project.id}`}>
      View details for {project.name}
      <span aria-hidden="true"> →</span>
    </Link>
  );
}

// ✅ Live regions for dynamic content
export function Notifications() {
  const [message, setMessage] = useState("");
  
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

// ✅ Image alt text
export function ProjectImage({ project }: { project: Project }) {
  return (
    <img
      src={project.imageUrl}
      alt={`Screenshot of ${project.name} project dashboard`}
      loading="lazy"
    />
  );
}
```

### Progressive Enhancement
```typescript
// ✅ Works without JavaScript
export function LikeButton({ projectId, initialLiked }: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const fetcher = useFetcher();
  
  return (
    <fetcher.Form method="post" action="/api/like">
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="liked" value={liked ? "false" : "true"} />
      <button
        type="submit"
        onClick={(e) => {
          // Optimistic update for JS users
          e.preventDefault();
          setLiked(!liked);
          fetcher.submit(e.currentTarget.form);
        }}
        aria-label={liked ? "Unlike project" : "Like project"}
      >
        {liked ? "❤️" : "🤍"} {liked ? "Liked" : "Like"}
      </button>
    </fetcher.Form>
  );
}
```

### Testing Accessibility
```typescript
// ✅ Accessibility testing with jest-dom
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

test("ProjectCard has no accessibility violations", async () => {
  const { container } = render(<ProjectCard project={mockProject} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test("form is accessible via keyboard", async () => {
  render(<ProjectForm />);
  
  // Test keyboard navigation
  await user.tab();
  expect(screen.getByLabelText(/project name/i)).toHaveFocus();
  
  await user.tab();
  expect(screen.getByRole("button", { name: /create/i })).toHaveFocus();
});
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

### Animation & Transitions
```css
/* ✅ Consistent animation patterns */
@layer utilities {
  .animate-in {
    animation: animate-in 0.2s ease-out;
  }
  
  .animate-out {
    animation: animate-out 0.15s ease-in;
  }
  
  .fade-in {
    animation: fade-in 0.2s ease-out;
  }
}

@keyframes animate-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
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

# ✅ Remix route conventions (kebab-case with dots)
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
└── routes/              # Remix routes
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
import { Link } from '@remix-run/react';
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

### shadcn/ui Integration
```bash
# ✅ Separate UI components from business components
components/
├── ui/                  # shadcn/ui components (unchanged)
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── index.ts
├── project/             # Business/domain components
│   ├── ProjectCard.tsx  # Uses ui components
│   ├── ProjectForm.tsx
│   └── index.ts
└── layout/              # Layout-specific components
    ├── Header.tsx
    ├── Navigation.tsx
    └── index.ts
```

### Route File Organization
```typescript
// ✅ Route file structure
// routes/dashboard.projects.$id.tsx
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { ProjectForm } from '@/components/project';
import { ProjectService } from '@/lib/ProjectService';

// Types for this route
interface LoaderData {
  project: Project;
}

// Loader function
export async function loader({ params }: LoaderFunctionArgs) {
  // Loader implementation
}

// Action function
export async function action({ request, params }: ActionFunctionArgs) {
  // Action implementation
}

// Route component
export default function ProjectDetailPage() {
  const { project } = useLoaderData<typeof loader>();
  
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

### Environment Variable Naming
```bash
# ✅ Server-side only (never expose these)
DATABASE_URL="postgresql://user:pass@host:port/db"
SESSION_SECRET="your-secret-key-min-32-chars"
GOOGLE_CLIENT_SECRET="your-google-secret"
MICROSOFT_CLIENT_SECRET="your-microsoft-secret"

# ✅ Client-side safe (PUBLIC_ prefix)
PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
PUBLIC_MICROSOFT_CLIENT_ID="your-microsoft-client-id"
PUBLIC_BASE_URL="https://your-app.railway.app"

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
  PUBLIC_GOOGLE_CLIENT_ID: z.string(),
  PUBLIC_MICROSOFT_CLIENT_ID: z.string(),
  PUBLIC_BASE_URL: z.string().url(),
  
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

### Local Development Setup
```bash
# ✅ .env.local (never commit)
DATABASE_URL="postgresql://localhost:5432/grid_dev"
SESSION_SECRET="local-dev-secret-at-least-32-characters-long"
GOOGLE_CLIENT_SECRET="your-dev-google-secret"
MICROSOFT_CLIENT_SECRET="your-dev-microsoft-secret"
PUBLIC_GOOGLE_CLIENT_ID="your-dev-google-client-id"
PUBLIC_MICROSOFT_CLIENT_ID="your-dev-microsoft-client-id"
PUBLIC_BASE_URL="http://localhost:3000"
NODE_ENV="development"
```

```bash
# ✅ .env.example (commit this)
DATABASE_URL="postgresql://user:password@localhost:5432/grid_dev"
SESSION_SECRET="your-session-secret-min-32-chars"
GOOGLE_CLIENT_SECRET="your-google-oauth-secret"
MICROSOFT_CLIENT_SECRET="your-microsoft-oauth-secret"
PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
PUBLIC_MICROSOFT_CLIENT_ID="your-microsoft-client-id"
PUBLIC_BASE_URL="http://localhost:3000"
NODE_ENV="development"
```

### Docker Configuration
```dockerfile
# ✅ Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# Build the app
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the app
CMD ["pnpm", "start"]
```

```yaml
# ✅ docker-compose.yml (for local development)
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/grid_dev
      - NODE_ENV=development
    depends_on:
      - db
    volumes:
      - .:/app
      - /app/node_modules

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=grid_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Railway Deployment Setup
```bash
# ✅ Install Railway CLI
npm install -g @railway/cli

# ✅ Login and initialize
railway login
railway init

# ✅ Create services
railway add postgresql  # Creates managed Postgres database
railway add            # Creates web service for your app
```

```json
# ✅ railway.json
{
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "cronSchedule": null
  },
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  }
}
```

```bash
# ✅ Set production environment variables in Railway dashboard
DATABASE_URL="${{Postgres.DATABASE_URL}}"  # Auto-generated by Railway
SESSION_SECRET="generate-secure-32-char-secret"
GOOGLE_CLIENT_SECRET="prod-google-secret"
MICROSOFT_CLIENT_SECRET="prod-microsoft-secret"
PUBLIC_GOOGLE_CLIENT_ID="prod-google-client-id"
PUBLIC_MICROSOFT_CLIENT_ID="prod-microsoft-client-id"
PUBLIC_BASE_URL="https://your-app.railway.app"
NODE_ENV="production"
PORT="${{PORT}}"  # Auto-generated by Railway
```

### Database Migration Strategy
```typescript
// ✅ Deploy script for Railway
// scripts/deploy.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deploy() {
  try {
    console.log('Running database migrations...');
    await prisma.$executeRaw`SELECT 1`; // Test connection
    
    console.log('Database connected successfully');
    console.log('Deployment completed');
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

deploy();
```

```json
# ✅ Add to package.json
{
  "scripts": {
    "deploy": "prisma migrate deploy && prisma db seed",
    "build": "prisma generate && remix build",
    "start": "remix-serve build"
  }
}
```

### Automatic Deployment Workflow
```yaml
# ✅ .github/workflows/deploy.yml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install Railway CLI
        run: npm install -g @railway/cli
        
      - name: Deploy to Railway
        run: railway up --detach
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### Environment-Specific Configuration
```typescript
// ✅ config/database.ts
import { env } from "@/lib/env";

export const databaseConfig = {
  url: env.DATABASE_URL,
  // Enable connection pooling in production
  ...(env.NODE_ENV === "production" && {
    pool: {
      min: 0,
      max: 10,
      acquireTimeoutMillis: 30000,
      createTimeoutMillis: 30000,
      destroyTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
    },
  }),
};

// ✅ config/auth.ts
import { env } from "@/lib/env";

export const authConfig = {
  providers: {
    google: {
      clientId: env.PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      redirectUri: `${env.PUBLIC_BASE_URL}/auth/google/callback`,
    },
    microsoft: {
      clientId: env.PUBLIC_MICROSOFT_CLIENT_ID,
      clientSecret: env.MICROSOFT_CLIENT_SECRET,
      redirectUri: `${env.PUBLIC_BASE_URL}/auth/microsoft/callback`,
    },
  },
  session: {
    secret: env.SESSION_SECRET,
    secure: env.NODE_ENV === "production",
  },
};
```

### Early Implementation Checklist
```bash
# ✅ Set up immediately after project initialization
1. Create Railway account and project
2. Set up environment variables in Railway dashboard
3. Configure OAuth providers (Google & Microsoft) with Railway URLs
4. Set up automatic deployments from GitHub
5. Test deployment pipeline with a simple "Hello World" commit
6. Configure database migrations to run on deploy
7. Set up monitoring and error tracking (Railway provides basic metrics)
```

## Progressive Web App Guidelines

### App Manifest & Installability
```json
// ✅ public/manifest.json
{
  "name": "Grid - Project Management",
  "short_name": "Grid",
  "description": "Modern project management for teams",
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
  ],
  "screenshots": [
    {
      "src": "/screenshots/mobile-dashboard.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow"
    },
    {
      "src": "/screenshots/desktop-dashboard.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
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

### Service Worker for Offline Support
```typescript
// ✅ public/sw.js
const CACHE_NAME = 'grid-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request)
          .then(response => {
            if (response) return response;
            
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            
            throw new Error('No cached response available');
          });
      })
  );
});
```

```typescript
// ✅ Register service worker
// app/components/ServiceWorkerRegistration.tsx
import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('SW registered:', registration);
        })
        .catch(error => {
          console.log('SW registration failed:', error);
        });
    }
  }, []);

  return null;
}

// Add to root.tsx
export default function App() {
  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ServiceWorkerRegistration />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
```

### Offline Data Management
```typescript
// ✅ Offline-first data layer
// lib/OfflineStorage.ts
import { Project } from '@/types/Project';

class OfflineStorage {
  private dbName = 'GridOfflineDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create projects store
        if (!db.objectStoreNames.contains('projects')) {
          const projectStore = db.createObjectStore('projects', { keyPath: 'id' });
          projectStore.createIndex('status', 'status', { unique: false });
        }
        
        // Create pending actions store
        if (!db.objectStoreNames.contains('pendingActions')) {
          db.createObjectStore('pendingActions', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async saveProject(project: Project): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['projects'], 'readwrite');
    const store = transaction.objectStore('projects');
    await store.put(project);
  }

  async getProjects(): Promise<Project[]> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['projects'], 'readonly');
    const store = transaction.objectStore('projects');
    const request = store.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async queueAction(action: any): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['pendingActions'], 'readwrite');
    const store = transaction.objectStore('pendingActions');
    await store.add({ ...action, timestamp: Date.now() });
  }
}

export const offlineStorage = new OfflineStorage();
```

### Background Sync for Offline Actions
```typescript
// ✅ Background sync hook
// hooks/UseOfflineSync.ts
import { useEffect, useState } from 'react';
import { offlineStorage } from '@/lib/OfflineStorage';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState(0);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      await syncPendingActions();
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncPendingActions = async () => {
    // Implementation to sync queued actions
    const actions = await offlineStorage.getPendingActions();
    setPendingActions(actions.length);
    
    for (const action of actions) {
      try {
        await fetch(action.url, {
          method: action.method,
          body: JSON.stringify(action.data),
          headers: { 'Content-Type': 'application/json' },
        });
        await offlineStorage.removePendingAction(action.id);
      } catch (error) {
        console.log('Failed to sync action:', error);
        break; // Stop syncing on first failure
      }
    }
  };

  return { isOnline, pendingActions };
}
```

### Push Notifications
```typescript
// ✅ Push notification setup
// lib/PushNotifications.ts
export class PushNotificationManager {
  private vapidKey = process.env.PUBLIC_VAPID_KEY!;

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  async subscribe(): Promise<PushSubscription | null> {
    if (!('serviceWorker' in navigator)) return null;
    
    const registration = await navigator.serviceWorker.ready;
    
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidKey),
      });
      
      // Send subscription to server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: { 'Content-Type': 'application/json' },
      });
      
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe:', error);
      return null;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
  }
}

export const pushManager = new PushNotificationManager();
```

### Mobile-First Progressive Features
```typescript
// ✅ Web Share API
// components/ShareButton.tsx
import { Button } from '@/components/ui/Button';
import { Share } from 'lucide-react';

interface ShareButtonProps {
  project: Project;
}

export function ShareButton({ project }: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.name,
          text: project.description,
          url: `${window.location.origin}/projects/${project.id}`,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(
        `${window.location.origin}/projects/${project.id}`
      );
      // Show toast notification
    }
  };

  return (
    <Button variant="outline" onClick={handleShare}>
      <Share className="w-4 h-4 mr-2" />
      Share
    </Button>
  );
}

// ✅ Camera capture for project photos
// components/PhotoCapture.tsx
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Camera } from 'lucide-react';

export function PhotoCapture({ onPhotoCapture }: { onPhotoCapture: (file: File) => void }) {
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onPhotoCapture(file);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={handleCapture}>
        <Camera className="w-4 h-4 mr-2" />
        Add Photo
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}
```

### Progressive Enhancement Strategy
```typescript
// ✅ Feature detection and progressive enhancement
// hooks/UseProgressiveFeatures.ts
import { useState, useEffect } from 'react';

interface ProgressiveFeatures {
  canInstall: boolean;
  hasNotifications: boolean;
  hasShare: boolean;
  hasCamera: boolean;
  isOnline: boolean;
}

export function useProgressiveFeatures(): ProgressiveFeatures {
  const [features, setFeatures] = useState<ProgressiveFeatures>({
    canInstall: false,
    hasNotifications: false,
    hasShare: false,
    hasCamera: false,
    isOnline: navigator.onLine,
  });

  useEffect(() => {
    setFeatures({
      canInstall: 'beforeinstallprompt' in window,
      hasNotifications: 'Notification' in window,
      hasShare: 'share' in navigator,
      hasCamera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
      isOnline: navigator.onLine,
    });

    const handleOnline = () => setFeatures(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setFeatures(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return features;
}

// ✅ Install prompt component
// components/InstallPrompt.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Download } from 'lucide-react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    
    setDeferredPrompt(null);
  };

  if (!showInstallBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg md:max-w-sm md:left-auto">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <h3 className="font-semibold">Install Grid</h3>
          <p className="text-sm opacity-90">Get the full app experience</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setShowInstallBanner(false)}>
            Later
          </Button>
          <Button size="sm" variant="secondary" onClick={handleInstall}>
            <Download className="w-4 h-4 mr-1" />
            Install
          </Button>
        </div>
      </div>
    </div>
  );
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

## Git Workflow

> **📋 Project Management**: See [process.md](./process.md) for task creation, workflow processes, and project management guidelines.

### Branch Naming
```bash
# ✅ Use ticket ID with descriptive names
feature/GRID-123-user-authentication
bugfix/GRID-456-dashboard-loading-error
hotfix/GRID-789-payment-processing-timeout
chore/GRID-101-update-dependencies
docs/GRID-202-api-documentation

# Format: {type}/{TICKET-ID}-{short-description}
# - type: feature, bugfix, hotfix, chore, docs
# - TICKET-ID: Jira/GitHub issue number
# - short-description: kebab-case description
```

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/) with scope:

```bash
# ✅ Scoped commit messages
feat(auth): add user project creation workflow
fix(dashboard): resolve data loading race condition
docs(api): update integration guidelines
test(auth): add user authentication test coverage
refactor(forms): extract reusable validation logic

# ✅ Include context for why changes were made
feat(projects): add status filtering (GRID-123)

Users frequently need to filter projects by status to focus on
urgent items. This adds a dropdown filter that persists in URL
parameters for bookmarkable filtered views.

Closes GRID-123
```

### Task-First Development Rule
```bash
# ❗ MANDATORY: No work without a task
# - All development must start with a documented task in docs/tasks/GRID-XXX.md
# - Never start coding based on verbal requests or informal discussions
# - Create task file in docs/tasks/GRID-XXX.md BEFORE starting any work
# - Task must include: description, acceptance criteria, definition of done

# ✅ Create task first in docs/tasks/GRID-XXX.md
# Add new task following the template:
### GRID-XXX: Add user project dashboard
**Status**: 🆕 New  
**Priority**: High  
**Assignee**: TBD  
**Created**: 2025-01-20  

#### Description
Users need a dashboard to view their project metrics and recent activity.

#### Acceptance Criteria
- [ ] Display project count widget
- [ ] Show recent activity feed (last 10 items)
- [ ] Add quick actions menu (New Project, Settings)
- [ ] Responsive design for mobile/desktop
- [ ] Loading states for all data

#### Definition of Done
- [ ] Component tests written
- [ ] Accessibility verified
- [ ] Works on mobile and desktop
- [ ] Data loading handled gracefully

# Task gets assigned GRID-XXX, NOW you can start development
```

### Development Workflow with GitHub CLI
```bash
# ✅ Install GitHub CLI (better for LLM agents)
npm install -g gh
gh auth login

# 0. VERIFY TASK EXISTS - Check task in docs/tasks/GRID-XXX.md
# Review GRID-XXX task requirements before starting

# 1. Create feature branch from main (using task ID)
gh repo sync  # Sync with upstream
git checkout main
git pull origin main
git checkout -b feature/GRID-123-user-dashboard

# 2. Commit frequently while developing (save progress)
git add .
git commit -m "feat(dashboard): add basic dashboard layout (GRID-123)"
git push origin feature/GRID-123-user-dashboard

# Continue working and committing frequently
git add .
git commit -m "feat(dashboard): add project count widget (GRID-123)"
git push

git add .
git commit -m "feat(dashboard): add recent activity feed (GRID-123)"
git push

git add .
git commit -m "feat(dashboard): add quick actions menu (GRID-123)"
git push

# 3. When feature is ready for review, create PR
gh pr create --title "feat(dashboard): Add user project metrics" --body "Implements GRID-123\n\n- Add project count widget\n- Add recent activity feed\n- Add quick actions menu\n\nCloses GRID-123"

# 4. After review, merge via CLI (squash combines all commits)
gh pr merge --squash --delete-branch

# 5. Clean up local branch
git checkout main
git pull origin main
```

### Pull Request Guidelines
```bash
# ✅ Create PR with proper format
gh pr create \
  --title "feat(auth): Add Google OAuth integration" \
  --body "$(cat <<'EOF'
Implements GRID-456: Google OAuth authentication

## Changes
- Add Google OAuth provider configuration
- Implement OAuth callback handling
- Add user creation from OAuth profile
- Update login UI with Google button

## Testing
- [ ] OAuth flow works in development
- [ ] User profile correctly populated
- [ ] Session management works
- [ ] Error handling for OAuth failures

Closes GRID-456
EOF
)"

# ✅ PR checklist in description
- **Title**: Use conventional commit format with scope
- **Description**: Include ticket reference, changes, testing checklist
- **Size**: Keep PRs focused and reviewable (< 500 lines when possible)
- **Tests**: Include tests for new functionality
- **Documentation**: Update relevant docs
```

### GitHub CLI Commands for LLM Agents
```bash
# ✅ Useful gh commands for automation
gh pr list                              # List open PRs
gh pr view 123                          # View PR details
gh pr checkout 123                      # Checkout PR locally
gh pr review 123 --approve              # Approve PR
gh pr review 123 --comment "LGTM"       # Add review comment
gh pr merge 123 --squash --delete-branch # Squash merge and cleanup

# ✅ Repository management
gh repo view                            # View repo details
gh issue list                           # List issues
gh issue create --title "Bug: ..."       # Create issue
gh workflow list                        # List GitHub Actions
gh workflow run "Deploy"                # Trigger workflow

# ✅ Branch management
gh repo sync                            # Sync fork with upstream
gh pr create --draft                    # Create draft PR
gh pr ready                             # Mark draft as ready
```

## Code Review Process

### Reviewer Checklist
- [ ] Code follows established patterns and conventions
- [ ] Changes include appropriate tests
- [ ] No obvious security vulnerabilities
- [ ] Performance implications considered
- [ ] Error handling is appropriate
- [ ] Documentation updated if needed

### Review Workflow
```bash
# ✅ Step 1: Reviewer comments on PR
gh pr list                              # See open PRs
gh pr checkout 123                      # Checkout PR to test locally
npm test                                # Run tests
npm run typecheck                       # Check types

# ✅ Add review comments (don't approve yet)
gh pr review 123 --comment --body "Consider extracting this logic into a reusable hook for better testing"
gh pr review 123 --request-changes --body "Please address the TypeScript errors in UserService.ts"

# ✅ Step 2: Developer makes adjustments
# Developer addresses feedback, pushes new commits
git add .
git commit -m "fix(auth): address review feedback (GRID-123)"
git push

# ✅ Step 3: Final reviewer approves and merges
gh pr review 123 --approve --body "LGTM! All feedback addressed."
gh pr merge 123 --squash --delete-branch
```

### Review Comments (Keep Informal)
```typescript
// ✅ Simple, helpful feedback
// Could extract this to a hook?
// What if API returns null here?
// Nice solution! ✅
// Consider using React.memo here for performance
```

### Commit Frequency Guidelines
```bash
# ✅ Commit frequently during development
# - Save progress regularly (multiple times per day)
# - Each commit should be a logical unit of work
# - Push commits to backup work and show progress
# - Don't worry about commit message perfection - squash merge will clean up

# ✅ Examples of frequent commits
git commit -m "feat(auth): add login form structure"
git commit -m "feat(auth): add form validation"
git commit -m "feat(auth): connect to OAuth provider"
git commit -m "feat(auth): add error handling"
git commit -m "feat(auth): add loading states"

# ✅ Push frequently to backup work
git push  # Push after each commit or group of commits
```

### Development Process Steps
1. **Task creation required** - Create GitHub issue/Jira ticket with clear requirements
2. **Developer reviews task** - Understand acceptance criteria before starting
3. **Developer works on feature** with frequent commits to feature branch
4. **Developer creates PR** when feature is ready for review via `gh pr create`
5. **Reviewer adds feedback** via `gh pr review --comment` or `--request-changes`
6. **Developer addresses feedback** with additional commits and pushes updates
7. **Final reviewer approves** via `gh pr review --approve`
8. **Final reviewer merges** via `gh pr merge --squash --delete-branch` (combines all commits)
9. **Task closed** - Link PR to task and close ticket

### Technical Definition of Done
Code is ready when:
- [ ] All tests pass (unit, integration, e2e)
- [ ] No TypeScript errors or linting issues
- [ ] Code follows established patterns and conventions
- [ ] PR is reviewed, approved, and merged
- [ ] Branch is deleted after merge
- [ ] Task status updated in individual task file and docs/tasks/status.md

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
# Install dependencies
pnpm install

# Setup database
pnpm db:push
pnpm db:seed

# Run development server
pnpm dev          # Remix app

# Run tests
pnpm test         # Unit tests
pnpm test:e2e     # End-to-end tests
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