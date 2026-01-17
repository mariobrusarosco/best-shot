# Best Shot

A side project _Football App_ where I intend to:

1. Simulate a real world app, as much as possible. The goal is to validate premises and get a closer feeling about the pros anb cons regarding front end patterns, tools and frameworks.

2. Use it as part of my _portfolio_ so I can demonstrate _some_ skills and tools I've learnt.

# Stack

LANGUAGE

- Typescript

FRAMEWORK

- React

TOOLS

- Tanstack Router
- MUI
- Vite
- Github Actions
- AWS Cloudftont
- AWS Route 53
- AWS Buckets
- AWS CLI
- Prettier
- Vitest

# ScreenShots

# Design

# Project

## Engenireeing

- _State Management_: [here](https://github.com/users/mariobrusarosco/docs/state-management.md).
- _Build System_: [here](https://github.com/users/mariobrusarosco/docs/build-system.md).
- _CI/CD_: [here](https://github.com/users/mariobrusarosco/docs/ci-cd.md).
- _Styling_: [here](https://github.com/users/mariobrusarosco/docs/styling.md).
- _Tooling_: Coming Soon.
- _Routing_: Coming Soon.
- _Authentication_: Coming Soon.
- _Unit Testing_: Coming Soon.
- _Profiling_: Coming Soon.

## Environment Variables

This project uses environment modes (`local-dev`, `demo`, `staging`, `production`) to manage different configurations.

**Quick Start:**
```bash
# Copy the example file
cp .env.example .env

# Add your credentials (Auth0, API keys, etc.)
vim .env

# Start developing
yarn dev
```

**Key Points:**
- All `.env` files are gitignored - never commit secrets
- Variables with `VITE_` prefix are available in app code
- Deployed environments use GitHub Secrets (not .env files)
- Each mode can have different behavior (e.g., Auth0 vs Bypass authentication)

📚 **Full documentation:** [Environment Variables Walkthrough](./docs/environment-variables-walkthrough.md)

## Documentation

When creating walkthroughs or deep-dive documentation, follow the structure and style established in [docs/environment-variables-walkthrough.md](./docs/environment-variables-walkthrough.md). This is the de facto standard for comprehensive yet concise documentation.

## Product

- _Design_: [here](https://www.figma.com/file/KZ4tq3xzzz2CvWwijUZoRy/Side-Projects?type=design&node-id=919-4165&mode=design&t=NeIWW7N9vz1Wq7P7-0)
- _Tasks_: [here](https://github.com/users/mariobrusarosco/projects/4).
- _QA_: [here](https://github.com/users/mariobrusarosco/projects/5).
