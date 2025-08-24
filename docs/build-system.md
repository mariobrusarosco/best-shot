# Build System

This Web App is built with `vite`.

## How?

### Configuration

First we configure it through `vite.config.ts` file, located
at the `root` level.

- It automatically provides support for `Typescript`
- We explicit add React support via plugin: `@vitejs/plugin-react`

### Usage

When configurated, `vite` will build the App in two ways:

- An App's _local version_. `Vite` will create this version `in memory`. Meaning it doesn't create our App and place it in a directory, in our machines1s HD. The App is temporary and, we can see it in action by running:

```bash
 yarn dev
```

We can access the App under `http://localhost:5173/`.

- An App's _distribution version_. `Vite` will indeed create this version in our machine and, place it into a `dist` folder at the `root` level. We can see it in action by running:

```bash
 yarn build
 yarn preview
```

## Environments and Environment Variables

This app supports three environments:

1. Local

This is the version we run locally. We can set specific _Variables_ for this _environment_
on `.env` at the `root` level.

2. Staging

This is version we can use for simulating a production environment and perform manual tests, add beta features and so on. We can set specific _Variables_ for this _environment_ on `.env.staging` at the `root` level.

3. Production

This is version we provide to our final users. We can set specific _Variables_ for this _environment_ on `.env.production` at the `root` level.
