# PeerTrip Backend Setup

## Quick Start with SQLite (for testing)

If you want to test the app quickly without setting up MySQL:

1. Use the original `server.js` with SQLite
2. Run: `npm start`

## MySQL Setup (for production)

1. Install MySQL on your local machine
2. Create a database named `peertrip_db`
3. Update the `.env` file with your MySQL credentials:
   ```
   DB_PASSWORD=your_mysql_root_password
   ```
4. Run: `node server-mysql.js`

## Environment Variables

Make sure to set these in your `.env` file:

```
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=peertrip_db

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (change this to a random string in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# API Configuration
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `POST /api/ai/chat` - Save chat history
- `GET /api/ai/context` - Get AI context for user
- `PUT /api/preferences` - Update user preferences

## Testing

Use these demo credentials to test the app:
- Email: `demo@peertrip.com`
- Password: `demo123`
