# GRID-016: Product Design System Specification

**Status**: ✅ Complete  
**Priority**: High  
**Created**: 2025-08-22  
**Updated**: 2025-08-22  
**Type**: Application Spec

**Issue Link**: *To be created*

## Overview

Define and complete the GridPulse product design system, including visual identity, UI components, interaction patterns, and responsive design guidelines to ensure consistent user experience across all features.

## Problem Statement

GridPulse needs a comprehensive design system that:
- Provides consistent visual language across all features (F0-F4)
- Ensures accessibility and usability for technical and non-technical users
- Supports data visualization best practices for grid analytics
- Enables rapid UI development with reusable components
- Maintains brand consistency and professional appearance
- Works effectively for embedded content and sharing

## Scope

### In Scope
- Visual identity and brand guidelines
- Color palette and typography system
- UI component library specifications
- Data visualization design patterns
- Responsive design breakpoints and layouts
- Accessibility guidelines and WCAG compliance
- Interaction patterns and micro-animations
- Design tokens and CSS custom properties

### Out of Scope
- Actual component implementation (covered in future specs)
- Marketing website design (product app only)
- Print design guidelines
- Advanced animation specifications
- Third-party integration UI (beyond embeds)

## Current State Analysis

Based on the existing `docs/product/design.md` file, we need to:

### Existing Content Review
- **Visual Identity**: Basic color scheme and typography defined
- **Component Library**: Some components outlined but incomplete
- **Data Visualization**: Basic chart specifications
- **Responsive Design**: Mobile-first approach mentioned

### Gaps to Address
- [ ] Complete color palette with semantic color tokens
- [ ] Comprehensive typography scale and usage guidelines
- [ ] Full component library specifications
- [ ] Data visualization color schemes and accessibility
- [ ] Interaction patterns and state management
- [ ] Embed-specific design considerations
- [ ] Dark mode support (if applicable)

## Design Requirements

### Visual Identity

#### Brand Positioning
- **Professional but approachable**: Technical accuracy with human readability
- **Data-driven**: Charts and metrics are primary content
- **Trustworthy**: Clear data sources and freshness indicators
- **Accessible**: Works for diverse user types and abilities

#### Color System
```css
/* ✅ Extend shadcn's CSS variables for GridPulse theme */
:root {
  /* shadcn base variables */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;    /* GridPulse energy blue */
  --primary-foreground: 210 40% 98%;
  
  /* GridPulse-specific data visualization variables */
  --fuel-solar: 45 93% 47%;         /* Solar yellow */
  --fuel-wind: 142 76% 36%;         /* Wind green */
  --fuel-gas: 25 95% 53%;           /* Gas orange */
  --fuel-coal: 0 84% 60%;           /* Coal red */
  --fuel-nuclear: 262 83% 58%;      /* Nuclear purple */
  --fuel-hydro: 199 89% 48%;        /* Hydro blue */
  
  /* Grid status colors */
  --status-clean: 142 76% 36%;      /* Clean energy */
  --status-dirty: 0 84% 60%;        /* High emissions */
  --status-estimated: 47 95% 53%;   /* Estimated data */
  --status-missing: 215 16% 47%;    /* Missing data */
  
  /* Custom spacing for dashboard layouts */
  --dashboard-gap: 1.5rem;
  --container-max-width: 1280px;
  --chart-height-sm: 200px;
  --chart-height-md: 300px;
  --chart-height-lg: 400px;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  
  /* Adjust fuel colors for dark mode */
  --fuel-solar: 45 93% 57%;
  --fuel-wind: 142 70% 45%;
  --fuel-gas: 25 95% 63%;
  --fuel-coal: 0 84% 70%;
  --fuel-nuclear: 262 83% 68%;
  --fuel-hydro: 199 89% 58%;
}
```

#### Typography Scale
```css
/* Font Family */
--font-family-primary: /* Main UI font */
--font-family-mono: /* Code, data values */
--font-family-display: /* Headlines, large text */

/* Type Scale */
--text-xs: /* 12px - Small labels */
--text-sm: /* 14px - Body text */
--text-base: /* 16px - Default */
--text-lg: /* 18px - Subheadings */
--text-xl: /* 20px - Headings */
--text-2xl: /* 24px - Page titles */
--text-3xl: /* 30px - Hero text */
```

