# Docker Deployment Guide

## Prerequisites

- Docker Engine 20.10 or higher
- Docker Compose 2.0 or higher

## Quick Start

1. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Build and start all services**

   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - MongoDB: mongodb://admin:admin123@localhost:27017

## Environment Configuration

### Required Variables

Edit `.env` file with these values:

```env
# JWT Secret - Generate a strong random string
JWT_SECRET=your-very-secure-random-string-here

# MongoDB (default for Docker setup)
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=change-this-in-production

# Email (for production email notifications)
NODE_ENV=production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM=noreply@yourstore.com

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Gmail Setup

For Gmail SMTP:

1. Enable 2-factor authentication
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `SMTP_PASS`

## Docker Commands

### Start services

```bash
docker-compose up -d
```

### View logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Stop services

```bash
docker-compose down
```

### Stop and remove volumes (deletes all data)

```bash
docker-compose down -v
```

### Rebuild after code changes

```bash
docker-compose build
docker-compose up -d
```

### Execute commands in containers

```bash
# Access backend shell
docker-compose exec backend sh

# Access MongoDB shell
docker-compose exec mongodb mongosh -u admin -p admin123

# Create admin user (from backend)
docker-compose exec backend node make-admin.js
```

## Service Details

### MongoDB (Port 27017)

- Image: mongo:7.0
- Data persisted in: `mongodb_data` volume
- Configuration in: `mongodb_config` volume
- Health check: Automatic with mongosh ping

### Backend (Port 3000)

- Base: Node.js 20 Alpine
- Auto-restart on failure
- Waits for MongoDB health check
- Uploads stored in: `./backend/uploads` (mounted volume)

### Frontend (Port 5173 → 80)

- Multi-stage build: Node.js 20 Alpine + Nginx Alpine
- Production build with optimizations
- SPA routing enabled
- Health endpoint: http://localhost:5173/health

## Health Checks

All services include health checks:

```bash
# Check service status
docker-compose ps

# Expected output shows all services "healthy"
```

## Port Mappings

| Service  | Container Port | Host Port |
| -------- | -------------- | --------- |
| Frontend | 80             | 5173      |
| Backend  | 3000           | 3000      |
| MongoDB  | 27017          | 27017     |

## Data Persistence

Data is persisted across container restarts using Docker volumes:

- `mongodb_data`: Database files
- `mongodb_config`: MongoDB configuration
- `backend_node_modules`: Node modules cache
- `./backend/uploads`: Uploaded files (bind mount)

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs backend

# Rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### MongoDB connection issues

```bash
# Verify MongoDB is healthy
docker-compose ps

# Check MongoDB logs
docker-compose logs mongodb

# Test connection
docker-compose exec mongodb mongosh -u admin -p admin123 --eval "db.adminCommand('ping')"
```

### Frontend shows blank page

```bash
# Check nginx logs
docker-compose logs frontend

# Verify API connection
curl http://localhost:3000
```

### Can't upload files

```bash
# Check uploads directory permissions
ls -la backend/uploads

# Create if missing
mkdir -p backend/uploads/images backend/uploads/documents
```

### Email not sending

- Verify `NODE_ENV=production` in `.env`
- Check SMTP credentials
- Review backend logs: `docker-compose logs backend | grep -i email`

## Production Deployment

### Security Checklist

1. **Change default credentials**

   ```env
   MONGO_ROOT_USERNAME=secure-username
   MONGO_ROOT_PASSWORD=very-secure-password-here
   JWT_SECRET=cryptographically-secure-random-string
   ```

2. **Update CORS settings**

   - Edit `backend/server.js`
   - Change `origin: '*'` to your production domain

3. **Configure HTTPS**

   - Use reverse proxy (nginx/Traefik)
   - Add SSL certificates
   - Update `FRONTEND_URL` to https

4. **Environment variables**

   - Never commit `.env` to version control
   - Use secrets management (Docker Swarm/Kubernetes secrets, AWS Secrets Manager, etc.)

5. **Resource limits**
   - Add memory/CPU limits to docker-compose.yml
   ```yaml
   deploy:
     resources:
       limits:
         cpus: "1"
         memory: 512M
   ```

### Cloud Deployment

**AWS ECS/Fargate:**

1. Push images to ECR
2. Create task definitions
3. Configure load balancer
4. Use RDS or DocumentDB for MongoDB

**Digital Ocean:**

1. Use App Platform or Droplet
2. Docker Compose deployment
3. Managed MongoDB database

**Google Cloud Run:**

1. Build images with Cloud Build
2. Deploy containerized services
3. Use Cloud SQL or MongoDB Atlas

## Development Mode

To run in development mode with hot reload:

1. **Backend:**

   ```bash
   cd backend
   npm install
   npm run dev  # Assumes nodemon script
   ```

2. **Frontend:**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **MongoDB:**
   ```bash
   docker-compose up mongodb -d
   ```

## Backup & Restore

### Backup MongoDB

```bash
docker-compose exec mongodb mongodump \
  -u admin -p admin123 \
  --authenticationDatabase admin \
  --out /tmp/backup

docker cp $(docker-compose ps -q mongodb):/tmp/backup ./backup
```

### Restore MongoDB

```bash
docker cp ./backup $(docker-compose ps -q mongodb):/tmp/restore

docker-compose exec mongodb mongorestore \
  -u admin -p admin123 \
  --authenticationDatabase admin \
  /tmp/restore
```

## Performance Optimization

1. **Enable nginx caching** (already configured in nginx.conf)
2. **Use CDN** for static assets
3. **Database indexing** - Ensure proper indexes on User, Product, Order models
4. **Image optimization** - Compress uploads before storing
5. **Enable gzip** (already enabled in nginx.conf)

## Monitoring

### Basic monitoring

```bash
# Resource usage
docker stats

# Container status
watch -n 1 docker-compose ps
```

### Production monitoring

- Add Prometheus + Grafana
- Use cloud provider monitoring (CloudWatch, Stackdriver)
- Application performance monitoring (New Relic, DataDog)

## Next Steps

1. Test the deployment: `docker-compose up -d`
2. Create an admin user: `docker-compose exec backend node make-admin.js`
3. Seed sample data: `docker-compose exec backend node seed.js`
4. Access the application at http://localhost:5173
5. Review logs for any errors

## Support

For issues:

1. Check logs: `docker-compose logs -f`
2. Verify health: `docker-compose ps`
3. Review environment variables in `.env`
4. Ensure ports 3000, 5173, 27017 are available
