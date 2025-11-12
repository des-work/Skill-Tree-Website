# Deployment Guide

## Deployment Options

For a small website with ~200 users, here are recommended deployment options:

### Option 1: Heroku (Easiest)

**Pros:**
- Free tier available
- Easy deployment
- Automatic SSL
- Good for small projects

**Steps:**
1. Create a Heroku account
2. Install Heroku CLI
3. Deploy backend and frontend separately or use a buildpack

### Option 2: DigitalOcean App Platform

**Pros:**
- $5/month for small apps
- Easy to scale
- Good performance

**Steps:**
1. Create DigitalOcean account
2. Connect GitHub repository
3. Configure build settings
4. Deploy

### Option 3: Railway

**Pros:**
- Free tier
- Very easy deployment
- Good developer experience

**Steps:**
1. Create Railway account
2. Connect GitHub
3. Deploy with one click

### Option 4: VPS (DigitalOcean Droplet, Linode, etc.)

**Pros:**
- Full control
- Cheap ($5-10/month)
- Can run everything on one server

**Cons:**
- Requires more setup
- Need to manage server

## Production Checklist

Before deploying to production:

- [ ] Change default admin password
- [ ] Update JWT_SECRET to a strong random value
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Set up proper CORS configuration
- [ ] Consider using PostgreSQL instead of SQLite for production
- [ ] Set up database backups
- [ ] Configure proper logging
- [ ] Set up monitoring
- [ ] Test all functionality
- [ ] Add rate limiting to API endpoints
- [ ] Set up error tracking (e.g., Sentry)

## Environment Variables for Production

### Backend
```
PORT=5000
JWT_SECRET=<generate-strong-random-secret>
NODE_ENV=production
DATABASE_PATH=./database/skilltree.db
UPLOAD_PATH=./uploads
FRONTEND_URL=https://your-frontend-url.com
```

### Frontend
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

## Database Considerations

For production with 200 users:
- **SQLite** is sufficient for this scale
- Consider **PostgreSQL** if you expect growth beyond 200 users
- Set up regular backups (daily recommended)

### Migrating from SQLite to PostgreSQL

If you decide to use PostgreSQL later:
1. Install `pg` npm package
2. Update database config in `backend/src/config/database.js`
3. Adjust SQL syntax (minor differences)
4. Re-run initialization script

## Scaling Recommendations

For 200 users:
- **Single server is fine** - Backend + Frontend + Database
- **RAM**: 1-2GB sufficient
- **CPU**: 1 vCPU sufficient
- **Storage**: 10-20GB sufficient

## Security Best Practices

1. **Always use HTTPS** in production
2. **Strong JWT secret** (at least 32 random characters)
3. **Rate limiting** on login endpoints
4. **Input validation** (already implemented)
5. **SQL injection protection** (parameterized queries used)
6. **Regular backups** of the database
7. **Keep dependencies updated**

## Monitoring

Consider adding:
- **Uptime monitoring** (UptimeRobot, Pingdom)
- **Error tracking** (Sentry, Rollbar)
- **Analytics** (Google Analytics, Plausible)
- **Log aggregation** (Papertrail, Loggly)

## Backup Strategy

### Database Backups
```bash
# Automated daily backup script
#!/bin/bash
DATE=$(date +%Y-%m-%d)
cp database/skilltree.db backups/skilltree-$DATE.db
```

Set up a cron job to run this daily.

### File Uploads
If implementing file uploads, back up the uploads directory regularly.

## Cost Estimation

For 200 users:
- **Railway/Heroku**: $0-5/month (free tier likely sufficient)
- **DigitalOcean App Platform**: $5/month
- **VPS (Droplet)**: $5-10/month
- **Domain**: $10-15/year
- **Total**: ~$5-15/month

## Performance Optimization

Current setup should handle 200 users easily. If needed:
1. Add Redis for session caching
2. Implement CDN for static assets
3. Enable gzip compression
4. Add database indexing (already in place)
5. Implement lazy loading in frontend

## Troubleshooting Production Issues

### High Memory Usage
- Check for memory leaks
- Restart server periodically
- Increase server RAM

### Slow Database Queries
- Add indexes where needed
- Analyze slow query logs
- Consider read replicas if needed

### API Rate Limiting
- Implement rate limiting middleware
- Use tools like `express-rate-limit`