### Component Library

#### shadcn/ui Foundation
**Base Component Library**: Use shadcn/ui as the foundation (already established in tech stack)

```typescript
// Core shadcn/ui components for GridPulse
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
```

#### GridPulse-Specific Components (Built on shadcn/ui)
1. **Navigation & Layout**
   - `BASelector` (extends Select with typeahead search and geo-location defaults)
   - `DateRangePicker` (extends Calendar/Popover with presets: Today/Yesterday/Last 7d)
   - `FreshnessIndicator` (extends Badge with last-updated timestamps)
   - `EmbedLayout` (minimal chrome for iframes, responsive)
   - `DeepLinkControls` (URL parameter management for shareability)

2. **Data Display**
   - `KPICard` (extends Card with trend indicators and sparklines)
   - `TimeSeriesChart` (Card wrapper + Recharts with annotations)
   - `AnnotatedChart` (peak/trough/ramp markers for Daily Pulse)
   - `DataTable` (extends Table with sorting/filtering and CSV export)
   - `LoadingCard` (Card with skeleton states and shimmer effects)

3. **Domain-Specific Components**
   - `DailyPulseCard` (auto-generated narrative with annotated chart)
   - `DuckCurveVisualization` (net-load patterns with duckiness scoring)
   - `FuelMixChart` (stacked area chart with consistent fuel colors)
   - `CleanEnergyWindow` (24-hour band visualization with CO₂ quartiles)
   - `CO2IntensityPill` (current status with freshness badge)
   - `BaselineComparison` (yesterday vs typical with delta indicators)

4. **Interaction & Sharing**
   - `ShareControls` (Copy permalink and embed snippet generation)
   - `ExportButtons` (PNG download and CSV export)
   - `ChartTooltip` (hover states with exact values and units)
   - `ChartLegend` (toggleable visibility with fuel type colors)

5. **Feedback & Status**
   - `DataQualityAlert` (extends Alert with freshness warnings)
   - `APIErrorBoundary` (graceful error states with retry options)
   - `EmptyDataState` (informative empty states with next steps)
   - `OfflineIndicator` (PWA offline status with last-updated info)
   - `UpdateToast` ("Updated at HH:MM" notifications)

#### Data Visualization Patterns

**Chart Types:**
- **Line Charts**: Time-series data (demand, generation)
- **Area Charts**: Stacked generation by fuel type
- **Bar Charts**: Comparative data, rankings
- **Sparklines**: Trend indicators in cards
- **Heatmaps**: Time-based patterns (duck curves)

**Chart Design Principles:**
- Consistent color mapping for fuel types
- Clear axis labels and units
- Responsive sizing for mobile/desktop
- Accessible color combinations
- Hover states with detailed tooltips
- Legend positioning and toggles

### Responsive Design

#### Breakpoints (Following Tailwind/shadcn/ui Standards)
```css
/* ✅ Use standard Tailwind breakpoints for consistency */
--breakpoint-sm: 640px;   /* Mobile landscape */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
--breakpoint-2xl: 1536px; /* Extra large */
```

#### Layout Patterns
- **Mobile (< 640px)**: Single column, stacked cards, touch-optimized charts
- **Tablet (640px - 1024px)**: 2-column grid, collapsible controls
- **Desktop (1024px+)**: Multi-column dashboard, persistent navigation
- **Embed**: Minimal chrome, responsive within iframe constraints

#### Component Responsiveness
```typescript
// ✅ Use responsive variants with cva (class-variance-authority)
import { cva, type VariantProps } from "class-variance-authority";

const dashboardCardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      size: {
        sm: "p-4 min-h-[200px]",      // Mobile
        md: "p-6 min-h-[250px]",      // Tablet
        lg: "p-8 min-h-[300px]",      // Desktop
      },
      columns: {
        1: "col-span-1",
        2: "col-span-1 md:col-span-2",
        3: "col-span-1 md:col-span-2 lg:col-span-3",
      },
    },
    defaultVariants: {
      size: "md",
      columns: 1,
    },
  }
);
```

### Accessibility Requirements

