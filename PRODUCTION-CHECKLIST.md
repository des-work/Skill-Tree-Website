# Production Deployment Checklist

## 🚨 CRITICAL - Must Do Before Deployment

### 1. Security Configuration

- [ ] **Generate strong JWT_SECRET**
  ```bash
  # Generate a random secret (Node.js)
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
  Update in `.env`: `JWT_SECRET=<generated-secret>`

- [ ] **Change default admin password**
  1. Login as admin (username: `admin`, password: `admin123`)
  2. Go to Profile → Change Password
  3. Use a strong password (12+ characters, mixed case, numbers, symbols)

- [ ] **Configure CORS for production**
  In `backend/.env`:
  ```
  NODE_ENV=production
  FRONTEND_URL=https://your-actual-frontend-domain.com
  ```

- [ ] **Add .env to .gitignore** (already done ✅)
  Never commit `.env` to git!

### 2. Database Security

- [ ] **Set up database backups**
  ```bash
  # Create backups directory
  mkdir -p backend/backups
  
  # Add to crontab (daily backup at 2 AM)
  0 2 * * * cp /path/to/backend/database/skilltree.db /path/to/backend/backups/skilltree-$(date +\%Y\%m\%d).db
  ```

- [ ] **Test database recovery**
  ```bash
  cp backend/backups/skilltree-20260212.db backend/database/skilltree.db
  ```

### 3. Dependency Security

- [ ] **Update vulnerable frontend packages**
  ```bash
  cd frontend
  npm audit fix
  # If that doesn't work:
  npm update react-scripts --latest
  ```
  
  Note: The vulnerabilities are in dev dependencies (webpack-dev-server, etc.) and don't affect production builds, but should still be addressed.

- [ ] **Check backend dependencies**
  ```bash
  cd backend
  npm audit
  ```

### 4. Environment Configuration

- [ ] **Create production .env file**
  ```env
  PORT=5000
  JWT_SECRET=<your-64-char-random-secret>
  NODE_ENV=production
  DATABASE_PATH=./database/skilltree.db
  UPLOAD_PATH=./uploads
  FRONTEND_URL=https://your-frontend.com
  ```

- [ ] **Configure frontend API URL**
  Create `frontend/.env.production`:
  ```env
  REACT_APP_API_URL=https://your-backend-api.com/api
  ```

### 5. Build for Production

- [ ] **Test production build locally**
  ```bash
  # Frontend
  cd frontend
  npm run build
  npx serve -s build -p 3000
  
  # Backend (already production-ready)
  cd backend
  NODE_ENV=production npm start
  ```

- [ ] **Verify all features work**
  - Login/Registration
  - Dashboard loads
  - Skill trees display
  - Submissions work
  - Admin reviews work

## ⚠️ Important - Should Do

### 6. Add Rate Limiting

Install rate limiter:
```bash
cd backend
npm install express-rate-limit
```

Add to `backend/src/server.js`:
```javascript
const rateLimit = require('express-rate-limit');

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later'
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
```

### 7. Add Logging

Install logger:
```bash
cd backend
npm install morgan winston
```

Add to `backend/src/server.js`:
```javascript
const morgan = require('morgan');
const winston = require('winston');

// Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

app.use(morgan('combined', { stream: { write: message => logger.info(message) }}));
```

### 8. HTTPS Configuration

- [ ] **Obtain SSL certificate**
  - Use Let's Encrypt (free)
  - Or your hosting provider's SSL
  
- [ ] **Enable HTTPS redirect**
  Add to `backend/src/server.js`:
  ```javascript
  if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`);
      } else {
        next();
      }
    });
  }
  ```

### 9. Monitoring Setup

- [ ] **Add uptime monitoring**
  - UptimeRobot (free): https://uptimerobot.com
  - Pingdom
  - StatusCake

- [ ] **Add error tracking**
  ```bash
  cd backend
  npm install @sentry/node
  ```
  
  Add to `backend/src/server.js`:
  ```javascript
  const Sentry = require('@sentry/node');
  
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({ dsn: process.env.SENTRY_DSN });
    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.errorHandler());
  }
  ```

### 10. Performance Optimization

- [ ] **Enable gzip compression**
  ```bash
  cd backend
  npm install compression
  ```
  
  Add to `backend/src/server.js`:
  ```javascript
  const compression = require('compression');
  app.use(compression());
  ```

- [ ] **Add caching headers**
  ```javascript
  app.use('/uploads', express.static(uploadsDir, {
    maxAge: '7d' // Cache uploads for 7 days
  }));
  ```

## 📋 Deployment Platform Setup

### Option A: Railway (Recommended for beginners)

1. Create account at https://railway.app
2. Connect GitHub repository
3. Add environment variables in Railway dashboard
4. Deploy automatically

### Option B: DigitalOcean App Platform

1. Create account at https://digitalocean.com
2. Create new app from GitHub
3. Configure build settings
4. Add environment variables
5. Deploy

### Option C: VPS (Advanced)

1. Set up Ubuntu server
2. Install Node.js, nginx, PM2
3. Clone repository
4. Configure nginx reverse proxy
5. Set up SSL with Let's Encrypt
6. Start with PM2

## 🧪 Pre-Deployment Testing

- [ ] **Test on staging environment**
  - Deploy to staging first
  - Test all features
  - Check error logs
  - Monitor performance

- [ ] **Load testing**
  ```bash
  # Install autocannon
  npm install -g autocannon
  
  # Test API endpoints
  autocannon -c 50 -d 30 https://your-api.com/api/health
  ```

- [ ] **Security scan**
  ```bash
  # Backend
  cd backend
  npm audit
  
  # Frontend
  cd frontend
  npm audit
  ```

## 📊 Post-Deployment Monitoring

### First 24 Hours
- [ ] Check error logs every 2 hours
- [ ] Monitor server resources (CPU, RAM, disk)
- [ ] Test all critical features
- [ ] Monitor uptime

### First Week
- [ ] Daily log reviews
- [ ] User feedback collection
- [ ] Performance monitoring
- [ ] Security audit

### Ongoing
- [ ] Weekly database backups check
- [ ] Monthly dependency updates
- [ ] Quarterly security review
- [ ] Regular performance optimization

## 🚨 Emergency Procedures

### If Site Goes Down
1. Check hosting provider status
2. Review error logs
3. Check server resources
4. Restart services if needed
5. Restore from backup if necessary

### If Database Corrupted
1. Stop backend server
2. Restore from most recent backup
3. Verify data integrity
4. Restart server
5. Monitor closely

### If Security Breach
1. Take site offline immediately
2. Change all passwords and secrets
3. Review logs for breach extent
4. Fix vulnerability
5. Restore from clean backup
6. Notify users if needed

## ✅ Deployment Ready Criteria

Your site is ready to deploy when:
- [x] ~~All critical checklist items completed~~
- [x] ~~Strong JWT secret generated~~
- [x] ~~Default admin password changed~~
- [x] ~~CORS configured for production~~
- [x] ~~Database backup system in place~~
- [x] ~~Production build tested locally~~
- [x] ~~SSL certificate obtained~~
- [x] ~~Monitoring tools configured~~
- [x] ~~Rate limiting added~~
- [x] ~~Error tracking set up~~

## 📝 Final Steps

1. **Deploy to staging** → Test thoroughly
2. **Deploy to production** → Monitor closely
3. **Update DNS** → Point domain to server
4. **Test production** → Verify everything works
5. **Monitor logs** → Watch for issues
6. **Celebrate!** 🎉

---

**Remember:** It's better to deploy slowly and carefully than to rush and have security issues!
