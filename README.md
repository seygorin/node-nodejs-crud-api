# Node.js CRUD API

This project is a simple CRUD (Create, Read, Update, Delete) API built with Node.js, utilizing an in-memory database for user management. It supports both single-instance and multi-instance modes.

## Features

- RESTful API endpoints for user management
- In-memory database
- UUID-based user identification
- Error handling and validation
- Environment variable configuration
- Development and production modes
- Multi-instance support
- Test coverage for API endpoints

## API Endpoints

### GET /api/users

- Retrieves all users
- Response: 200 OK with an array of user records

### GET /api/users/{userId}

- Retrieves a specific user by ID
- Response:
  - 200 OK with user record
  - 400 Bad Request if userId is invalid
  - 404 Not Found if user doesn't exist

### POST /api/users

- Creates a new user
- Request body: { username: string, age: number, hobbies: string[] }
- Response:
  - 201 Created with the newly created user record
  - 400 Bad Request if required fields are missing

### PUT /api/users/{userId}

- Updates an existing user
- Request body: { username?: string, age?: number, hobbies?: string[] }
- Response:
  - 200 OK with updated user record
  - 400 Bad Request if userId is invalid
  - 404 Not Found if user doesn't exist

### DELETE /api/users/{userId}

- Deletes an existing user
- Response:
  - 204 No Content on successful deletion
  - 400 Bad Request if userId is invalid
  - 404 Not Found if user doesn't exist

## User Object Structure

```typescript
{
	id: string; // UUID, generated server-side
	username: string; // required
	age: number; // required
	hobbies: string[]; // required, can be an empty array
}
```

## Error Handling

- Non-existing endpoints return 404 Not Found with a friendly message
- Server-side errors return 500 Internal Server Error with a friendly message

## Configuration

- Port configuration is stored in a `.env` file

## Running the Application

### Development Mode

```bash
npm run start:dev
```

Runs the application using `nodemon` for auto-reloading on file changes.

### Production Mode

```bash
npm run start:prod
```

Runs the application in production mode.

Builds the application and runs the bundled file.

### Multi-Instance Mode

```bash
npm run start:multi
```

Starts multiple instances of the application using Node.js Cluster API.

## Testing

Run the test suite with:

```bash
npm run test
```

## Multi-Instance Mode Details

In multi-instance mode:

- The load balancer listens on `localhost:4000/api`
- Worker instances listen on `localhost:4001/api`, `localhost:4002/api`, etc.

## Project Structure

- `src/`: Source code directory
  - `controllers/`: Request handlers
  - `models/`: Data models and database operations
  - `utils/`: Utility functions
- `__tests__/`: Test files
- `index.ts`: Application entry point
- `webpack.config.js`: Webpack configuration for production build
- `tsconfig.json`: TypeScript configuration
- `package.json`: Project dependencies and scripts

## Technologies Used

- Node.js
- TypeScript
- UUID for unique identifiers
- Jest for testing
- Webpack for bundling
- Nodemon for development
