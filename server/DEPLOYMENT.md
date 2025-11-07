# VeriVid Backend Deployment Guide

## Prerequisites

- Docker installed
- Vercel CLI or hosting platform account
- PostgreSQL database (managed service)
- Redis instance (optional but recommended)
- Environment variables configured

## Local Docker Development

\`\`\`bash
docker-compose up
\`\`\`

This starts:
- PostgreSQL on :5432
- Redis on :6379
- Server on :3001

## Vercel Deployment

### 1. Connect Repository

\`\`\`bash
vercel link
\`\`\`

### 2. Configure Environment Variables

In Vercel dashboard, add:

\`\`\`
DATABASE_URL=postgresql://...
JWT_SECRET=your-production-secret
CONTRACT_ADDRESS=0x...
FRONTEND_URL=https://your-frontend.vercel.app
\`\`\`

### 3. Deploy

\`\`\`bash
vercel deploy --prod
\`\`\`

## Railway Deployment

### 1. Connect GitHub

1. Go to railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect your repository

### 2. Add PostgreSQL

1. Add new service → PostgreSQL
2. Railway will provide DATABASE_URL

### 3. Configure Server

1. Add environment variables
2. Set start command: `pnpm run build && pnpm start`

### 4. Deploy

Railway will auto-deploy on push

## Render Deployment

### 1. Create Web Service

1. Go to render.com
2. New → Web Service
3. Connect GitHub repository

### 2. Configure

- Runtime: Node
- Build command: `pnpm install && pnpm run build`
- Start command: `pnpm start`

### 3. Add PostgreSQL

- Create PostgreSQL service
- Link to web service via environment variables

## Production Checklist

- [ ] Database backups configured
- [ ] JWT_SECRET is strong (use: `openssl rand -base64 32`)
- [ ] CORS origin is production frontend URL
- [ ] Email service configured
- [ ] Monitoring/logging (Sentry) setup
- [ ] Rate limiting tested
- [ ] Smart contract deployed on mainnet
- [ ] IPFS pinning service configured
- [ ] SSL/TLS certificates valid

## Scaling

For production load:

1. **Database**: Use managed PostgreSQL (Supabase, AWS RDS)
2. **Redis**: Add for session caching and job queue
3. **S3**: Configure for video storage
4. **CDN**: Cloudflare for edge caching
5. **Load Balancer**: Behind reverse proxy (nginx, HAProxy)
