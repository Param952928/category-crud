# Anglara Category API

Minimal Express + TypeScript API for authentication and hierarchical category CRUD, backed by MongoDB (Mongoose). Includes a Jest test suite that uses mongodb-memory-server.

## Tech Stack
- Node.js + Express
- TypeScript (ESM)
- Mongoose (MongoDB)
- JWT auth
- Jest + Supertest

## Prerequisites
- Node.js 18+ and npm
- MongoDB (for local dev/prod) or any reachable Mongo URI

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables:
   - Copy `.env.example` to `.env` and adjust as needed.
   ```bash
   cp .env.example .env
   ```
   - Important:
     - `PORT` – server port (default 4000)
     - `MONGO_URI` – Mongo connection string
     - `JWT_SECRET` – JWT signing key
     - `JWT_EXPIRES_IN` – token lifetime (e.g. 1d)

## Development
Start the API with hot reload:
```bash
npm run dev
```
The server reads `.env` and listens on `PORT`.

## Testing
Run the full Jest suite (serial to avoid DB port conflicts):
```bash
npm test
```
Watch mode:
```bash
npm run test:watch
```

## Build
Emit compiled JavaScript to `dist/`:
```bash
npm run build
```

## Start (production)
Run the compiled server from `dist/`:
```bash
npm start
```

## Available npm scripts
- `dev` – tsx watch on `src/server.ts`
- `build` – TypeScript build to `dist/`
- `start` – run `dist/server.js`
- `test` – run Jest once (uses `jest.config.cjs`)
- `test:watch` – run Jest in watch mode

## Notes
- Tests use an in-memory MongoDB; no external DB is required for tests.
- The Express app is exported from `src/app.ts` and the HTTP server starts in `src/server.ts`.

## API Reference

Base URL: `http://localhost:<PORT>` (default `4000`)

- **Content-Type**: `application/json`
- **Auth**: Bearer token for protected routes. Header `Authorization: Bearer <token>`.
- **Response envelope**:
  - Success: `{ status: true, message: string, data?: any }`
  - Error: `{ status: false, message: string, details?: any }`

### Auth

- POST `/api/auth/register`
  - Body:
    ```json
    { "email": "user@example.com", "password": "Passw0rd!" }
    ```
  - Responses:
    - 201 Created:
      ```json
      { "status": true, "message": "Registered successfully", "data": { "token": "<jwt>" } }
      ```
    - 409 Conflict (email exists), 400 Validation error

- POST `/api/auth/login`
  - Body:
    ```json
    { "email": "user@example.com", "password": "Passw0rd!" }
    ```
  - Responses:
    - 200 OK:
      ```json
      { "status": true, "message": "Login successful", "data": { "token": "<jwt>" } }
      ```
    - 401 Invalid credentials, 400 Validation error

### Category (protected)

All endpoints require header `Authorization: Bearer <token>`.

- POST `/api/category`
  - Body:
    ```json
    { "name": "Electronics", "parentId": null, "status": "active" }
    ```
    - `parentId` optional (24-hex string or null)
    - `status` optional: `active` | `inactive`
  - Responses:
    - 201 Created:
      ```json
      {
        "status": true,
        "message": "Category created",
        "data": {
          "_id": "<id>",
          "name": "Electronics",
          "parent": null,
          "status": "active",
          "ancestors": [],
          "createdAt": "...",
          "updatedAt": "..."
        }
      }
      ```
    - 400 Validation error

- GET `/api/category`
  - Response 200 OK:
    ```json
    {
      "status": true,
      "message": "Categories fetched",
      "data": [
        {
          "_id": "<id>",
          "name": "Electronics",
          "parent": null,
          "status": "active",
          "ancestors": [],
          "children": [
            { "_id": "<id>", "name": "Mobiles", "parent": "<id>", "status": "active", "ancestors": ["<id>"] }
          ]
        }
      ]
    }
    ```

- PUT `/api/category/:id`
  - Params: `id` (24-hex string)
  - Body (at least one):
    ```json
    { "name": "New name", "status": "inactive" }
    ```
  - Response 200 OK:
    ```json
    { "status": true, "message": "Category updated", "data": { /* updated category */ } }
    ```

- DELETE `/api/category/:id`
  - Params: `id` (24-hex string)
  - Response 200 OK:
    ```json
    { "status": true, "message": "Category deleted", "data": {} }
    ```

### Health

- GET `/health`
  - Response 200 OK:
    ```json
    { "ok": true }
    ```
