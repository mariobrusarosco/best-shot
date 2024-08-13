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

const IndexLazyImport = createFileRoute('/')()
const TournamentsIndexLazyImport = createFileRoute('/tournaments/')()
const LeaguesIndexLazyImport = createFileRoute('/leagues/')()
const TournamentsIdLazyImport = createFileRoute('/tournaments/$id')()

// Create/Update Routes

const DashboardRoute = DashboardImport.update({
  path: '/dashboard',
  getParentRoute: () => rootRoute,
} as any)

const IndexLazyRoute = IndexLazyImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const TournamentsIndexLazyRoute = TournamentsIndexLazyImport.update({
  path: '/tournaments/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/tournaments.index.lazy').then((d) => d.Route),
)

const LeaguesIndexLazyRoute = LeaguesIndexLazyImport.update({
  path: '/leagues/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/leagues.index.lazy').then((d) => d.Route))

const TournamentsIdLazyRoute = TournamentsIdLazyImport.update({
  path: '/tournaments/$id',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/tournaments.$id.lazy').then((d) => d.Route),
)

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
    '/tournaments/$id': {
      id: '/tournaments/$id'
      path: '/tournaments/$id'
      fullPath: '/tournaments/$id'
      preLoaderRoute: typeof TournamentsIdLazyImport
      parentRoute: typeof rootRoute
    }
    '/leagues/': {
      id: '/leagues/'
      path: '/leagues'
      fullPath: '/leagues'
      preLoaderRoute: typeof LeaguesIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/tournaments/': {
      id: '/tournaments/'
      path: '/tournaments'
      fullPath: '/tournaments'
      preLoaderRoute: typeof TournamentsIndexLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexLazyRoute,
  DashboardRoute,
  TournamentsIdLazyRoute,
  LeaguesIndexLazyRoute,
  TournamentsIndexLazyRoute,
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
        "/tournaments/$id",
        "/leagues/",
        "/tournaments/"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/dashboard": {
      "filePath": "dashboard.tsx"
    },
    "/tournaments/$id": {
      "filePath": "tournaments.$id.lazy.tsx"
    },
    "/leagues/": {
      "filePath": "leagues.index.lazy.tsx"
    },
    "/tournaments/": {
      "filePath": "tournaments.index.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
