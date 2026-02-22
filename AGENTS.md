## Non-negotiable workflow
1. Pattern-first:
   - Before editing routing/state architecture, inspect at least 2 existing in-repo examples.
   - Mirror existing conventions; do not invent a new pattern.

2. No workaround-first:
   - Do not ship conditional/temporary routing logic if a structural fix exists.
   - Prefer canonical file-routing structure used by this repo.

3. TanStack routing rules (this repo):
   - Use `.../feature/index.lazy.tsx` for list/index pages.
   - Use `.../feature/$id.lazy.tsx` for detail pages.
   - Avoid `feature.lazy.tsx` parent patterns unless already established in repo.

4. Definition of done for route changes:
   - Run `corepack yarn generate-routes`
   - Run `corepack yarn validate`
   - Run `corepack yarn validate:lint`
   - Report exact files changed and routeTree impact.

5. Uncertainty handling:
   - If confidence is low on conventions, stop and ask one precise question before coding.
