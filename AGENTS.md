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

## Documentation To Link (Do Not Duplicate)
- Front docs index: [DocPerso/README.md](DocPerso/README.md)
- Styles and token usage: [DocPerso/GUIDE-STYLES.md](DocPerso/GUIDE-STYLES.md)
- Integration checklist: [DocPerso/INTEGRATION-CHECKLIST.md](DocPerso/INTEGRATION-CHECKLIST.md)
- Profile specifics: [DocPerso/PROFILE-GUIDE.md](DocPerso/PROFILE-GUIDE.md)
- PWA config: [DocPerso/PWA-CONFIG-GUIDE.md](DocPerso/PWA-CONFIG-GUIDE.md)
- SEO footer notes: [DocPerso/FOOTER-SEO-GUIDE.md](DocPerso/FOOTER-SEO-GUIDE.md)

## Change Hygiene
- Make small, focused diffs.
- Run lint for touched areas before finalizing.
- Do not refactor unrelated files in the same change.
-Do not run server by our own, it's already running in the dev environment.

## Graphical goals:

-We want to recreate visually the same interface as the client's maquet ( https://mandibula.darkmalekith94.chatgpt.site/) but with my architecture and components. The goal is to have a clean, maintainable codebase that matches the client's design while leveraging our existing UI primitives and architecture.
I want clean code, with a clear separation of concerns, and to avoid unnecessary complexity. The focus should be on reusability and consistency across the application.
-Don't launch linting on the codebase , I'll do it myself, you can focus on the code itself.