# TBH Monorepo

A modern monorepo built with Turborepo, PNPM, and Supabase. This project follows Clean Architecture and Case-driven logic.

## 🏗 Project Structure

- **apps/**
  - `inventory-app`: Vite/React/Typescript inventory management system.
  - `web-public`: Public-facing website.
- **packages/**
  - `application`: Business logic and use cases.
  - `domain`: Core entities and logic.
  - `infrastructure`: Data access and repositories.
  - `ui`: Shared UI components.
  - `types`: Common TypeScript definitions.
  - `config`: Tooling and configuration (Eslint, Prettier, Turbo).
- **supabase/**: Database migrations, functions, and seed data.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [PNPM](https://pnpm.io/)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### Installation

```bash
pnpm install
```

### Local Development

```bash
pnpm dev
# or for a specific app
pnpm --filter inventory-app dev
```

## 🛠 Tech Stack

- **Framework**: Vite/React
- **State Management**: (Add details if available, e.g. Zustand, Bloc)
- **Monorepo Tooling**: Turborepo, PNPM Workspaces
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Validation**: Zod (if used)

## 🛡 Security & Quality

- **Husky & Lint-staged**: Automated linting and formatting on every commit.
- **Secret Detection**: Pre-commit hooks to prevent secret leakage.
- **Clean Architecture**: Strong boundary between layers.

## 📜 Documentation

Refer to the [docs/](file:///Users/aletzsantiagodavilamenez/Documents/Projects/TBH-monorepo/docs) directory for detailed architectural guidelines.
