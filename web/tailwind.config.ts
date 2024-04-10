import type { Config } from "tailwindcss";
import daisyui from "daisy-ui";

export default {
  content: [
    "{routes,islands,components,doc}/**/*.{ts,tsx,md}",
  ],
  plugins: [
    {
      handler: daisyui.handler,
      config: daisyui.config,
    },
  ],
  daisyui: {
    themes: ["cmyk"],
    safelist: ["chat"],
    logs: false,
  },
} satisfies Config;
