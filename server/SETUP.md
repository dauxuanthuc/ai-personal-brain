# Backend Setup Guide

## Requirements
- Node.js 18+
- npm 9+

## Installation
```bash
npm install
cp .env.example .env
```

## Environment Variables
Fill values in .env:
- JWT_SECRET
- GOOGLE_API_KEY
- GROQ_API_KEY
- HF_ACCESS_TOKEN
- DATABASE_URL

## Database
```bash
npx prisma migrate dev
```

## Run
```bash
npm start
# or
npm run dev
```

## API (Quick)
- POST /auth/register
- POST /auth/login
- GET /subjects
- POST /subjects/:id/ask
- POST /documents/upload

## Notes
See SECURITY.md for secrets handling.
