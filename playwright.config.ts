import { defineConfig } from "@playwright/test";
// Default to demo config for now if no specific config is invoked directly
// or re-export the base config.
// However, the walkthrough implies specific configs are used via --config flag.
// Ideally, this root config acts as a fallback or "local dev" config.

// For now, mirroring the demo config as the default entry point is safe as per the plan.
import demoConfig from "./e2e/config/demo.config";

export default defineConfig(demoConfig);
