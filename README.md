# Quiz API

## Assignment

The assignment is to build a light weight restful API server to power a quiz UI.

## Functional requirements

- Implement 2 API resources
  - A Quiz resource, providing at a minimum a title, description and candidate instructions.
  - A Question resource. This should support both free text and multiple choice questions.
  - Any additional resources you feel are necessary for a functional client experience.
- The API should follow the [OpenAPI v3](https://swagger.io/specification/) and [JSON:API](https://jsonapi.org/) Specifications.
- Provide implementations for CRUD operations for all resources.
- The server should persist data records to a NoSQL database.

## Tech stack

Your solution should be written in typescript. Preferably use an express powered server to host the API.

Feel free to use whatever tools you’re comfortable with (IDE, workflow, AI assistants/LLMs), just as you would in your normal day-to-day work.

This repository has already been bootstrapped to provide the basic project structure, extend it as you need.

## Timebox

You should aim to spend no more than 3 hours. If you don’t finish everything, that’s fine. We’ll talk about trade-offs during the interview.

## Submission

Send a link to the repo, which should contain a short README.md with:

- Instructions to run
- Time spent
- Any trade-offs made and what you would improve with more time

If you choose to use this repository as your base, please do not create a public fork.

## Using this repo

This repository provides a basic application containing an express server with stubbed routes for quiz and question.

To run:

```
npm install
npm run build
npm run start
```

To run in debug:

```
npm install
npm run debug
```

---

## Implementation Details

### Features Implemented

✅ **Core Requirements:**

- Quiz resource with title, description, and candidate instructions
- Question resource supporting both free-text and multiple-choice questions
- Full CRUD operations for both resources
- MongoDB Atlas for data persistence
- OpenAPI v3 specification with interactive Swagger UI
- JSON:API compliant responses

✅ **Additional Features:**

- Many-to-many relationship between quizzes and questions
- Questions can belong to multiple quizzes
- Relationship endpoints for fetching quiz questions
- Environment variable configuration for security
- Cascade cleanup when quizzes are deleted

## Instructions to Run

### Prerequisites

- Node.js (v18 or higher)
- npm
- **Option A:** Docker and Docker Compose (recommended for local development)
- **Option B:** MongoDB Atlas account

### Option A: Setup with Docker (Recommended)

This is the easiest way to get started as it includes a local MongoDB instance.

1. **Start MongoDB with Docker Compose**

   ```bash
   docker-compose up -d
   ```

   This will start a MongoDB container on port 27017.

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables for local Docker**

   Create a `.env` file:

   ```bash
   cp .env.local.example .env
   ```

   The default `.env.local.example` is already configured for Docker:
   ```env
   MONGODB_URI=mongodb://quiz_user:quiz_password@localhost:27017/quiz-api?authSource=quiz-api
   PORT=3000
   ```

4. **Build and start the application**

   ```bash
   npm run build
   npm run start
   ```

   Or for development mode:
   ```bash
   npm run debug
   ```

5. **Access the API**
   - API Server: <http://localhost:3000>
   - Swagger UI Documentation: <http://localhost:3000/api-docs>

6. **Stop the MongoDB container** (when finished)

   ```bash
   docker-compose down
   ```

   To stop and remove all data:
   ```bash
   docker-compose down -v
   ```

### Option B: Setup with MongoDB Atlas

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Create a `.env` file in the root directory (use `.env.example` as a template):

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your MongoDB connection string:

   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/quiz-api
   PORT=3000
   ```

3. **Build the project**

   ```bash
   npm run build
   ```

4. **Start the server**

   For production:

   ```bash
   npm run start
   ```

   For development (with hot reload and debugging):

   ```bash
   npm run debug
   ```

5. **Access the API**
   - API Server: http://localhost:3000
   - Swagger UI Documentation: http://localhost:3000/api-docs

### API Endpoints

**Quizzes:**

- `POST /quizzes` - Create a new quiz
- `GET /quizzes` - Get all quizzes
- `GET /quizzes/:id` - Get a quiz by ID
- `GET /quizzes/:id?include=questions` - Get quiz with related questions (JSON:API format)
- `GET /quizzes/:id/questions` - Get all questions for a specific quiz
- `PATCH /quizzes/:id` - Update a quiz
- `DELETE /quizzes/:id` - Delete a quiz

**Questions:**

- `POST /questions` - Create a new question
- `GET /questions` - Get all questions
- `GET /questions?quizId=<id>` - Filter questions by quiz ID
- `GET /questions/:id` - Get a question by ID
- `PATCH /questions/:id` - Update a question
- `DELETE /questions/:id` - Delete a question

### Example Usage

Create a quiz:

```bash
curl -X POST http://localhost:3000/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "JavaScript Basics",
    "description": "Test your knowledge of JavaScript fundamentals",
    "instructions": "Answer all questions. You have 30 minutes."
  }'
