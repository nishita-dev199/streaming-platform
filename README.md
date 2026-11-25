# Streaming Platform

A video streaming platform built as a TypeScript monorepo, with a Next.js web app and a Node.js API.

## Structure

```
apps/
├── api/   # Backend API
└── web/   # Next.js frontend
```

## Getting Started

```bash
npm install
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
docker compose up -d
```

Then run the apps from their folders:

```bash
npm run dev --workspace apps/api
npm run dev --workspace apps/web
```

## Status

Work in progress.