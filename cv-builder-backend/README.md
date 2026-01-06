# CV Builder Backend

Backend API for CV Builder application built with Node.js, Express, TypeScript, and MongoDB.

## Features

- ✅ User Authentication (JWT, OAuth ready)
- ✅ User Management
- ✅ CV CRUD Operations
- ✅ Template/Layout Management
- ✅ PDF Generation (Async Jobs)
- ✅ Payment Integration (Stripe ready)
- ✅ Share Links & Email Sharing
- ✅ Swagger/OpenAPI Documentation
- ✅ Strong Validation & Security
- ✅ Rate Limiting
- ✅ Error Handling

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (Access + Refresh Tokens)
- **Validation**: Joi
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, Rate Limiting, Input Sanitization

## Project Structure

```
src/
├── config/          # Configuration files (database, swagger)
├── controllers/     # Request handlers
├── services/        # Business logic
├── repositories/    # Data access layer
├── models/          # MongoDB schemas
├── middleware/      # Express middleware (auth, validation, errors)
├── routes/          # API routes
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
├── validators/       # Joi validation schemas
└── index.ts         # Application entry point
```

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/cv-builder
   JWT_SECRET=your-super-secret-jwt-key
   JWT_ACCESS_EXPIRY=15m
   JWT_REFRESH_EXPIRY=30d
   FRONTEND_URL=http://localhost:3001
   ```
   
   **Note:** Node.js 24+ has native support for `.env` files. The `start` script uses `--env-file=.env` flag automatically.

3. **Start MongoDB**
   Make sure MongoDB is running on your system.

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   For development, environment variables are loaded automatically from `.env` file.

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```
   The `start` script automatically loads `.env` file using Node.js 24's native `--env-file` flag.

## API Documentation

Once the server is running, access Swagger documentation at:
- **Swagger UI**: http://localhost:3000/api-docs

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/oauth/:provider` - OAuth login (Google/Facebook)

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `POST /api/users/me/avatar/presign` - Get presigned URL for avatar upload

### Templates
- `GET /api/templates` - Get all public templates
- `GET /api/templates/:id` - Get template by ID

### CVs
- `GET /api/cvs` - Get user's CVs (pagination)
- `POST /api/cvs` - Create new CV
- `GET /api/cvs/:id` - Get CV by ID
- `PUT /api/cvs/:id` - Update CV
- `PATCH /api/cvs/:id/autosave` - Autosave CV
- `DELETE /api/cvs/:id` - Delete CV
- `POST /api/cvs/:id/duplicate` - Duplicate CV
- `POST /api/cvs/:id/share` - Create share link
- `POST /api/cvs/:id/email` - Send CV via email

### PDF Generation
- `POST /api/cvs/:id/generate-pdf` - Generate PDF (requires payment)
- `GET /api/pdf-jobs/:jobId` - Get PDF job status

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `GET /api/payments/history` - Get payment history
- `POST /api/payments/webhook` - Payment webhook (Stripe)

### Sharing
- `GET /api/share/:token` - Get CV by share token (public)

## Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcrypt (12 rounds)
- Input validation and sanitization
- Rate limiting on sensitive endpoints
- CORS protection
- Helmet security headers
- MongoDB injection prevention

## Validation

All endpoints use Joi validation schemas:
- Strong password requirements (min 8 chars, uppercase, lowercase, number, special char)
- Email format validation
- Input sanitization to prevent NoSQL injection

## Error Handling

Consistent error response format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {}
  }
}
```

## Notes

- **No Admin Panel**: All users have equal access. Everyone is an admin.
- **Local Development Only**: No deployment configuration included.
- **OAuth**: Google/Facebook OAuth is set up but needs provider credentials.
- **Payments**: Stripe integration is ready but needs API keys.
- **PDF Generation**: Async job system is ready but needs worker implementation.

## License

ISC

