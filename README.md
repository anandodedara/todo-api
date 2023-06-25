
# Demo Project: Todo API

This is a RESTful API for managing a Todo list. It allows users to create, read, update, and delete Todo items. The API is built with NestJS, PostgreSQL, and TypeORM.




## Quick Run

 ```bash
   git clone https://github.com/anandodedara/todo-api.git
   cd todo-api
   cp env-example .env
   docker compose up -d
```

## Environment Variables

To run this project, you will need to configure the following environment variables to your .env file

`DATABASE_HOST`

`DATABASE_USERNAME`

`DATABASE_PASSWORD`

`DATABASE_NAME`

## Run Locally

Clone the project

```bash
  git clone https://github.com/anandodedara/todo-api.git
```

Go to the project directory

```bash
  cd todo-api
```

Install dependencies

```bash
  yarn install
```

Start the server

```bash
  yarn run start:dev
```


## Running Tests

To run tests, run the following command

```bash
  yarn run test:e2e
```

To test with docker

```bash
docker compose -f docker-compose.ci.yaml --env-file env-example -p ci up --build --exit-code-from api && docker compose -p ci rm -svf
```

## Documentation

[http://localhost:3000/docs](http://localhost:3000/docs)


## API Reference

#### Login

```http
  GET /api/v1/auth/email/login
```
#### SignUp

```http
  POST /api/v1/auth/email/register
```

#### Get all todos (with pagination)

```http
  GET /api/v1/todos
```

| Parameter (Query) | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `page` | `Number` | Page Number |
| `limit` | `Number` | Limit records per page |
| `sort` (Optional) | `String` | Ex. title:ASC,createdAt:DESC |
| `search` (Optional) | `String` | Search title and description |

#### Create new Todo Item

```http
  POST /api/v1/todos
```

#### Get Todo Item by Id

```http
  GET /api/v1/todos/:id
```

#### Update a Todo Item by Id

```http
  PATCH /api/v1/todos/:id
```

#### Delete a Todo Item by Id

```http
  DELETE /api/v1/todos/:id
```
## Database Utils

This section provides useful commands and scripts for managing the database in your project.

### Migration

To generate a new migration, use the following command:

```bash
yarn run migration:generate -- src/database/migrations/CreateNameTable
```

This command generates a new migration file in the specified path. Make sure to replace `CreateNameTable` with an appropriate name for your migration.

To run the migrations and update the database schema, use the following command:

```bash
yarn run migration:run
```

This command executes any pending migrations and applies the changes to the database.

To revert the most recent migration, use the following command:

```bash
yarn run migration:revert

```

This command reverts the last migration and rolls back the changes made to the database schema.

### Schema Management

To drop all tables in the database and reset the schema, use the following command:

```bash
yarn run schema:drop
```

This command removes all tables, indexes, and constraints from the database.

### Seed Data

To run the seed script and populate the database with initial data, use the following command:

```bash
yarn run seed:run
```