# Metro Probati — Vercel & GitHub Deployment Guide

## 1. Quick Deploy with GitHub & Vercel

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete Metro Probati platform implementation"
   git remote add origin https://github.com/<your-username>/metro-probati-platform.git
   git branch -M main
   git push -u origin main
   ```

2. Open [Vercel Dashboard](https://vercel.com/new).
3. Import the `metro-probati-platform` repository.
4. Keep the framework preset as **Next.js**.
5. Add the Environment Variables (see `.env.example`).
6. Click **Deploy**.

## 2. Vercel Configuration (`vercel.json`)
A default `vercel.json` is provided in the repository with optimal caching headers and serverless function limits.

## 3. Post-Deployment Verification
- Ensure the production URL displays Bengali typography correctly.
- Test the seat reservation flow and verify that 5-minute holds expire appropriately.
- Check that `/api/tracking/buses` and `/api/admin/metrics` return HTTP 200.
