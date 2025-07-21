[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# Backend Example with Moleculer-Web Framework

This is a [Moleculer](https://moleculer.services/)-based microservices project written in TypeScript. It demonstrates a simple monolithic setup (API Gateway + domain services) with:

-   **API Gateway** powered by `moleculer-web`
-   **User** service with JWT authentication, registration, login, password reset flows
-   **Product** service with auto-generated CRUD via a DB mixin
-   **TypeORM** integration for PostgreSQL entities and schema synchronization
-   Environment-based configuration via `.env` (including `DATABASE_URL`, `JWT_SECRET`)

## Features

-   **Authentication & Authorization**  
    JWT-based login, protected routes, password-reset tokens
-   **Automatic CRUD**  
    `products` and any future entities use a reusable mixin for full CRUD actions
-   **Database Schema Management**  
    TypeORM entities in `/src/models`, migrations in `/src/migrations`, plus auto-sync in development

## Usage

1. **Install dependencies**
    ```bash
    npm install
    ```
2. **Configure .env**
    ```dotenv
    DATABASE_URL=postgres://user:pass@localhost:5432/dbname
    JWT_SECRET=your_jwt_secret
    PORT=3000
    ```
3. **Run in development**
    ```bash
    npm run dev
    ```
    The API listens on http://localhost:3000/api.
4. **Test your endpoints with curl:**

    - Register a user

    ```bash
    curl -X POST http://localhost:3000/api/users/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"Secret123"}'
    ```

    - Login and obtain JWT

    ```bash
    curl -X POST http://localhost:3000/api/users/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"Secret123"}'
    ```

    Response:

    ```json
    { "token": "eyJhbGciOiJIUzI1Ni…" }
    ```

    - Create a new product

    ```bash
    curl -X POST http://localhost:3000/api/products \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <YOUR_TOKEN>" \
    -d '{"name":"Sample Item","price":19.99}'
    ```

    - List all product

    ```bash
    curl http://localhost:3000/api/products \
    -H "Authorization: Bearer <YOUR_TOKEN>"
    ```

## Mixins

-   **db.mixin**: Database access mixin for services. Based on [moleculer-db](https://github.com/moleculerjs/moleculer-db#readme)

## Useful links

-   Moleculer website: https://moleculer.services/
-   Moleculer Documentation: https://moleculer.services/docs/0.14/

## NPM scripts

-   `npm run dev`: Start development mode (load all services locally with hot-reload & REPL)
-   `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
-   `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
-   `npm run lint`: Run ESLint
-   `npm run ci`: Run continuous test mode with watching
-   `npm test`: Run tests & generate coverage report
-   `npm run dc:up`: Start the stack with Docker Compose
-   `npm run dc:down`: Stop the stack with Docker Compose
