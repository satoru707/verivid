# VeriVid - Complete Deployment Guide

## Quick Reference

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or pnpm
- MetaMask browser extension (for development)

### Development URLs
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`
- Database: `postgresql://localhost/verivid`

## Local Development Setup

### Step 1: Backend Setup

\`\`\`bash
cd server
npm install

# Create environment file
cat > .env << 'EOF'
DATABASE_URL="postgresql://user:password@localhost:5432/verivid"
JWT_SECRET="dev-secret-key-change-in-production"
FRONTEND_URL="http://localhost:5173"
PORT=3001
NODE_ENV=development
EOF

# Run database migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate

# Start development server
npm run dev
\`\`\`

Backend running on: `http://localhost:3001`

### Step 2: Frontend Setup

\`\`\`bash
cd client
npm install

# Create environment file
cat > .env.local << 'EOF'
VITE_API_URL=http://localhost:3001
EOF

# Start development server
npm run dev
\`\`\`

Frontend running on: `http://localhost:5173`

### Step 3: Test the Application

1. Open `http://localhost:5173` in your browser
2. Click "Connect Wallet"
3. Select MetaMask
4. Sign the nonce message
5. Create your profile
6. Upload a video
7. Verify the video on-chain (if smart contract deployed)

## API Endpoint Reference

### Authentication

\`\`\`bash
# Get nonce for signing
curl -X POST http://localhost:3001/auth/nonce \
  -H "Content-Type: application/json" \
  -d '{"wallet":"0x742d35Cc6634C0532925a3b844Bc56e4C8dEbf2d"}'

# Verify signature and get JWT
curl -X POST http://localhost:3001/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "wallet":"0x742d35Cc6634C0532925a3b844Bc56e4C8dEbf2d",
    "signature":"0x..."
  }'

# Logout
curl -X POST http://localhost:3001/auth/logout \
  -b "jwt=your-jwt-token"
\`\`\`

### User Profile

\`\`\`bash
# Get current user
curl -X GET http://localhost:3001/api/user/me \
  -b "jwt=your-jwt-token"

# Update profile
curl -X POST http://localhost:3001/api/user \
  -H "Content-Type: application/json" \
  -b "jwt=your-jwt-token" \
  -d '{
    "username":"johndoe",
    "email":"john@example.com",
    "bio":"Developer & Creator"
  }'

# Get public profile
curl -X GET http://localhost:3001/api/user/0x742d35Cc6634C0532925a3b844Bc56e4C8dEbf2d
\`\`\`

### Videos

\`\`\`bash
# List user videos
curl -X GET http://localhost:3001/api/videos \
  -b "jwt=your-jwt-token"

# Initialize upload
curl -X POST http://localhost:3001/api/videos/upload-init \
  -H "Content-Type: application/json" \
  -b "jwt=your-jwt-token" \
  -d '{
    "filename":"video.mp4",
    "size":50000000
  }'

# Complete upload
curl -X POST http://localhost:3001/api/videos/:videoId/upload-complete \
  -H "Content-Type: application/json" \
  -b "jwt=your-jwt-token" \
  -d '{"sha256":"abc123..."}'
\`\`\`

## Production Deployment

### Environment Variables - Production

\`\`\`bash
# Backend (.env)
NODE_ENV=production
DATABASE_URL="postgresql://prod_user:prod_pass@prod_host:5432/verivid"
JWT_SECRET="use-a-strong-random-secret-minimum-32-chars-CHANGE-THIS"
FRONTEND_URL="https://yourdomain.com"
PORT=3001

# Frontend (.env.production.local)
VITE_API_URL=https://api.yourdomain.com
\`\`\`

### Deploy to Vercel

**Backend:**
\`\`\`bash
cd server
npm install -g vercel
vercel deploy --prod
\`\`\`

**Frontend:**
\`\`\`bash
cd client
vercel deploy --prod
\`\`\`

Then set environment variables in Vercel Dashboard:
- Backend: DATABASE_URL, JWT_SECRET, FRONTEND_URL
- Frontend: VITE_API_URL

### Deploy to Railway / Render

1. Create new project and connect GitHub repository
2. Set environment variables in platform dashboard
3. Deploy automatically on git push

### Docker Deployment

\`\`\`bash
# Start PostgreSQL and app
docker-compose up -d

# Run migrations
cd server
npm run prisma:migrate -- --skip-generate
\`\`\`

## Database Management

\`\`\`bash
# View database GUI
npm run prisma:studio

# Create new migration
npm run prisma:migrate -- --name your_migration_name

# Reset database (development only!)
npm run prisma:migrate reset

# Generate Prisma client
npm run prisma:generate
\`\`\`

## Troubleshooting

### "Cannot POST /auth/nonce"
- Check backend is running on port 3001
- Verify CORS is enabled: check FRONTEND_URL in .env
- Check firewall isn't blocking port 3001

### "JWT verification failed"
- Ensure JWT_SECRET is consistent between requests
- Check cookie is being sent with requests
- Verify token hasn't expired (default: 7 days)
- Clear cookies and reconnect wallet

### "Database connection error"
- Ensure PostgreSQL is running
- Verify DATABASE_URL is correct
- Test connection: `psql $DATABASE_URL`
- Check database exists: `psql -l`

### "MetaMask not connecting"
- Ensure MetaMask extension is installed
- Check you're on supported network (Ethereum)
- Verify backend FRONTEND_URL allows your domain
- Check browser console (F12) for errors
- Try refreshing page

### "Video upload fails"
- Check file size doesn't exceed 500MB
- Verify SHA256 hash calculation is correct
- Ensure storage URL is accessible
- Check upload-complete endpoint is called

## Monitoring & Logging

Enable debug logs:
\`\`\`bash
DEBUG=verivid:* npm run dev
\`\`\`

All API responses follow format:
\`\`\`json
{
  "error": null,
  "data": { /* response data */ }
}
\`\`\`

On error:
\`\`\`json
{
  "error": "Error message describing what went wrong",
  "data": null
}
\`\`\`

## Security Checklist for Production

- [ ] Change JWT_SECRET to strong random value
- [ ] Use HTTPS for all connections
- [ ] Enable database backups and point-in-time recovery
- [ ] Setup monitoring and alerting (errors, latency)
- [ ] Configure rate limiting appropriately
- [ ] Review CORS configuration for your domain
- [ ] Use environment variables from hosting provider
- [ ] Enable HTTPS-only cookies in production
- [ ] Configure SSL/TLS certificates (auto-renew)
- [ ] Setup database connection pooling
- [ ] Enable audit logging
- [ ] Setup error tracking (Sentry, etc.)
- [ ] Test disaster recovery procedures
- [ ] Monitor blockchain RPC endpoint availability

## Performance Tips

- Use CDN for static assets
- Enable database query caching
- Configure Redis for session storage (optional)
- Use connection pooling for database
- Enable gzip compression in Express
- Monitor API response times
- Setup alerts for slow queries

## Support & Resources

For issues:
1. Check server logs: `npm run dev`
2. Check browser console: Press F12
3. Review API responses in Network tab
4. Check database: `npm run prisma:studio`
5. Review error logs for detailed error messages

Documentation:
- [README.md](./README.md) - Project overview
- [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) - Verification checklist
- [server/SETUP.md](./server/SETUP.md) - Backend setup details

\`\`\`
