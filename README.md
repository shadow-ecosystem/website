# Shadow Website

This is the official website for [Shadow](https://www.shadow.com.bd), a software company building the Shadow ecosystem. Our vision is to make everyone's life easy through simplicity, privacy, and user-friendly design.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Styling**: Custom CSS with [Material Web Components](https://github.com/material-components/material-web)
- **Fonts**: Google Sans, Product Sans, and Material Symbols Rounded
- **Linting & Formatting**: [Biome](https://biomejs.dev)

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `npm run dev`: Starts the local development server.
- `npm run build`: Creates an optimized production build.
- `npm run start`: Starts the production server.
- `npm run format`: Formats code using Biome.
- `npm run lint`: Checks for linting/formatting errors using Biome.

## Structure

- `src/app/page.tsx`: The main landing page.
- `src/app/globals.css`: Global styles including theme variables and responsive layout styling.
- `src/app/layout.tsx`: Root layout component handling metadata and external script/font injections.
