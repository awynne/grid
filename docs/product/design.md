# GridPulse Design System & UI Guidelines

> **🎨 Purpose**: Design standards, visual guidelines, and UI/UX patterns for the GridPulse electric grid data visualization platform.

## Table of Contents
- [Design Principles](#design-principles)
- [Visual Identity](#visual-identity)
- [Typography](#typography)
- [Color System](#color-system)
- [Spacing & Layout](#spacing--layout)
- [Component Library](#component-library)
- [Data Visualization](#data-visualization)
- [Icons & Imagery](#icons--imagery)
- [Responsive Design](#responsive-design)
- [Accessibility Design](#accessibility-design)
- [User Experience Patterns](#user-experience-patterns)
- [Progressive Web App Design](#progressive-web-app-design)
- [Embed & Sharing Design](#embed--sharing-design)
- [Design Tokens](#design-tokens)

## Design Principles

### Core Design Values
- **Data-Driven**: Charts and metrics are primary content, with clear hierarchy
- **Trustworthy**: Clear data sources, freshness indicators, and transparent limitations
- **Accessible**: Works for diverse user types, abilities, and devices
- **Actionable**: Every visualization leads to clear insights or next steps
- **Professional**: Clean, modern aesthetic suitable for reporters, analysts, and executives

### User-Centered Design
- **Energy Reporter (Sarah)**: Needs fast, accurate daily updates with embeddable visuals
- **Conscious Consumer (Mike)**: Wants clear guidance on when to use electricity for lower emissions
- **Grid Educator (Dr. Kim)**: Requires reproducible analysis and educational visualizations
- **Primary Goal**: "Give me a headline and chart I can embed today, fast"

### Consistency & Coherence
- **Unified Visual Language**: Consistent fuel type colors, chart patterns, and interaction models
- **Predictable Navigation**: Standard BA/date controls across all features
- **Coherent Information Architecture**: Hybrid dashboard with stackable cards + deep-link pages

### Accessibility First
- **WCAG 2.1 AA Compliance**: 4.5:1 color contrast, keyboard navigation, screen reader support
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Color Independence**: Patterns and textures supplement color coding
- **Touch Optimization**: Mobile-friendly interactions for charts and controls

## Visual Identity

### Brand Guidelines
**GridPulse Brand Identity:**
- **Mission**: Make electric grid data accessible, actionable, and trustworthy
- **Personality**: Professional, data-focused, reliable, educational
- **Visual Style**: Clean, modern, with emphasis on data visualization excellence

### Logo & Brand Assets
- **Primary Logo**: GridPulse wordmark with energy-themed accent
- **Icon**: Simplified grid/pulse symbol for favicons and app icons
- **Color Theme**: Energy blue primary with fuel-specific accent colors

### Voice & Tone
- **Voice**: Authoritative but approachable, technical but accessible
- **Tone**: Confident in data, humble about limitations, helpful in guidance
- **Copy Style**: Headlines avoid jargon, fit ≤120 chars, never contradict chart values

## Typography

### Font Families
```css
/* Primary Font: Inter (shadcn/ui default) */
--font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-family-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
```

**Rationale**: Inter is excellent for data-heavy interfaces with superior number legibility and multiple weights.

### Font Weights & Styles
- **Regular (400)**: Body text, data labels
- **Medium (500)**: Subheadings, emphasized text
- **Semibold (600)**: Card titles, section headers
- **Bold (700)**: Page titles, primary CTAs

### Typography Scale
```css
/* Following Tailwind/shadcn/ui scale */
--text-xs: 0.75rem;    /* 12px - Data labels, timestamps */
--text-sm: 0.875rem;   /* 14px - Secondary text */
--text-base: 1rem;     /* 16px - Body text */
--text-lg: 1.125rem;   /* 18px - Card titles */
--text-xl: 1.25rem;    /* 20px - Section headers */
--text-2xl: 1.5rem;    /* 24px - Page titles */
--text-3xl: 1.875rem;  /* 30px - Hero headlines */
```

### Text Hierarchy
1. **Hero Headlines** (F1 Daily Pulse): text-3xl, font-bold
2. **Page Titles**: text-2xl, font-semibold
3. **Card Titles**: text-lg, font-semibold
4. **Section Headers**: text-xl, font-medium
5. **Body Text**: text-base, font-normal
6. **Data Labels**: text-sm, font-medium
7. **Timestamps/Meta**: text-xs, font-normal

## Color System

### Primary Colors (shadcn/ui Extended)
```css
:root {
  /* shadcn base variables */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;    /* GridPulse energy blue */
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222.2 84% 4.9%;
}
```

### Fuel Type Colors (Data Visualization)
```css
:root {
  /* GridPulse-specific fuel colors */
  --fuel-solar: 45 93% 47%;         /* Solar yellow */
  --fuel-wind: 142 76% 36%;         /* Wind green */
  --fuel-gas: 25 95% 53%;           /* Gas orange */
  --fuel-coal: 0 84% 60%;           /* Coal red */
  --fuel-nuclear: 262 83% 58%;      /* Nuclear purple */
  --fuel-hydro: 199 89% 48%;        /* Hydro blue */
  --fuel-other: 215 16% 47%;        /* Other/unknown gray */
}
```

### Semantic Colors (Grid Status)
```css
:root {
  /* Grid status colors */
  --status-clean: 142 76% 36%;      /* Clean energy periods */
  --status-dirty: 0 84% 60%;        /* High emissions periods */
  --status-estimated: 47 95% 53%;   /* Estimated/forecasted data */
  --status-missing: 215 16% 47%;    /* Missing/unavailable data */
  --status-fresh: 142 76% 36%;      /* Fresh data (<1hr old) */
  --status-stale: 47 95% 53%;       /* Stale data (1-6hr old) */
  --status-very-stale: 0 84% 60%;   /* Very stale data (>6hr old) */
}
```

### Dark Mode Colors
```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  
  /* Adjust fuel colors for dark mode visibility */
  --fuel-solar: 45 93% 57%;
  --fuel-wind: 142 70% 45%;
  --fuel-gas: 25 95% 63%;
  --fuel-coal: 0 84% 70%;
  --fuel-nuclear: 262 83% 68%;
  --fuel-hydro: 199 89% 58%;
}
```

### Color Usage Guidelines
- **Fuel Colors**: Consistent across all charts and legends
- **Status Colors**: Used for freshness indicators, data quality alerts
- **Primary Blue**: CTAs, links, active states
- **Gray Scale**: Text hierarchy, borders, backgrounds

## Spacing & Layout

### Spacing Scale (Tailwind Standard)
```css
/* Following Tailwind spacing scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Grid System
```css
/* Dashboard-specific spacing */
--dashboard-gap: 1.5rem;          /* Gap between cards */
--container-max-width: 1280px;    /* Max content width */
--sidebar-width: 280px;           /* Navigation sidebar */
--header-height: 64px;            /* Fixed header height */
```

### Container Patterns
- **Dashboard Grid**: CSS Grid with responsive columns (1/2/3-4 based on screen size)
- **Card Containers**: Consistent padding, border-radius, shadow
- **Content Containers**: Max-width with centered alignment

### Layout Principles
- **Mobile-First**: Start with single-column, expand to multi-column
- **Card-Based**: Modular content in shadcn/ui Cards
- **Flexible Grid**: Responsive columns based on content and screen size

## Component Library

### shadcn/ui Base Components
```typescript
// Core shadcn/ui components for GridPulse
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
```

### GridPulse Custom Components

#### Navigation & Layout
1. **`BASelector`** - Extends Select with typeahead search and geo-location defaults
2. **`DateRangePicker`** - Extends Calendar/Popover with presets (Today/Yesterday/Last 7d)
3. **`FreshnessIndicator`** - Extends Badge with last-updated timestamps
4. **`EmbedLayout`** - Minimal chrome for iframes, responsive
5. **`DeepLinkControls`** - URL parameter management for shareability

#### Data Display
1. **`KPICard`** - Extends Card with trend indicators and sparklines
2. **`TimeSeriesChart`** - Card wrapper + Recharts with annotations
3. **`AnnotatedChart`** - Peak/trough/ramp markers for Daily Pulse
4. **`DataTable`** - Extends Table with sorting/filtering and CSV export
5. **`LoadingCard`** - Card with skeleton states and shimmer effects

#### Domain-Specific Components
1. **`DailyPulseCard`** - Auto-generated narrative with annotated chart
2. **`DuckCurveVisualization`** - Net-load patterns with duckiness scoring
3. **`FuelMixChart`** - Stacked area chart with consistent fuel colors
4. **`CleanEnergyWindow`** - 24-hour band visualization with CO₂ quartiles
5. **`CO2IntensityPill`** - Current status with freshness badge
6. **`BaselineComparison`** - Yesterday vs typical with delta indicators

#### Interaction & Sharing
1. **`ShareControls`** - Copy permalink and embed snippet generation
2. **`ExportButtons`** - PNG download and CSV export
3. **`ChartTooltip`** - Hover states with exact values and units
4. **`ChartLegend`** - Toggleable visibility with fuel type colors

#### Feedback & Status
1. **`DataQualityAlert`** - Extends Alert with freshness warnings
2. **`APIErrorBoundary`** - Graceful error states with retry options
3. **`EmptyDataState`** - Informative empty states with next steps
4. **`OfflineIndicator`** - PWA offline status with last-updated info
5. **`UpdateToast`** - "Updated at HH:MM" notifications

### Component Variants (using cva)
```typescript
import { cva, type VariantProps } from "class-variance-authority";

const dashboardCardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm transition-all",
  {
    variants: {
      size: {
        sm: "p-4 min-h-[200px]",      // Mobile
        md: "p-6 min-h-[250px]",      // Tablet
        lg: "p-8 min-h-[300px]",      // Desktop
      },
      priority: {
        low: "border-gray-200 dark:border-gray-800",
        medium: "border-yellow-200 dark:border-yellow-800",
        high: "border-red-200 dark:border-red-800 shadow-md",
      },
      columns: {
        1: "col-span-1",
        2: "col-span-1 md:col-span-2",
        3: "col-span-1 md:col-span-2 lg:col-span-3",
      },
    },
    defaultVariants: {
      size: "md",
      priority: "low",
      columns: 1,
    },
  }
);
```

### Component States
- **Loading**: Skeleton states with shimmer animations
- **Error**: Clear error messages with retry options
- **Empty**: Informative empty states with next steps
- **Offline**: Cached data indicators with freshness warnings

## Data Visualization

### Chart Types & Usage
- **Line Charts**: Time-series demand and generation data
- **Area Charts**: Stacked fuel mix visualization
- **Bar Charts**: Comparative analysis and baselines
- **Band Charts**: 24-hour clean energy windows
- **Sparklines**: Trend indicators in KPI cards

### Chart Design Patterns
- **Consistent Fuel Colors**: Same colors across all charts
- **Responsive Sizing**: 200px/300px/400px heights based on screen size
- **Annotation Support**: Peak/trough/ramp markers with tooltips
- **Legend Controls**: Toggleable visibility for data series
- **Export Capability**: PNG download for all visualizations

### Data Freshness Indicators
- **Fresh Data** (<1hr): Green badge, no warning
- **Stale Data** (1-6hr): Yellow badge, "Updated X hours ago"
- **Very Stale** (>6hr): Red badge, "Data may be outdated"
- **Missing Data**: Gray badge, "Data unavailable"

## Icons & Imagery

### Icon System (Lucide React)
- **Navigation**: Menu, Home, Settings, Help
- **Data**: TrendingUp, TrendingDown, BarChart, Activity
- **Actions**: Download, Share, Copy, ExternalLink
- **Status**: CheckCircle, AlertTriangle, XCircle, Clock
- **Energy**: Zap, Sun, Wind, Droplet (for fuel types)

### Icon Usage Guidelines
- **Size**: 16px (sm), 20px (md), 24px (lg)
- **Color**: Inherit from parent or semantic colors
- **Accessibility**: Always paired with text labels

### Image Guidelines
- **Charts**: SVG for scalability, PNG export option
- **Logos**: SVG format with proper fallbacks
- **Icons**: Lucide React icon set for consistency

## Responsive Design

### Breakpoint System (Tailwind Standard)
```css
/* Responsive breakpoints */
--breakpoint-sm: 640px;   /* Mobile landscape */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
--breakpoint-2xl: 1536px; /* Extra large */
```

### Layout Patterns by Screen Size
- **Mobile (< 640px)**: Single column, stacked cards, touch-optimized charts
- **Tablet (640px - 1024px)**: 2-column grid, collapsible controls
- **Desktop (1024px+)**: Multi-column dashboard, persistent navigation
- **Embed**: Responsive within iframe constraints

### Mobile-First Approach
1. **Start Mobile**: Design for smallest screen first
2. **Progressive Enhancement**: Add features for larger screens
3. **Touch Targets**: Minimum 44px touch targets
4. **Readable Text**: Minimum 16px font size

### Touch Targets
- **Minimum Size**: 44px × 44px for touch elements
- **Spacing**: 8px minimum between touch targets
- **Chart Interactions**: Touch-friendly hover states and zoom controls

## Accessibility Design

### WCAG 2.1 AA Compliance
- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Readers**: Semantic HTML and proper ARIA labels
- **Focus Management**: Visible focus indicators, logical tab order

### Data Visualization Accessibility
- **Color Independence**: Patterns/textures in addition to color coding
- **Alternative Text**: Descriptive alt text for charts and images
- **Data Tables**: Alternative tabular representation for charts
- **Voice Descriptions**: Chart summary text for screen readers
- **High Contrast**: Alternative color schemes for low vision users

### Focus Management
- **Visible Indicators**: Clear focus rings using shadcn/ui defaults
- **Logical Order**: Tab order follows visual hierarchy
- **Skip Links**: "Skip to content" for keyboard users
- **Focus Trapping**: Modal dialogs trap focus appropriately

## User Experience Patterns

### Navigation Patterns
- **Header Controls**: BA dropdown, date picker, freshness indicators
- **Card Navigation**: Expand to full view, deep-link to focused pages
- **Breadcrumbs**: Clear path back to dashboard from detail views
- **Mobile Menu**: Collapsible hamburger menu for smaller screens

### Data Display Patterns
- **Hybrid Architecture**: Stackable dashboard cards + deep-link pages
- **Progressive Disclosure**: Summary cards expand to detailed views
- **Consistent Layouts**: Same patterns across F1-F4 features
- **Loading States**: Skeleton loading with shimmer effects

### Form Patterns (react-hook-form + Zod)
```typescript
// Standard form pattern
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  ba_code: z.string().min(1, "Balancing Authority is required"),
  date_range: z.object({
    start: z.date(),
    end: z.date(),
  }),
});

export function DataForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ba_code: "",
      date_range: { start: new Date(), end: new Date() },
    },
  });

  return (
    <Form {...form}>
      {/* Form fields with consistent styling */}
    </Form>
  );
}
```

### Feedback & Messaging
- **Success**: Green alerts with checkmark icons
- **Warning**: Yellow alerts for stale data
- **Error**: Red alerts with retry options
- **Info**: Blue alerts for helpful context

### Loading States
- **Card Skeletons**: Gray placeholder blocks with shimmer animation
- **Progressive Loading**: Show data as it becomes available
- **Loading Indicators**: Spinner for quick operations, progress bars for longer tasks

### Error Handling
- **Graceful Degradation**: Show cached data when API fails
- **Clear Messages**: Explain what went wrong and how to fix it
- **Retry Options**: Easy way to retry failed operations
- **Fallback States**: Alternative content when primary fails

## Progressive Web App Design

### Installation Experience
- **App Manifest**: GridPulse branding with proper icons
- **Install Prompts**: Native browser install prompts
- **App Icons**: 192px and 512px icons for various platforms
- **Splash Screen**: GridPulse branded loading screen

### Offline State Design
- **Offline Indicator**: Clear visual indication when offline
- **Cached Data**: Show last-known data with freshness warnings
- **Sync Notifications**: "Updated at HH:MM" when back online
- **Graceful Degradation**: Core features work without network

### App Shell Pattern
- **Static Shell**: Navigation and layout cached for instant loading
- **Dynamic Content**: API data loaded progressively
- **Service Worker**: Workbox for caching strategies
- **Background Sync**: Update data when connection restored

### Native-Like Interactions
- **Smooth Animations**: Framer Motion for micro-interactions
- **Touch Gestures**: Swipe, pinch-to-zoom on charts
- **Native Controls**: Platform-appropriate form elements
- **App-Like Navigation**: No browser chrome in standalone mode

## Embed & Sharing Design

### Embed Layouts
- **Minimal Chrome**: Remove navigation, reduce padding
- **Responsive**: Adapt to iframe constraints
- **Self-Contained**: All styles and scripts included
- **Performance**: Optimized loading for external sites

### oEmbed Support
- **Auto-Discovery**: Meta tags for oEmbed endpoints
- **Rich Previews**: Title, description, thumbnail
- **Responsive Embeds**: Scale to container width
- **Fallback Options**: Static image if interactive fails

### Permalink Generation
- **URL Parameters**: All state encoded in URL
- **95% Reproduction**: Target accuracy for shared links
- **Short URLs**: Readable and shareable format
- **Deep Linking**: Direct links to specific views

### Export Functionality
- **PNG Export**: High-resolution chart images
- **CSV Export**: Raw data in spreadsheet format
- **Copy Controls**: One-click permalink and embed code
- **Share Buttons**: Social media and email sharing

## Design Tokens

### Token Structure
```css
/* Semantic token structure */
:root {
  /* Base tokens */
  --color-primary-50: /* Lightest shade */
  --color-primary-500: /* Base color */
  --color-primary-900: /* Darkest shade */
  
  /* Semantic tokens */
  --color-brand: var(--color-primary-500);
  --color-success: var(--fuel-wind);
  --color-warning: var(--fuel-solar);
  --color-error: var(--fuel-coal);
  
  /* Component tokens */
  --button-primary-bg: var(--color-brand);
  --card-border: var(--color-gray-200);
}
```

### CSS Variables (shadcn/ui Extended)
- **Base Variables**: Background, foreground, primary, secondary
- **Fuel Colors**: Solar, wind, gas, coal, nuclear, hydro
- **Status Colors**: Clean, dirty, estimated, missing
- **Layout Variables**: Spacing, sizing, breakpoints

### Theme Configuration
- **Light Theme**: Default GridPulse theme
- **Dark Theme**: High-contrast alternative
- **High Contrast**: Accessibility-focused theme
- **Custom Themes**: Extensible for white-label usage

### Token Naming Conventions
- **Semantic Names**: `--color-brand` not `--color-blue-500`
- **Scale Suffixes**: 50-900 for color scales
- **Component Prefixes**: `--button-`, `--card-`, `--chart-`
- **State Suffixes**: `-hover`, `-active`, `-disabled`

## Design Tools & Workflow

### Design Tools
- **Figma**: Primary design tool (when needed)
- **Code-First**: Design in TypeScript/CSS for accuracy
- **Storybook**: Component documentation and testing
- **Chromatic**: Visual regression testing

### Design Handoff Process
1. **Specification**: GRID-016 defines requirements
2. **Implementation**: Build components in code
3. **Review**: Visual and functional testing
4. **Documentation**: Update design system docs

### Design System Maintenance
- **Version Control**: Git for all design assets
- **Component Library**: Maintained in codebase
- **Documentation**: Keep design.md updated
- **Testing**: Visual regression and accessibility testing

### Collaboration Guidelines
- **Design Reviews**: Include accessibility and performance
- **Code Reviews**: Ensure design system compliance
- **Documentation**: Update docs with every change
- **Testing**: Validate across devices and browsers

## Performance Targets

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Page Load Performance
- **First Paint**: < 2.5s on 3G Fast connections
- **API Response**: TTFB < 300ms from cache
- **Progressive Enhancement**: Works without JavaScript for basic content

### Design Performance Considerations
- **Optimized Images**: WebP format with fallbacks
- **Lazy Loading**: Charts and images load on demand
- **Efficient Animations**: Use CSS transforms and opacity
- **Minimal JavaScript**: Progressive enhancement approach

## Cross-References
- [Product Requirements Document](./prd.md) - User needs and success metrics
- [Feature Specifications](./features.md) - F0-F4 detailed requirements
- [Technical Stack Analysis](./stack-fit.md) - Architecture decisions
- [GRID-008 Architecture](../specs/GRID-008.md) - MVP implementation plan
- [GRID-016 Design Specification](../specs/GRID-016.md) - This design system's specification
- [Remix Coding Standards](./coding-remix-stack.md) - Implementation guidelines
- [Accessibility Standards](./coding.md#accessibility-standards) - WCAG compliance details