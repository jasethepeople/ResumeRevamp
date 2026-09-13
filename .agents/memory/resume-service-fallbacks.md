---
name: Resume service fallbacks
description: Environment constraints and reliability rules for resume analysis and PDF generation.
---

The resume app should remain usable when external AI credentials are absent or invalid. Use deterministic local scoring, suggestions, and optimization as the fallback instead of returning a 500 response.

**Why:** The development environment may not have a valid OpenAI credential, and a placeholder credential causes every analysis action to fail.

**How to apply:** Treat OpenAI as an enhancement, not a prerequisite. Catch provider failures and return schema-valid local results.

PDF generation should prefer the Replit-provided Chromium executable at `/repl/tools/bin/chromium` when available, with a dependency-free PDF fallback if browser launch fails.

**Why:** Puppeteer does not automatically find the environment's Chromium binary, so relying on its cache makes PDF export fail even though Chromium is installed.

**How to apply:** Set an explicit executable path when present and keep a server-side fallback for deployments without a browser binary.