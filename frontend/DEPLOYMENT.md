# Environment Configuration Guide

## Frontend Environment Variables

### Required Environment Variables

Create a `.env.local` file in the frontend directory with the following variables:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Optional: Custom App Settings
NEXT_PUBLIC_APP_NAME="Survey App"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

### Environment Files

- **`.env.local`** - Local development (ignored by Git)
- **`.env.development`** - Development environment defaults
- **`.env.production`** - Production environment defaults
- **`.env.test`** - Test environment (for future testing setup)

### Development Setup

1. **Local Development**:
   ```bash
   # Frontend (port 3000)
   cd frontend
   npm install
   npm run dev
   
   # Backend (port 3001)
   cd backend
   npm install
   npm run dev
   ```

2. **Environment Variables**:
   ```bash
   # frontend/.env.local
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

### Production Configuration

#### **Vercel Deployment** (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variables** in Vercel Dashboard:
   - `NEXT_PUBLIC_API_URL` → Your backend API URL

#### **Manual Production Build**

1. **Build the Application**:
   ```bash
   cd frontend
   npm run build
   npm start
   ```

2. **Environment Variables**:
   ```bash
   # frontend/.env.production
   NEXT_PUBLIC_API_URL=https://your-api-domain.com
   ```

### Backend Integration

Ensure your backend is configured with:

```bash
# backend/.env
PORT=3001
DATABASE_URL=postgresql://username:password@localhost:5432/survey_app
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:3000
```

### Security Considerations

1. **Never commit sensitive data** to version control
2. **Use environment variables** for all configuration
3. **Validate environment variables** at application startup
4. **Use HTTPS** in production
5. **Set proper CORS origins** for your backend

### Docker Configuration (Optional)

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Environment Validation

Add this to your app startup to validate required environment variables:

```typescript
// frontend/src/lib/env.ts
const requiredEnvVars = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
};

export function validateEnvironment() {
  const missing = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
```

### Troubleshooting

1. **API Connection Issues**:
   - Check `NEXT_PUBLIC_API_URL` is correct
   - Verify backend is running
   - Check CORS configuration

2. **Build Failures**:
   - Ensure all dependencies are installed
   - Check TypeScript errors
   - Verify environment variables are set

3. **Runtime Errors**:
   - Check browser console for errors
   - Verify API endpoints are accessible
   - Check network tab for failed requests