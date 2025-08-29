# Node Backend API

A modern Node.js backend API built with Express.js, MongoDB, and ES6 modules.

## Features

- **ES6 Modules**: Uses modern import/export syntax throughout the codebase
- **User Management**: Complete user authentication and management system
- **Role-based Access**: Admin and Normal user roles
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Input Validation**: Joi and Celebrate for request validation
- **MongoDB Integration**: Mongoose ODM for database operations

## User Roles

The API supports two user roles defined in constants:
- **Admin**: Full access to all operations
- **Normal**: Standard user access

## Project Structure

```
src/
├── config.js              # Configuration settings
├── controllers/            # Request handlers
│   └── users.js           # User-related controllers
├── database/              # Database configuration
│   └── database.js        # MongoDB connection
├── helpers/               # Helper utilities
│   ├── APIResponse.js     # Standardized API responses
│   └── Constant.js        # Application constants (User roles)
├── models/                # Database models
│   └── users.js           # User model with Mongoose
├── routers/               # Route definitions
│   ├── index.js           # Main router setup
│   └── users.js           # User routes
├── utils/                 # Utility functions
│   ├── bcrypt.helper.js   # Password hashing utilities
│   ├── encrypt.helper.js  # Text encryption utilities
│   └── jwt.helper.js      # JWT token utilities
└── index.js               # Application entry point
```

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd node-backend-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Update the database connection string and secret key:
   ```env
   DB_CONNECTION=mongodb://localhost:27017/node-backend-api
   SECRET_KEY=your-secret-key-here
   ```

4. **Start the server**
   ```bash
   # Production
   npm start
   
   # Development (with auto-reload)
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/user/signup` - Register a new user
- `POST /api/user/signin` - User login

### User Management (Protected)
- `GET /api/user/` - Get all users
- `PUT /api/user/` - Update user information
- `DELETE /api/user/:id` - Delete a user
- `POST /api/user/reset_password` - Reset user password

## Request Examples

### User Registration
```json
POST /api/user/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "Normal"
}
```

### User Login
```json
POST /api/user/signin
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Update User
```json
PUT /api/user/
{
  "id": "user_id_here",
  "name": "John Updated",
  "email": "john.updated@example.com",
  "role": "Admin"
}
```

### Reset Password
```json
POST /api/user/reset_password
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow a consistent format:
```json
{
  "data": {},
  "message": "Success message",
  "status": 200,
  "count": 0
}
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Joi/Celebrate** - Input validation
- **CORS** - Cross-origin resource sharing

## Development

The project uses ES6 modules throughout. Key improvements made:

1. **Converted from CommonJS to ES6 modules**
   - All `require()` statements converted to `import`
   - All `module.exports` converted to `export`

2. **Added User Role Constants**
   - Defined Admin and Normal roles in `src/helpers/Constant.js`
   - Integrated role validation in user operations

3. **Enhanced Project Structure**
   - Created proper models directory with User model
   - Organized utilities and helpers
   - Added comprehensive error handling

4. **Modern JavaScript Features**
   - Async/await for database operations
   - ES6 destructuring and arrow functions
   - Template literals for string formatting

## License

ISC