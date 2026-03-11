# Project Overview

This is a modern web application built with **Next.js 16**, **React 19**, and **Tailwind CSS 4**. The project is structured as a monorepo-style or a single-project container, with the main application residing in the `my-profile` directory. It uses the **Next.js App Router** and **TypeScript** for a robust and scalable development experience.

## Main Technologies
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **Fonts:** Geist and Geist Mono (via `next/font`)

---

# Building and Running

All commands should be executed from within the `my-profile` directory.

### Development Server
Starts the development server with hot-reloading.
```bash
cd my-profile
npm run dev
```

### Build for Production
Compiles the application for production deployment.
```bash
cd my-profile
npm run build
```

### Start Production Server
Runs the compiled application.
```bash
cd my-profile
npm run start
```

### Linting
Runs ESLint to check for code quality and style issues.
```bash
cd my-profile
npm run lint
```

---

# Development Conventions

- **Architecture:** Follows the Next.js App Router pattern (`app/` directory).
- **Styling:** Use Tailwind CSS for component styling. Global styles are defined in `app/globals.css`.
- **TypeScript:** Strict type checking is enabled. Ensure all new components and functions are properly typed.
- **Components:** Favor functional components and React Hooks.
- **Path Aliases:** Use `@/*` to refer to the root of the `my-profile` directory (e.g., `@/app/components/...`).
- **Formatting:** Adhere to the project's ESLint configuration (`eslint.config.mjs`).