#### WCAG 2.1 AA Compliance
- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
- **Keyboard Navigation**: All interactive elements accessible
- **Screen Readers**: Semantic HTML and ARIA labels
- **Focus Management**: Visible focus indicators
- **Alternative Text**: Descriptive alt text for charts/images

#### Data Visualization Accessibility
- **Color Independence**: Patterns/textures in addition to color
- **High Contrast Mode**: Alternative color schemes
- **Data Tables**: Alternative representation for charts
- **Voice Descriptions**: Chart summary text for screen readers

### Interaction Requirements (From PRD)
- **BA Selection**: Typeahead search with geo-location default suggestion
- **Date Controls**: Presets (Today/Yesterday/Last 7d) + custom date picker
- **Chart Interactions**: Hover tooltips, click annotations, zoom/pan support
- **Sharing**: One-click copy link, embed code generation
- **Deep Linking**: All views shareable via URL parameters (95% reproduction accuracy)
- **Touch Optimization**: Charts and controls work on touch devices
- **Keyboard Navigation**: Full keyboard accessibility for all interactive elements

### Navigation Requirements (From PRD)
- **Header Controls**: BA dropdown, date picker, freshness indicators
- **Card Navigation**: Expand to full view, deep-link to focused pages
- **Breadcrumbs**: Clear path back to dashboard from detail views
- **Mobile Menu**: Collapsible navigation for smaller screens

### Export & Embed Requirements (From Features)
- **PNG Export**: Chart download capability for all visualizations
- **CSV Export**: Data table export functionality
- **oEmbed Support**: Auto-embedding in external sites
- **iFrame Embeds**: Responsive embeds with minimal chrome
- **Script Embeds**: JavaScript-based embedding for flexibility
- **Permalink Generation**: Shareable URLs that reproduce exact state

## Implementation Tasks

### Phase 1: Design System Foundation
- [ ] Complete color palette with semantic tokens (extending shadcn/ui variables)
- [ ] Finalize typography scale using shadcn/ui defaults (Inter font family)
- [ ] Define spacing scale following Tailwind standards
- [ ] Create design token specifications with CSS variables
- [ ] Document accessibility guidelines (WCAG 2.1 AA)
- [ ] Set up class-variance-authority (cva) for component variants

### Phase 2: Component Specifications
- [ ] Design core navigation components
- [ ] Specify data visualization components
- [ ] Define form control patterns
- [ ] Create feedback and status components
- [ ] Document interaction patterns

### Phase 3: Layout and Responsive Design
- [ ] Design responsive breakpoints and layouts
- [ ] Create page templates for each feature
- [ ] Design embed-specific layouts
- [ ] Specify mobile-first responsive patterns
- [ ] Document grid systems and spacing

### Phase 4: Documentation and Guidelines
- [ ] Create comprehensive design documentation
- [ ] Provide usage examples for each component with TypeScript interfaces
- [ ] Document do's and don'ts with code examples
- [ ] Create accessibility checklist (WCAG 2.1 AA compliance)
- [ ] Establish design review process
- [ ] Document form patterns using react-hook-form + Zod validation
- [ ] Create performance guidelines (Core Web Vitals targets)

### Phase 5: Progressive Web App (PWA) Considerations
- [ ] Define offline functionality for cached data (network-first with fallback)
- [ ] Design app manifest and icons (GridPulse branding)
- [ ] Plan service worker strategy using Workbox (stale-while-revalidate for assets)
- [ ] Create install prompts and PWA-specific UI patterns
- [ ] Design "Updated at HH:MM" toast notifications for data freshness

### Phase 6: Embed & Sharing Features
- [ ] Design embed-specific layouts (minimal chrome for iframes)
- [ ] Create oEmbed support patterns for auto-embedding
- [ ] Design permalink generation and deep linking patterns
- [ ] Create "Copy link/Embed" UI components
- [ ] Design PNG export functionality for charts
- [ ] Plan script-based embed options for external sites

## Success Criteria

### Completeness Requirements
- [ ] All major UI components specified with detailed requirements
- [ ] Color palette covers all use cases (data viz, UI, states)
- [ ] Typography system supports all content types
- [ ] Responsive design works across all target devices
- [ ] Accessibility guidelines meet WCAG 2.1 AA standards

