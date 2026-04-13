## Todo Atlas

A production-ready Next.js todo application with MongoDB + Mongoose, clean API routes, and a modern responsive UI.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Add your MongoDB connection string in `.env.local`:

```bash
MONGO_URI="your-mongodb-uri"
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Structure

- `app/api/todos` - REST API routes
- `components` - reusable UI components
- `lib/controllers` - database controller logic
- `lib/models` - Mongoose models
- `lib/utils` - shared utilities and validators
- `lib/configs` - database connection configuration

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
