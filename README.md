# Product Management System (Frontend)

React + TypeScript frontend for the SMA assessment Product Management System. Built with TanStack Query, Axios, Zod, and React Hook Form.

## Tech Stack

- React + TypeScript (Next.js App Router)
- TanStack Query for async state
- Zustand (forminimal auth store)
- Axios for API calls
- Zod + React Hook Form for validation
- Tailwind CSS for styling

## Prerequisites

- Node.js 18++
- Backend running on `http://localhost:8080`

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

## Environment Variables

Create `.env.local` (or use `.env.example` as a starting point):

```
NEXT_PUBLIC_API_BASE_URL="http://localhost:8080"
```

## How to Run

Start the backend first (see backend README), then run the frontend:

```bash
npm run dev
```

App runs on `http://localhost:3000`.

## Seeding

For large seed data (50,000 products), run the backend seed script:

```bash
cd backend
npm run seed
```

For smaller seeds, use the protected UI at `/products/seed` (max 5,000 per request).

## Pages and Routes

- `/` → redirects to `/signin`
- `/signin` → Sign in page
- `/signup` → Sign up page
- `/products` → Product list (protected)
- `/products/new` → Create product
- `/products/:id` → Product details
- `/products/:id/edit` → Edit product

## State Management

TanStack Query handles async data (loading, error, retries). A minimal Zustand store keeps auth state in memory + localStorage:

- `authStore` → `user`, `isAuthenticated`

## API Integration

API calls are separated from UI:

- `lib/api.ts` → Axios client (base URL + `/api` prefix)
- `lib/services/*` → auth/product calls
- `hooks/useAuthMutations.ts` → auth mutations
- `hooks/useProductQueries.ts` → product queries/mutations
- `lib/schemas/*` → Zod schemas

## Folder Structure

- `app/` → routes and pages
- `components/` → shared UI components
- `components/products/` → product-specific UI components
- `hooks/` → TanStack hooks
- `lib/` → API client, services, schemas
- `store/` → Zustand auth store
