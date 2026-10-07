# ResumeRevamp

An AI-powered resume optimization platform (built on Replit) that scores resumes for ATS compatibility, suggests improvements, applies AI rewrites, and exports a PDF.

## Features

- Upload/paste a resume and receive an ATS compatibility score (`/api/resume/ats-score`)
- AI-generated improvement suggestions (`/api/resume/suggestions`)
- One-click AI optimization of resume content (`/api/resume/optimize`)
- PDF export of the optimized resume via Puppeteer (`/api/resume/download-pdf`)
- Save resumes; in-memory storage interface with a Postgres/Drizzle schema ready for persistence

## Tech stack

- Frontend: React + TypeScript, Vite, Wouter, TanStack Query, Tailwind CSS, shadcn/ui (Radix primitives)
- Backend: Node.js, Express 5, TypeScript
- AI: OpenAI (`server/services/openai.ts`)
- Resume parsing: `server/services/resumeParser.ts`; PDF: `server/services/pdfGenerator.ts` (Puppeteer)
- Data: Drizzle ORM with Neon serverless Postgres driver; session storage via `connect-pg-simple`/`memorystore`

## Getting started

Scripts from `package.json`:

- `npm run dev` — development (tsx server + Vite)
- `npm run build` — build client and bundle server
- `npm start` — run production build
- `npm run check` — `tsc` typecheck
- `npm run db:push` — push Drizzle schema to Postgres (needs `DATABASE_URL`)

## Project structure

- `client/src/` — React app (`App.tsx`, resume viewer/editor dialogs, optimization panel, ATS progress components, `ui/` shadcn components)
- `server/` — Express app (`routes.ts`, `storage.ts`, `services/openai.ts`, `services/resumeParser.ts`, `services/pdfGenerator.ts`)
- `shared/` — shared types/schema
- `replit.md` — project overview and architecture notes

## Status

Functional scaffold with the resume pipeline (score → suggest → optimize → PDF) implemented. A pasted sample resume sits in `attached_assets/` (not used by the app at runtime).
