import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("health", "routes/health.tsx"),
  route("daily", "routes/daily.tsx"),
  route("wpm", "routes/wpm.tsx"),
  route("ducks", "routes/ducks.tsx"),
  route("diff", "routes/diff.tsx"),
] satisfies RouteConfig;