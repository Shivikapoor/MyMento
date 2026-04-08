# Deployment Fix Notes

## Why live fails while local works

Your frontend is deployed on Vercel and your backend is deployed on Render. When a Render free instance sleeps, the first browser request often fails before CORS headers are returned, and the browser reports it like a CORS/network error.

## Exact fix for stable live deployments

1. In Render, upgrade the backend service to a plan that does not sleep.
2. If you stay on a sleeping/free plan, add an external uptime monitor that calls `https://mymento-backend.onrender.com/health` every 5 minutes.
3. In Render environment variables, set:
   `FRONTEND_URL=https://my-mento.vercel.app`
4. In Render environment variables, set:
   `CORS_ORIGINS=https://my-mento.vercel.app,https://mymento.vercel.app`
5. In Vercel environment variables for the frontend, set:
   `VITE_API_URL=https://mymento-backend.onrender.com`
6. Redeploy both services after saving env changes.

## What was changed in code

- The frontend now waits for the Render backend to wake up before failing login/signup requests.
- The frontend proxy config now reads `VITE_API_URL` instead of relying on a hardcoded backend URL.
- The backend health endpoint now reports database connectivity, and CORS origin matching is more consistent for localhost, Vercel, and Render preview domains.

## Local setup

- Frontend local env:
  `VITE_API_URL=http://localhost:5001`
- Backend local env:
  use your local `PORT`, `MONGO_URI`, and mail credentials as before.
