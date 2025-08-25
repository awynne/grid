import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "app",
  buildDirectory: "build",
  ssr: true,
  future: {
    unstable_typegen: true,
  },
} satisfies Config;