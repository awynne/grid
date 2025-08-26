import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, Link } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import * as React from "react";
import { useState } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, ChevronUp, Check, Clock, ArrowLeft, TrendingUp, Zap, Leaf, Sun, TrendingDown, GitCompare } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function links() {
  return [{
    rel: "preconnect",
    href: "https://fonts.googleapis.com"
  }, {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  }, {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
  }];
}
function Layout$1({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack && /* @__PURE__ */ jsx("pre", {
      className: "w-full p-4 overflow-x-auto",
      children: /* @__PURE__ */ jsx("code", {
        children: stack
      })
    })]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout: Layout$1,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
const BALANCING_AUTHORITIES = [
  { code: "CAISO", name: "California ISO" },
  { code: "ERCOT", name: "Electric Reliability Council of Texas" },
  { code: "PJM", name: "PJM Interconnection" },
  { code: "MISO", name: "Midcontinent ISO" },
  { code: "SPP", name: "Southwest Power Pool" }
];
const FEATURE_CARDS = [
  {
    id: "daily",
    title: "Daily Pulse",
    description: "Auto-generated daily narrative with annotated chart",
    href: "/daily",
    status: "placeholder"
  },
  {
    id: "wpm",
    title: "What's Powering Me",
    description: "Current CO₂ intensity and next clean window",
    href: "/wpm",
    status: "placeholder"
  },
  {
    id: "ducks",
    title: "Duck Days",
    description: "Discoverable gallery of duck curve patterns",
    href: "/ducks",
    status: "placeholder"
  },
  {
    id: "diff",
    title: "What Changed",
    description: "Daily diff cards vs baseline metrics",
    href: "/diff",
    status: "placeholder"
  }
];
function BASelector({ value, onValueChange, className }) {
  return /* @__PURE__ */ jsxs(Select, { value, onValueChange, children: [
    /* @__PURE__ */ jsx(SelectTrigger, { className: `w-[250px] [&>span:first-child]:text-left [&>span:first-child]:truncate ${className || ""}`, children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select Balancing Authority" }) }),
    /* @__PURE__ */ jsx(SelectContent, { className: "w-[280px]", children: BALANCING_AUTHORITIES.map((ba) => /* @__PURE__ */ jsx(SelectItem, { value: ba.code, title: ba.name, children: /* @__PURE__ */ jsx("span", { className: "truncate", children: ba.name }) }, ba.code)) })
  ] });
}
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
function FreshnessIndicator({ lastUpdated, status }) {
  const statusConfig = {
    fresh: {
      color: "bg-status-fresh text-white",
      text: "Fresh",
      icon: Clock
    },
    stale: {
      color: "bg-status-stale text-white",
      text: "Stale",
      icon: Clock
    },
    "very-stale": {
      color: "bg-status-very-stale text-white",
      text: "Very Stale",
      icon: Clock
    },
    missing: {
      color: "bg-status-missing text-white",
      text: "Missing",
      icon: Clock
    }
  };
  const config = statusConfig[status];
  const Icon = config.icon;
  const formatLastUpdated = (date) => {
    const now = /* @__PURE__ */ new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1e3 * 60 * 60));
    const diffMinutes = Math.floor(diffMs % (1e3 * 60 * 60) / (1e3 * 60));
    if (diffHours === 0) {
      return `${diffMinutes}m ago`;
    }
    return `${diffHours}h ${diffMinutes}m ago`;
  };
  return /* @__PURE__ */ jsxs(Badge, { className: cn("flex items-center gap-1 text-xs", config.color), children: [
    /* @__PURE__ */ jsx(Icon, { className: "h-3 w-3" }),
    /* @__PURE__ */ jsx("span", { children: config.text }),
    lastUpdated && /* @__PURE__ */ jsxs("span", { className: "ml-1 opacity-90", children: [
      "(",
      formatLastUpdated(lastUpdated),
      ")"
    ] })
  ] });
}
function Header() {
  const [selectedBA, setSelectedBA] = useState("");
  return /* @__PURE__ */ jsx("header", { className: "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8 max-w-container", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex h-16 items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-primary", children: "GridPulse" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground hidden sm:block", children: "Electric Grid Data Visualization" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
        /* @__PURE__ */ jsx(
          BASelector,
          {
            value: selectedBA,
            onValueChange: setSelectedBA,
            className: "hidden sm:block"
          }
        ),
        /* @__PURE__ */ jsx(
          FreshnessIndicator,
          {
            status: "stale",
            lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1e3)
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "sm:hidden pb-4", children: /* @__PURE__ */ jsx(
      BASelector,
      {
        value: selectedBA,
        onValueChange: setSelectedBA,
        className: "w-full"
      }
    ) })
  ] }) });
}
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "container mx-auto px-4 sm:px-6 lg:px-8 max-w-container py-8", children })
  ] });
}
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
const dashboardCardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md",
  {
    variants: {
      size: {
        sm: "p-4 min-h-[200px]",
        md: "p-6 min-h-[250px]",
        lg: "p-8 min-h-[300px]"
      },
      priority: {
        low: "border-border",
        medium: "border-yellow-200 dark:border-yellow-800",
        high: "border-red-200 dark:border-red-800 shadow-md"
      },
      columns: {
        1: "col-span-1",
        2: "col-span-1 md:col-span-2",
        3: "col-span-1 md:col-span-2 lg:col-span-3"
      }
    },
    defaultVariants: {
      size: "md",
      priority: "low",
      columns: 1
    }
  }
);
function DashboardCard({
  className,
  title,
  description,
  href,
  status,
  size,
  priority,
  columns,
  ...props
}) {
  const statusBadgeColor = {
    placeholder: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    "coming-soon": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
  }[status];
  const statusText = {
    placeholder: "Placeholder",
    "coming-soon": "Coming Soon",
    active: "Active"
  }[status];
  return /* @__PURE__ */ jsx(Link, { to: href, className: "block", children: /* @__PURE__ */ jsxs(
    Card,
    {
      className: cn(dashboardCardVariants({ size, priority, columns }), className),
      ...props,
      children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "text-lg font-semibold", children: title }),
            /* @__PURE__ */ jsx(Badge, { className: statusBadgeColor, children: statusText })
          ] }),
          /* @__PURE__ */ jsx(CardDescription, { className: "text-sm text-muted-foreground", children: description })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: status === "placeholder" && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" }),
          /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" }),
          /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" })
        ] }) })
      ]
    }
  ) });
}
function meta$4({}) {
  return [{
    title: "GridPulse - Electric Grid Data Visualization"
  }, {
    name: "description",
    content: "Real-time electric grid data analysis and visualization platform"
  }];
}
const home = UNSAFE_withComponentProps(function Home() {
  return /* @__PURE__ */ jsx(Layout, {
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-8",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "text-center space-y-4",
        children: [/* @__PURE__ */ jsx("h1", {
          className: "text-4xl font-bold tracking-tight text-foreground",
          children: "Electric Grid Dashboard"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-xl text-muted-foreground max-w-2xl mx-auto",
          children: "Real-time insights from EIA-930 hourly electric grid data. Select a balancing authority and explore grid patterns."
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "grid gap-dashboard-gap grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        children: FEATURE_CARDS.map((card) => /* @__PURE__ */ jsx(DashboardCard, {
          title: card.title,
          description: card.description,
          href: card.href,
          status: card.status
        }, card.id))
      }), /* @__PURE__ */ jsxs("div", {
        className: "mt-12 p-6 bg-muted/50 rounded-lg",
        children: [/* @__PURE__ */ jsx("h2", {
          className: "text-2xl font-semibold mb-4",
          children: "Getting Started"
        }), /* @__PURE__ */ jsxs("div", {
          className: "grid md:grid-cols-2 gap-6 text-sm",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h3", {
              className: "font-medium text-foreground mb-2",
              children: "1. Select a Balancing Authority"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-muted-foreground",
              children: "Choose from major grid operators like CAISO (California), ERCOT (Texas), PJM (Eastern), MISO (Midwest), or SPP (Southwest)."
            })]
          }), /* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h3", {
              className: "font-medium text-foreground mb-2",
              children: "2. Explore Features"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-muted-foreground",
              children: "Each card represents a different way to analyze grid data. Click any card to explore that feature (currently showing placeholders)."
            })]
          })]
        })]
      })]
    })
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
async function loader() {
  const checks = {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    service: "web",
    status: "healthy",
    version: process.env.npm_package_version || "unknown",
    environment: process.env.NODE_ENV || "unknown"
  };
  if (process.env.DATABASE_URL) {
    checks.database = "configured";
  } else {
    checks.database = "not_configured";
  }
  if (process.env.REDIS_URL) {
    checks.redis = "configured";
  } else {
    checks.redis = "not_configured";
  }
  return new Response(JSON.stringify(checks), {
    status: checks.status === "healthy" ? 200 : 503,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache"
    }
  });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
function meta$3({}) {
  return [{
    title: "Daily Pulse - GridPulse"
  }, {
    name: "description",
    content: "Auto-generated daily narrative with annotated chart"
  }];
}
const daily = UNSAFE_withComponentProps(function DailyPulse() {
  return /* @__PURE__ */ jsx(Layout, {
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6",
      children: [/* @__PURE__ */ jsx("div", {
        className: "flex items-center space-x-4",
        children: /* @__PURE__ */ jsx(Button, {
          variant: "outline",
          size: "sm",
          asChild: true,
          children: /* @__PURE__ */ jsxs(Link, {
            to: "/",
            children: [/* @__PURE__ */ jsx(ArrowLeft, {
              className: "h-4 w-4 mr-2"
            }), "Back to Dashboard"]
          })
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "space-y-2",
        children: [/* @__PURE__ */ jsxs("h1", {
          className: "text-3xl font-bold flex items-center gap-3",
          children: [/* @__PURE__ */ jsx(TrendingUp, {
            className: "h-8 w-8 text-primary"
          }), "Daily Pulse"]
        }), /* @__PURE__ */ jsx("p", {
          className: "text-lg text-muted-foreground",
          children: "Auto-generated daily narrative with annotated chart"
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsxs(CardHeader, {
          children: [/* @__PURE__ */ jsx(CardTitle, {
            children: "Coming Soon"
          }), /* @__PURE__ */ jsx(CardDescription, {
            children: "This feature will provide automated daily summaries of grid activity"
          })]
        }), /* @__PURE__ */ jsxs(CardContent, {
          className: "space-y-4",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "p-6 bg-muted/30 rounded-lg",
            children: [/* @__PURE__ */ jsx("h3", {
              className: "font-semibold mb-3",
              children: "What Daily Pulse will include:"
            }), /* @__PURE__ */ jsxs("ul", {
              className: "space-y-2 text-sm text-muted-foreground",
              children: [/* @__PURE__ */ jsx("li", {
                children: "• Auto-generated narrative describing the day's grid activity"
              }), /* @__PURE__ */ jsx("li", {
                children: "• Annotated charts highlighting peaks, troughs, and ramp events"
              }), /* @__PURE__ */ jsx("li", {
                children: "• Key metrics and comparisons to historical averages"
              }), /* @__PURE__ */ jsx("li", {
                children: "• Renewable energy highlights and grid stability insights"
              }), /* @__PURE__ */ jsx("li", {
                children: "• Embed-ready content for reports and social sharing"
              })]
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center",
            children: /* @__PURE__ */ jsxs("div", {
              className: "text-center space-y-2",
              children: [/* @__PURE__ */ jsx(TrendingUp, {
                className: "h-12 w-12 text-muted-foreground mx-auto"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-muted-foreground",
                children: "Chart visualization placeholder"
              })]
            })
          })]
        })]
      })]
    })
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: daily,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
function meta$2({}) {
  return [{
    title: "What's Powering Me - GridPulse"
  }, {
    name: "description",
    content: "Current CO₂ intensity and next clean window"
  }];
}
const wpm = UNSAFE_withComponentProps(function WhatsPoweringMe() {
  return /* @__PURE__ */ jsx(Layout, {
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6",
      children: [/* @__PURE__ */ jsx("div", {
        className: "flex items-center space-x-4",
        children: /* @__PURE__ */ jsx(Button, {
          variant: "outline",
          size: "sm",
          asChild: true,
          children: /* @__PURE__ */ jsxs(Link, {
            to: "/",
            children: [/* @__PURE__ */ jsx(ArrowLeft, {
              className: "h-4 w-4 mr-2"
            }), "Back to Dashboard"]
          })
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "space-y-2",
        children: [/* @__PURE__ */ jsxs("h1", {
          className: "text-3xl font-bold flex items-center gap-3",
          children: [/* @__PURE__ */ jsx(Zap, {
            className: "h-8 w-8 text-primary"
          }), "What's Powering Me"]
        }), /* @__PURE__ */ jsx("p", {
          className: "text-lg text-muted-foreground",
          children: "Current CO₂ intensity and next clean window"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid gap-6 md:grid-cols-2",
        children: [/* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            children: [/* @__PURE__ */ jsxs(CardTitle, {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Zap, {
                className: "h-5 w-5"
              }), "Current Grid Status"]
            }), /* @__PURE__ */ jsx(CardDescription, {
              children: "Real-time CO₂ intensity and fuel mix"
            })]
          }), /* @__PURE__ */ jsxs(CardContent, {
            className: "space-y-4",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "text-center p-6 bg-muted/30 rounded-lg",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "text-3xl font-bold text-primary mb-2",
                children: ["425 ", /* @__PURE__ */ jsx("span", {
                  className: "text-lg font-normal text-muted-foreground",
                  children: "lbs/MWh"
                })]
              }), /* @__PURE__ */ jsx(Badge, {
                className: "bg-status-stale text-white",
                children: "Current CO₂ Intensity"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-2",
              children: [/* @__PURE__ */ jsx("h4", {
                className: "font-medium",
                children: "Current Fuel Mix:"
              }), /* @__PURE__ */ jsxs("div", {
                className: "grid grid-cols-2 gap-2 text-sm",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex justify-between",
                  children: [/* @__PURE__ */ jsx("span", {
                    children: "Natural Gas"
                  }), /* @__PURE__ */ jsx("span", {
                    className: "font-medium",
                    children: "42%"
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "flex justify-between",
                  children: [/* @__PURE__ */ jsx("span", {
                    children: "Solar"
                  }), /* @__PURE__ */ jsx("span", {
                    className: "font-medium",
                    children: "18%"
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "flex justify-between",
                  children: [/* @__PURE__ */ jsx("span", {
                    children: "Wind"
                  }), /* @__PURE__ */ jsx("span", {
                    className: "font-medium",
                    children: "15%"
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "flex justify-between",
                  children: [/* @__PURE__ */ jsx("span", {
                    children: "Nuclear"
                  }), /* @__PURE__ */ jsx("span", {
                    className: "font-medium",
                    children: "12%"
                  })]
                })]
              })]
            })]
          })]
        }), /* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            children: [/* @__PURE__ */ jsxs(CardTitle, {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Leaf, {
                className: "h-5 w-5 text-green-600"
              }), "Next Clean Window"]
            }), /* @__PURE__ */ jsx(CardDescription, {
              children: "Optimal time for high electricity usage"
            })]
          }), /* @__PURE__ */ jsxs(CardContent, {
            className: "space-y-4",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "text-center p-6 bg-green-50 dark:bg-green-950 rounded-lg",
              children: [/* @__PURE__ */ jsx("div", {
                className: "text-2xl font-bold text-green-700 dark:text-green-300 mb-2",
                children: "2:00 PM - 4:00 PM"
              }), /* @__PURE__ */ jsx(Badge, {
                className: "bg-status-clean text-white",
                children: "Clean Energy Window"
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "space-y-3",
              children: [/* @__PURE__ */ jsxs("p", {
                className: "text-sm text-muted-foreground",
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Best time for:"
                }), " Running dishwashers, charging electric vehicles, and other energy-intensive activities."]
              }), /* @__PURE__ */ jsxs("p", {
                className: "text-sm text-muted-foreground",
                children: [/* @__PURE__ */ jsx("strong", {
                  children: "Why:"
                }), " Peak solar generation with low demand creates the cleanest electricity of the day."]
              })]
            })]
          })]
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsxs(CardHeader, {
          children: [/* @__PURE__ */ jsx(CardTitle, {
            children: "Coming Soon"
          }), /* @__PURE__ */ jsx(CardDescription, {
            children: "Enhanced features for personalized grid insights"
          })]
        }), /* @__PURE__ */ jsx(CardContent, {
          children: /* @__PURE__ */ jsxs("div", {
            className: "p-4 bg-muted/30 rounded-lg",
            children: [/* @__PURE__ */ jsx("h3", {
              className: "font-semibold mb-3",
              children: "What's Powering Me will include:"
            }), /* @__PURE__ */ jsxs("ul", {
              className: "space-y-2 text-sm text-muted-foreground",
              children: [/* @__PURE__ */ jsx("li", {
                children: "• Real-time CO₂ intensity with historical context"
              }), /* @__PURE__ */ jsx("li", {
                children: "• 24-hour clean energy windows and recommendations"
              }), /* @__PURE__ */ jsx("li", {
                children: "• Personalized notifications for optimal usage times"
              }), /* @__PURE__ */ jsx("li", {
                children: "• Integration with smart home devices and EV charging"
              }), /* @__PURE__ */ jsx("li", {
                children: "• Carbon footprint tracking and reduction tips"
              })]
            })]
          })
        })]
      })]
    })
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: wpm,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
function meta$1({}) {
  return [{
    title: "Duck Days - GridPulse"
  }, {
    name: "description",
    content: "Discoverable gallery of duck curve patterns"
  }];
}
const ducks = UNSAFE_withComponentProps(function DuckDays() {
  return /* @__PURE__ */ jsx(Layout, {
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6",
      children: [/* @__PURE__ */ jsx("div", {
        className: "flex items-center space-x-4",
        children: /* @__PURE__ */ jsx(Button, {
          variant: "outline",
          size: "sm",
          asChild: true,
          children: /* @__PURE__ */ jsxs(Link, {
            to: "/",
            children: [/* @__PURE__ */ jsx(ArrowLeft, {
              className: "h-4 w-4 mr-2"
            }), "Back to Dashboard"]
          })
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "space-y-2",
        children: [/* @__PURE__ */ jsxs("h1", {
          className: "text-3xl font-bold flex items-center gap-3",
          children: [/* @__PURE__ */ jsx(Sun, {
            className: "h-8 w-8 text-primary"
          }), "Duck Days"]
        }), /* @__PURE__ */ jsx("p", {
          className: "text-lg text-muted-foreground",
          children: "Discoverable gallery of duck curve patterns"
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsxs(CardHeader, {
          children: [/* @__PURE__ */ jsxs(CardTitle, {
            className: "flex items-center gap-2",
            children: [/* @__PURE__ */ jsx(TrendingDown, {
              className: "h-5 w-5"
            }), "What is the Duck Curve?"]
          }), /* @__PURE__ */ jsx(CardDescription, {
            children: "Understanding the shape that defines modern grid operations"
          })]
        }), /* @__PURE__ */ jsxs(CardContent, {
          className: "space-y-4",
          children: [/* @__PURE__ */ jsx("p", {
            className: "text-sm text-muted-foreground",
            children: 'The "duck curve" describes the daily pattern of electricity demand minus solar generation. As solar adoption increases, this curve becomes more pronounced, creating challenges for grid operators.'
          }), /* @__PURE__ */ jsx("div", {
            className: "h-48 bg-gradient-to-r from-blue-50 to-yellow-50 dark:from-blue-950 dark:to-yellow-950 rounded-lg flex items-center justify-center",
            children: /* @__PURE__ */ jsxs("div", {
              className: "text-center space-y-2",
              children: [/* @__PURE__ */ jsx(TrendingDown, {
                className: "h-12 w-12 text-muted-foreground mx-auto"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-muted-foreground",
                children: "Duck curve visualization placeholder"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-xs text-muted-foreground",
                children: "Morning peak → Midday dip → Evening ramp"
              })]
            })
          })]
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
        children: ["Perfect Duck", "Extreme Duck", "Inverted Duck"].map((title, index) => /* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            children: [/* @__PURE__ */ jsx(CardTitle, {
              className: "text-lg",
              children: title
            }), /* @__PURE__ */ jsxs(CardDescription, {
              children: [index === 0 && "Classic duck curve pattern", index === 1 && "Deep midday solar generation", index === 2 && "Unusual reverse pattern"]
            })]
          }), /* @__PURE__ */ jsxs(CardContent, {
            children: [/* @__PURE__ */ jsx("div", {
              className: "h-32 bg-muted/30 rounded flex items-center justify-center",
              children: /* @__PURE__ */ jsx(Sun, {
                className: "h-8 w-8 text-muted-foreground"
              })
            }), /* @__PURE__ */ jsxs("div", {
              className: "mt-3 text-xs text-muted-foreground space-y-1",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex justify-between",
                children: [/* @__PURE__ */ jsx("span", {
                  children: "Date:"
                }), /* @__PURE__ */ jsxs("span", {
                  children: ["2024-", String(index + 3).padStart(2, "0"), "-15"]
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex justify-between",
                children: [/* @__PURE__ */ jsx("span", {
                  children: "Duckiness Score:"
                }), /* @__PURE__ */ jsxs("span", {
                  children: [[8.5, 9.2, 3.1][index], "/10"]
                })]
              })]
            })]
          })]
        }, title))
      }), /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsxs(CardHeader, {
          children: [/* @__PURE__ */ jsx(CardTitle, {
            children: "Coming Soon"
          }), /* @__PURE__ */ jsx(CardDescription, {
            children: "Interactive gallery of duck curve patterns"
          })]
        }), /* @__PURE__ */ jsx(CardContent, {
          children: /* @__PURE__ */ jsxs("div", {
            className: "p-4 bg-muted/30 rounded-lg",
            children: [/* @__PURE__ */ jsx("h3", {
              className: "font-semibold mb-3",
              children: "Duck Days will include:"
            }), /* @__PURE__ */ jsxs("ul", {
              className: "space-y-2 text-sm text-muted-foreground",
              children: [/* @__PURE__ */ jsx("li", {
                children: "• Searchable gallery of historical duck curves"
              }), /* @__PURE__ */ jsx("li", {
                children: '• "Duckiness" scoring algorithm and rankings'
              }), /* @__PURE__ */ jsx("li", {
                children: "• Seasonal patterns and renewable energy correlation"
              }), /* @__PURE__ */ jsx("li", {
                children: "• Interactive comparisons across different grid operators"
              }), /* @__PURE__ */ jsx("li", {
                children: "• Educational content about grid flexibility challenges"
              })]
            })]
          })
        })]
      })]
    })
  });
});
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ducks,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
function meta({}) {
  return [{
    title: "What Changed - GridPulse"
  }, {
    name: "description",
    content: "Daily diff cards vs baseline metrics"
  }];
}
const diff = UNSAFE_withComponentProps(function WhatChanged() {
  return /* @__PURE__ */ jsx(Layout, {
    children: /* @__PURE__ */ jsxs("div", {
      className: "space-y-6",
      children: [/* @__PURE__ */ jsx("div", {
        className: "flex items-center space-x-4",
        children: /* @__PURE__ */ jsx(Button, {
          variant: "outline",
          size: "sm",
          asChild: true,
          children: /* @__PURE__ */ jsxs(Link, {
            to: "/",
            children: [/* @__PURE__ */ jsx(ArrowLeft, {
              className: "h-4 w-4 mr-2"
            }), "Back to Dashboard"]
          })
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "space-y-2",
        children: [/* @__PURE__ */ jsxs("h1", {
          className: "text-3xl font-bold flex items-center gap-3",
          children: [/* @__PURE__ */ jsx(GitCompare, {
            className: "h-8 w-8 text-primary"
          }), "What Changed"]
        }), /* @__PURE__ */ jsx("p", {
          className: "text-lg text-muted-foreground",
          children: "Daily diff cards vs baseline metrics"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
        children: [/* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            children: [/* @__PURE__ */ jsxs(CardTitle, {
              className: "text-lg flex items-center justify-between",
              children: ["Peak Demand", /* @__PURE__ */ jsx(TrendingUp, {
                className: "h-5 w-5 text-green-600"
              })]
            }), /* @__PURE__ */ jsx(CardDescription, {
              children: "vs. 30-day average"
            })]
          }), /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "space-y-3",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex items-center justify-between",
                children: [/* @__PURE__ */ jsx("span", {
                  className: "text-2xl font-bold",
                  children: "24,500"
                }), /* @__PURE__ */ jsx(Badge, {
                  className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
                  children: "+8.5%"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "text-sm text-muted-foreground",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex justify-between",
                  children: [/* @__PURE__ */ jsx("span", {
                    children: "Yesterday:"
                  }), /* @__PURE__ */ jsx("span", {
                    children: "24,500 MW"
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "flex justify-between",
                  children: [/* @__PURE__ */ jsx("span", {
                    children: "Baseline:"
                  }), /* @__PURE__ */ jsx("span", {
                    children: "22,580 MW"
                  })]
                })]
              })]
            })
          })]
        }), /* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            children: [/* @__PURE__ */ jsxs(CardTitle, {
              className: "text-lg flex items-center justify-between",
              children: ["Solar Generation", /* @__PURE__ */ jsx(TrendingDown, {
                className: "h-5 w-5 text-red-600"
              })]
            }), /* @__PURE__ */ jsx(CardDescription, {
              children: "vs. seasonal average"
            })]
          }), /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "space-y-3",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex items-center justify-between",
                children: [/* @__PURE__ */ jsx("span", {
                  className: "text-2xl font-bold",
                  children: "12,400"
                }), /* @__PURE__ */ jsx(Badge, {
                  className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
                  children: "-12.3%"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "text-sm text-muted-foreground",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex justify-between",
                  children: [/* @__PURE__ */ jsx("span", {
                    children: "Yesterday:"
                  }), /* @__PURE__ */ jsx("span", {
                    children: "12,400 MW"
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "flex justify-between",
                  children: [/* @__PURE__ */ jsx("span", {
                    children: "Baseline:"
                  }), /* @__PURE__ */ jsx("span", {
                    children: "14,140 MW"
                  })]
                })]
              })]
            })
          })]
        }), /* @__PURE__ */ jsxs(Card, {
          children: [/* @__PURE__ */ jsxs(CardHeader, {
            children: [/* @__PURE__ */ jsxs(CardTitle, {
              className: "text-lg flex items-center justify-between",
              children: ["Wind Generation", /* @__PURE__ */ jsx(TrendingUp, {
                className: "h-5 w-5 text-green-600"
              })]
            }), /* @__PURE__ */ jsx(CardDescription, {
              children: "vs. weekly average"
            })]
          }), /* @__PURE__ */ jsx(CardContent, {
            children: /* @__PURE__ */ jsxs("div", {
              className: "space-y-3",
              children: [/* @__PURE__ */ jsxs("div", {
                className: "flex items-center justify-between",
                children: [/* @__PURE__ */ jsx("span", {
                  className: "text-2xl font-bold",
                  children: "18,900"
                }), /* @__PURE__ */ jsx(Badge, {
                  className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
                  children: "+23.7%"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                className: "text-sm text-muted-foreground",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex justify-between",
                  children: [/* @__PURE__ */ jsx("span", {
                    children: "Yesterday:"
                  }), /* @__PURE__ */ jsx("span", {
                    children: "18,900 MW"
                  })]
                }), /* @__PURE__ */ jsxs("div", {
                  className: "flex justify-between",
                  children: [/* @__PURE__ */ jsx("span", {
                    children: "Baseline:"
                  }), /* @__PURE__ */ jsx("span", {
                    children: "15,280 MW"
                  })]
                })]
              })]
            })
          })]
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsxs(CardHeader, {
          children: [/* @__PURE__ */ jsx(CardTitle, {
            children: "Yesterday's Notable Changes"
          }), /* @__PURE__ */ jsx(CardDescription, {
            children: "Key deviations from baseline patterns"
          })]
        }), /* @__PURE__ */ jsxs(CardContent, {
          className: "space-y-3",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "p-4 bg-green-50 dark:bg-green-950 rounded-lg",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2 mb-2",
              children: [/* @__PURE__ */ jsx(TrendingUp, {
                className: "h-4 w-4 text-green-600"
              }), /* @__PURE__ */ jsx("span", {
                className: "font-medium text-green-800 dark:text-green-300",
                children: "Strong wind generation"
              })]
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm text-green-700 dark:text-green-400",
              children: "Wind output exceeded weekly average by 23.7% due to favorable weather patterns."
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "p-4 bg-red-50 dark:bg-red-950 rounded-lg",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2 mb-2",
              children: [/* @__PURE__ */ jsx(TrendingDown, {
                className: "h-4 w-4 text-red-600"
              }), /* @__PURE__ */ jsx("span", {
                className: "font-medium text-red-800 dark:text-red-300",
                children: "Reduced solar output"
              })]
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm text-red-700 dark:text-red-400",
              children: "Solar generation dropped 12.3% below seasonal average due to cloud cover."
            })]
          })]
        })]
      }), /* @__PURE__ */ jsxs(Card, {
        children: [/* @__PURE__ */ jsxs(CardHeader, {
          children: [/* @__PURE__ */ jsx(CardTitle, {
            children: "Coming Soon"
          }), /* @__PURE__ */ jsx(CardDescription, {
            children: "Advanced baseline comparisons and change detection"
          })]
        }), /* @__PURE__ */ jsx(CardContent, {
          children: /* @__PURE__ */ jsxs("div", {
            className: "p-4 bg-muted/30 rounded-lg",
            children: [/* @__PURE__ */ jsx("h3", {
              className: "font-semibold mb-3",
              children: "What Changed will include:"
            }), /* @__PURE__ */ jsxs("ul", {
              className: "space-y-2 text-sm text-muted-foreground",
              children: [/* @__PURE__ */ jsx("li", {
                children: "• Multiple baseline comparisons (daily, weekly, seasonal, annual)"
              }), /* @__PURE__ */ jsx("li", {
                children: "• Automated anomaly detection with contextual explanations"
              }), /* @__PURE__ */ jsx("li", {
                children: "• Historical trend analysis and pattern recognition"
              }), /* @__PURE__ */ jsx("li", {
                children: "• Weather correlation and external factor integration"
              }), /* @__PURE__ */ jsx("li", {
                children: "• Customizable alerts for significant grid changes"
              })]
            })]
          })
        })]
      })]
    })
  });
});
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: diff,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-Cd5FAxoU.js", "imports": ["/assets/chunk-PVWAREVJ-CzKxsr-o.js", "/assets/index-by0GzymM.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-DVLBR0-z.js", "imports": ["/assets/chunk-PVWAREVJ-CzKxsr-o.js", "/assets/index-by0GzymM.js"], "css": ["/assets/root-D7AxmYF6.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-oP4d-HYP.js", "imports": ["/assets/chunk-PVWAREVJ-CzKxsr-o.js", "/assets/card-BwhYhYdg.js", "/assets/index-by0GzymM.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/health": { "id": "routes/health", "parentId": "root", "path": "health", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/health-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/daily": { "id": "routes/daily", "parentId": "root", "path": "daily", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/daily-BQz_8wAY.js", "imports": ["/assets/chunk-PVWAREVJ-CzKxsr-o.js", "/assets/card-BwhYhYdg.js", "/assets/button-BPyiinNK.js", "/assets/trending-up-91bA6oDQ.js", "/assets/index-by0GzymM.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/wpm": { "id": "routes/wpm", "parentId": "root", "path": "wpm", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/wpm-DJiqqR8H.js", "imports": ["/assets/chunk-PVWAREVJ-CzKxsr-o.js", "/assets/card-BwhYhYdg.js", "/assets/button-BPyiinNK.js", "/assets/index-by0GzymM.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/ducks": { "id": "routes/ducks", "parentId": "root", "path": "ducks", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/ducks-CFFbay81.js", "imports": ["/assets/chunk-PVWAREVJ-CzKxsr-o.js", "/assets/card-BwhYhYdg.js", "/assets/button-BPyiinNK.js", "/assets/trending-down-BbvKeqbA.js", "/assets/index-by0GzymM.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/diff": { "id": "routes/diff", "parentId": "root", "path": "diff", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/diff-Ce-nD1Nx.js", "imports": ["/assets/chunk-PVWAREVJ-CzKxsr-o.js", "/assets/card-BwhYhYdg.js", "/assets/button-BPyiinNK.js", "/assets/trending-up-91bA6oDQ.js", "/assets/trending-down-BbvKeqbA.js", "/assets/index-by0GzymM.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-457baf55.js", "version": "457baf55", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/health": {
    id: "routes/health",
    parentId: "root",
    path: "health",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/daily": {
    id: "routes/daily",
    parentId: "root",
    path: "daily",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/wpm": {
    id: "routes/wpm",
    parentId: "root",
    path: "wpm",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/ducks": {
    id: "routes/ducks",
    parentId: "root",
    path: "ducks",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/diff": {
    id: "routes/diff",
    parentId: "root",
    path: "diff",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
