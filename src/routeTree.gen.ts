/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as DashboardImport } from './routes/dashboard'

// Create Virtual Routes

const TournamentsLazyImport = createFileRoute('/tournaments')()
const LeaguesLazyImport = createFileRoute('/leagues')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const TournamentsLazyRoute = TournamentsLazyImport.update({
  path: '/tournaments',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/tournaments.lazy').then((d) => d.Route))

const LeaguesLazyRoute = LeaguesLazyImport.update({
  path: '/leagues',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/leagues.lazy').then((d) => d.Route))

const DashboardRoute = DashboardImport.update({
  path: '/dashboard',
  getParentRoute: () => rootRoute,
} as any)

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/dashboard': {
      id: '/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof DashboardImport
      parentRoute: typeof rootRoute
    }
    '/leagues': {
      id: '/leagues'
      path: '/leagues'
      fullPath: '/leagues'
      preLoaderRoute: typeof LeaguesLazyImport
      parentRoute: typeof rootRoute
    }
    '/tournaments': {
      id: '/tournaments'
      path: '/tournaments'
      fullPath: '/tournaments'
      preLoaderRoute: typeof TournamentsLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexLazyRoute,
  DashboardRoute,
  LeaguesLazyRoute,
  TournamentsLazyRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/dashboard",
        "/leagues",
        "/tournaments"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/dashboard": {
      "filePath": "dashboard.tsx"
    },
    "/leagues": {
      "filePath": "leagues.lazy.tsx"
    },
    "/tournaments": {
      "filePath": "tournaments.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
