# Rare Medicine Locator - MERN Stack

This project is separated for easy deployment:

- `rare-medicine-backend` deploys on Render.
- `rare-medicine-frontend` deploys on Vercel.

## Local Setup

1. Install all dependencies from the `ATP` folder:

```bash
npm run install-all
```

2. Add MongoDB Atlas connection in `rare-medicine-backend/.env`.

3. Run backend:

```bash
cd rare-medicine-backend
npm run dev
```

4. Run frontend in another terminal:

```bash
cd rare-medicine-frontend
npm run dev
```

## Render Backend

Root directory:

```text
rare-medicine-backend
```

Build command:

```bash
npm install
```

Start command:

```bash
npm start
```

Environment variables:

```text
NODE_ENV=production
PORT=10000
DB_URL=your_mongodb_atlas_url
SECRET_KEY=your_long_secret_key
FRONTEND_URL=https://your-vercel-app.vercel.app
```

## Vercel Frontend

Root directory:

```text
rare-medicine-frontend
```

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

Environment variable:

```text
VITE_API_BASE_URL=https://your-render-backend.onrender.com
```