### Quality Requirements
- [ ] Design system supports all features F0-F4
- [ ] Visual consistency across all components
- [ ] Professional appearance suitable for business users
- [ ] Data visualization follows best practices
- [ ] Embed designs work effectively in third-party sites

### Documentation Requirements
- [ ] Complete design.md file with all specifications
- [ ] Visual examples and mockups for key components
- [ ] Code-ready specifications (CSS custom properties)
- [ ] Usage guidelines and best practices
- [ ] Accessibility implementation checklist

## Deliverables

### Primary Deliverable
- **Updated `docs/product/design.md`**: Complete design system specification

### Supporting Deliverables
- **Design Tokens**: CSS custom properties file with GridPulse-specific variables
- **Component Specifications**: Detailed specs for all GridPulse components
- **PWA Manifest**: App manifest with GridPulse branding and icons
- **Embed Templates**: Design templates for iFrame and script embeds
- **Accessibility Guidelines**: WCAG 2.1 AA implementation checklist
- **Animation Guidelines**: Micro-interaction patterns using Framer Motion
- **Export Patterns**: PNG and CSV export UI patterns
- **Responsive Examples**: Mobile/tablet/desktop layout examples with touch optimization

## Dependencies

### Infrastructure Dependencies
- **GRID-015**: REST API Design (for data structure understanding)
- **Product Features**: F0-F4 specifications for UI requirements

### External Dependencies
- **shadcn/ui**: Already established as base component library
- **Font selection**: Inter (shadcn/ui default, excellent for data-heavy interfaces)
- **Icon library**: Lucide React (shadcn/ui default, comprehensive icon set)
- **Chart library**: Recharts (React-friendly, works well with shadcn/ui Cards)
- **Animation library**: Framer Motion (for micro-interactions and transitions)
- **Styling utilities**: 
  - Tailwind CSS (already configured with shadcn/ui)
  - class-variance-authority (cva) for component variants
  - clsx/cn utility for conditional classes
- **Form handling**: 
  - react-hook-form (performance and UX)
  - Zod (TypeScript-first validation)
  - @hookform/resolvers/zod (integration)
- **PWA utilities**:
  - Workbox (service worker and caching strategies)
  - Web App Manifest (installability and native-like experience)

### Development Dependencies
- **Testing**: Vitest for unit tests, Playwright for E2E with visual regression
- **Linting**: ESLint with Tailwind CSS plugin
- **Formatting**: Prettier with Tailwind CSS plugin
- **VS Code**: Extensions for Tailwind IntelliSense, Prisma, Prettier
- **Observability**: Sentry integration for error tracking (from stack-fit.md)

## Future Considerations

### Design System Evolution
- **Component Library Implementation**: Future spec for React components
- **Design Tokens Integration**: CSS-in-JS or design token tooling
- **Figma Integration**: Design file creation and maintenance
- **Storybook Setup**: Component documentation and testing

### Advanced Features
- **Dark Mode**: Already supported via shadcn/ui CSS variable system
- **PWA Features**: Offline data caching, app install prompts, native-like interactions
- **Performance Optimization**: Core Web Vitals optimization, lazy loading patterns
- **Animation System**: Framer Motion integration for micro-interactions
- **Internationalization**: Multi-language support with proper RTL considerations

### Performance Targets (From PRD)
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Page Load**: First paint <2.5s on 3G Fast connections
- **API Response**: TTFB <300ms from cache
- **Progressive Enhancement**: Works without JavaScript for basic content

## Collaboration Approach

### Design Process
1. **Research**: Review existing design.md and identify gaps
2. **Brainstorming**: Collaborative sessions to define visual direction
3. **Specification**: Detailed documentation of all design decisions
4. **Review**: Stakeholder feedback and iteration
5. **Finalization**: Complete design system documentation

### Stakeholder Input
- **Product Team**: Feature requirements and user needs
- **Development Team**: Implementation feasibility and constraints
- **Content Team**: Copy guidelines and tone of voice
- **Accessibility Expert**: WCAG compliance review

## Notes

This spec focuses on defining the design system rather than implementing it. The goal is to create comprehensive documentation that enables consistent, accessible, and professional UI development across all GridPulse features.

The design system should reflect GridPulse's position as a professional tool for grid data analysis while remaining approachable for journalists, analysts, and the general public.
