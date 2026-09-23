# AGENTS

## Scope
This file guides AI coding agents working in this repository only.
Repository: mandibula-front (Next.js App Router, TypeScript, Tailwind, shadcn/ui).

## Fast Start
- Install: `pnpm install`
- Dev: `pnpm dev`
- Dev staging env: `pnpm dev:staging`
- Lint: `pnpm lint`
- Build: `pnpm build`pp
- Start production build: `pnpm start`

## Architecture Map
- Routing and layouts: [app](app)
- Auth route group: [app/(auth)](app/(auth))
- Main app route group: [app/(main)](app/(main))
- Next API proxy for auth: [app/api/auth](app/api/auth)
- Reusable components: [components](components)
- Shared UI primitives: [components/ui](components/ui)
- Feature components: [components/features](components/features)
- Cart context: [context/CartContext.tsx](context/CartContext.tsx)
- Shared hooks: [hooks](hooks)
- Auth client helpers: [lib/auth.client.ts](lib/auth.client.ts), [lib/authProviders.ts](lib/authProviders.ts)

## Conventions For Agents
- Keep components strongly typed with TypeScript; avoid `any` unless unavoidable.
- Prefer existing UI primitives in [components/ui](components/ui) and project feature components before adding new ones.
- Keep App Router boundaries clear: page/layout loading in [app](app), reusable logic in [components](components), [hooks](hooks), [lib](lib).
- For auth flows, keep frontend calls aligned with the local auth proxy under [app/api/auth](app/api/auth).
- Reuse existing design tokens and utility classes from [app/globals.css](app/globals.css) and [tailwind.config.js](tailwind.config.js).

## Common Pitfalls
- Do not bypass the local auth proxy with direct cross-origin auth calls unless explicitly requested.
- Dev scripts rely on `NODE_OPTIONS=--max-http-header-size=131072`; keep this if you touch scripts.
- If you add environment-dependent behavior, verify `.env.staging` compatibility because `dev:staging` is used.


## Change Hygiene
- Make small, focused diffs.
- Keep commit messages clear and descriptive in English.
- Do not refactor unrelated files in the same change.
- Do not run server by our own, it's already running in the dev environment, same for linting, building.
- No duplicate effort; always check existing components, hooks, and utilities before creating new ones.
-Use as few tokens as possible to save my Copilot's resources. 