```

Create a multiple-choice question:

```bash
curl -X POST http://localhost:3000/questions \
  -H "Content-Type: application/json" \
  -d '{
    "quizIds": ["<quiz-id>"],
    "text": "What is a closure in JavaScript?",
    "type": "multiple-choice",
    "choices": [
      {"text": "A function with access to outer scope", "isCorrect": true},
      {"text": "A loop construct", "isCorrect": false}
    ]
  }'
```

## Time Spent

**Total: ~3 hours**

- Project setup and MongoDB integration: 45 minutes
- CRUD operations implementation: 60 minutes
- JSON:API compliance and error handling: 30 minutes
- Swagger/OpenAPI documentation: 30 minutes
- Relationship endpoints and many-to-many support: 30 minutes
- Environment variables and MongoDB Atlas setup: 15 minutes

## Trade-offs Made

Due to the 3-hour time constraint, the following trade-offs were made:

1. **Authentication/Authorization** - Not implemented. All endpoints are publicly accessible.

   - Would add: JWT-based authentication, role-based access control

2. **Input Validation** - Basic validation exists but could be more comprehensive.

   - Would add: joi or zod for schema validation, detailed error messages

3. **Testing** - No unit or integration tests implemented.

   - Would add: Jest for unit tests, Supertest for API integration tests

4. **Pagination** - GET endpoints return all records without pagination.

   - Would add: Cursor-based or offset pagination with metadata

5. **Error Handling** - Basic error handling exists but could be more granular.
   - Would add: Custom error classes, detailed error codes, structured logging

## What I Would Improve With More Time

### Data Validation & Constraints

- Add mongoose validators for better data integrity
- Validate quiz IDs exist when creating/updating questions
- Add unique constraints where appropriate

### API Enhancements

- Add filtering, sorting, and search capabilities
- Implement sparse fieldsets (JSON:API feature)
- Add bulk operations (create/update multiple resources)
- Add question ordering within quizzes
- API versioning strategy

### Performance

- Add database indexing for commonly queried fields
- Implement caching (Redis) for frequently accessed data
- Add request rate limiting
- Connection pooling optimization

### Developer Experience

- Add database seeding scripts for local development
- Add Docker and docker-compose for easy setup
- Add pre-commit hooks (husky) for linting and formatting
- Add CI/CD pipeline (GitHub Actions)
- Add ESLint and Prettier configuration

### Additional Features

- Quiz attempts/submissions tracking
- Question randomization
- Time limits for quizzes
- Question categories/tags
- Question difficulty levels
- Analytics and reporting dashboard
- Quiz versioning

### Code Quality

- Add comprehensive logging (Winston or Pino)
- Add monitoring and health check endpoints
- Implement repository pattern for better separation of concerns
- Add request/response DTOs for better type safety
- Add API documentation with more examples

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose ODM)
- **Documentation:** Swagger UI with OpenAPI 3.0
- **Environment:** dotenv for configuration

## Project Structure

```
src/
├── config/
│   ├── database.ts      # MongoDB connection setup
│   └── swagger.ts       # OpenAPI/Swagger configuration
├── controllers/
│   ├── quiz-controller.ts
│   └── question-controller.ts
├── models/
│   ├── quiz-model.ts
│   └── question-model.ts
├── routes/
│   ├── quiz-routes.ts
│   └── question-routes.ts
└── index.ts             # Application entry point
```
