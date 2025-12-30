# Quiz API

## Assignment

The assignment is to build a light weight restful API server to power a quiz UI.

## Implementation Details

### Features Implemented

✅ **Core Requirements:**

- Quiz resource with title, description, and candidate instructions
- Question resource supporting both free-text and multiple-choice questions
- Full CRUD operations for both resources
- MongoDB for data persistence (Docker or Atlas)
- OpenAPI v3 specification with interactive Swagger UI
- JSON:API compliant responses

✅ **Additional Features:**

- Many-to-many relationship between quizzes and questions
- Questions can belong to multiple quizzes
- Relationship endpoints for fetching quiz questions
- Environment variable configuration for security
- Cascade cleanup when quizzes are deleted
- **Quiz play functionality** - Start a quiz, answer questions, get scored
- **Configurable scoring** - Set custom points per question at the quiz level
- **Dockerized application** - Full Docker Compose setup with MongoDB and Express
- **Swagger UI documentation** - Interactive API docs at `/api-docs`

## Instructions to Run

### Prerequisites

- Node.js (v18 or higher)
- npm
- **Option A:** Docker and Docker Compose (recommended for local development)
  - Verify installation: `docker --version` and `docker-compose --version`
  - [Install Docker Desktop](https://www.docker.com/products/docker-desktop/) if not installed
- **Option B:** MongoDB Atlas account

### Option A: Setup with Docker (Recommended)

This is the easiest way to get started - it includes both MongoDB and the Express app in containers.

1. **Start all services with Docker Compose**

   ```bash
   docker-compose up -d && docker-compose logs test
   ```

   This will:

   - Start MongoDB container on port 27017
   - Run the test suite against MongoDB (shown in logs)
   - Start Express API container on port 3001 (only after tests pass)

2. **Access the API**

   - API Server: <http://localhost:3001>
   - Swagger UI Documentation: <http://localhost:3001/api-docs>

3. **View logs** (optional)

   ```bash
   # All services
   docker-compose logs -f

   # Just the app
   docker-compose logs -f app

   # Just MongoDB
   docker-compose logs -f mongodb
   ```

4. **Stop all services** (when finished)

   ```bash
   docker-compose down
   ```

   To stop and remove all data:

   ```bash
   docker-compose down -v
   ```

#### Customizing Docker Credentials

You can customize the MongoDB credentials by creating a `.env` file:

1. Copy the example file:

   ```bash
   cp .env.docker.example .env
   ```

2. Edit `.env` and change the values:

   ```env
   MONGO_ROOT_USER=your_admin_user
   MONGO_ROOT_PASSWORD=your_admin_password
   MONGO_DATABASE=your_database_name
   MONGO_APP_USER=your_app_user
   MONGO_APP_PASSWORD=your_app_password
   ```

3. Restart the services:

   ```bash
   docker-compose down -v  # Remove old data
   docker-compose up -d
   ```

**Default credentials** (if no `.env` file is provided):

- Admin user: `admin` / `adminpassword`
- App user: `quiz_user` / `quiz_password`
- Database: `quiz-api`

#### Using MongoDB Compass

You can use [MongoDB Compass](https://www.mongodb.com/products/compass) to visually explore and manage the database:

1. **Download and install MongoDB Compass** (if you haven't already)

2. **Connect to the Docker MongoDB instance**

   Use this connection string:

   ```
   mongodb://quiz_user:quiz_password@localhost:27017/quiz-api?authSource=quiz-api
   ```

   Or if you customized credentials in your `.env` file:

   ```
   mongodb://<MONGO_APP_USER>:<MONGO_APP_PASSWORD>@localhost:27017/<MONGO_DATABASE>?authSource=<MONGO_DATABASE>
   ```

3. **Browse collections**

   Once connected, you can:

   - View all quizzes and questions
   - Execute queries and aggregations
   - Analyze indexes and performance
   - Export/import data

#### Docker Troubleshooting

**App fails to connect to MongoDB:**

- Check MongoDB is healthy: `docker-compose ps`
- Check logs: `docker-compose logs mongodb`
- Ensure MongoDB has finished initializing

**Port already in use:**

- Change the port mapping in `docker-compose.yml`:

  ```yaml
  ports:
    - "3001:3000" # Use port 3001 on host
  ```

**Rebuild after code changes:**

```bash
docker-compose up -d --build app
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
   - API Server: http://localhost:3001
   - Swagger UI Documentation: http://localhost:3001/api-docs

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

**Quiz Attempts (Play a Quiz):**

- `POST /quizzes/:quizId/play` - Start a quiz attempt (returns questions to answer)
- `POST /quiz-attempts/:attemptId/answers` - Submit an answer for a question
- `POST /quiz-attempts/:attemptId/complete` - Complete the quiz and get final score
- `GET /quiz-attempts/:attemptId` - Get attempt details with all answers
- `GET /quizzes/:quizId/attempts` - Get all completed attempts for a quiz

### Example Usage

Create a quiz:

```bash
curl -X POST http://localhost:3001/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "JavaScript Basics",
    "description": "Test your knowledge of JavaScript fundamentals",
    "instructions": "Answer all questions. You have 30 minutes.",
    "pointsPerQuestion": 10
  }'
```

Create a multiple-choice question:

```bash
curl -X POST http://localhost:3001/questions \
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

Play a quiz:

```bash
# 1. Start a quiz attempt
curl -X POST http://localhost:3001/quizzes/<quiz-id>/play

# 2. Submit an answer
curl -X POST http://localhost:3001/quiz-attempts/<attempt-id>/answers \
  -H "Content-Type: application/json" \
  -d '{
    "questionId": "<question-id>",
    "answer": "A function with access to outer scope"
  }'

# 3. Complete the quiz and get your score
curl -X POST http://localhost:3001/quiz-attempts/<attempt-id>/complete
```

## Demo Data for Testing

Below is sample data you can use to quickly test the API. Copy and paste these JSON payloads into Swagger UI or use the curl commands.

### 1. Create a Quiz

```json
{
  "title": "Web Development Fundamentals",
  "description": "Test your knowledge of HTML, CSS, and JavaScript basics",
  "instructions": "Answer all questions carefully. Multiple-choice questions have only one correct answer. For free-text questions, provide a clear and concise answer.",
  "pointsPerQuestion": 10
}
```

> **Note:** `pointsPerQuestion` is optional and defaults to 10 if not specified.

### 2. Create Questions

After creating the quiz, copy the returned `id` and use it in the `quizIds` array below.

**Multiple-Choice Question 1 (HTML):**

```json
{
  "quizIds": ["<paste-quiz-id-here>"],
  "text": "What does HTML stand for?",
  "type": "multiple-choice",
  "choices": [
    { "text": "Hyper Text Markup Language", "isCorrect": true },
    { "text": "High Tech Modern Language", "isCorrect": false },
    { "text": "Home Tool Markup Language", "isCorrect": false },
    { "text": "Hyperlinks and Text Markup Language", "isCorrect": false }
  ]
}
```

**Multiple-Choice Question 2 (CSS):**

```json
{
  "quizIds": ["<paste-quiz-id-here>"],
  "text": "Which CSS property is used to change the text color of an element?",
  "type": "multiple-choice",
  "choices": [
    { "text": "font-color", "isCorrect": false },
    { "text": "text-color", "isCorrect": false },
    { "text": "color", "isCorrect": true },
    { "text": "foreground-color", "isCorrect": false }
  ]
}
```

**Free-Text Question 3 (JavaScript):**

```json
{
  "quizIds": ["<paste-quiz-id-here>"],
  "text": "What is a closure in JavaScript?",
  "type": "free-text",
  "correctAnswer": "A closure is a function that has access to variables from its outer (enclosing) scope, even after the outer function has returned."
}
```

**Multiple-Choice Question 4 (JavaScript):**

```json
{
  "quizIds": ["<paste-quiz-id-here>"],
  "text": "Which of the following is NOT a JavaScript data type?",
  "type": "multiple-choice",
  "choices": [
    { "text": "String", "isCorrect": false },
    { "text": "Boolean", "isCorrect": false },
    { "text": "Float", "isCorrect": true },
    { "text": "Symbol", "isCorrect": false }
  ]
}
```

**Free-Text Question 5 (JavaScript):**

```json
{
  "quizIds": ["<paste-quiz-id-here>"],
  "text": "Explain the difference between let, const, and var in JavaScript.",
  "type": "free-text",
  "correctAnswer": "var is function-scoped and can be redeclared. let is block-scoped and can be reassigned but not redeclared. const is block-scoped and cannot be reassigned or redeclared."
}
```

### 3. Play the Quiz

**Start a quiz attempt:**

```bash
POST /quizzes/<quiz-id>/play
```

**Submit answers** (use question IDs from the play response):

```json
{
  "questionId": "<question-id>",
  "answer": "Hyper Text Markup Language"
}
```

**Complete the quiz:**

```bash
POST /quiz-attempts/<attempt-id>/complete
```

### 4. Expected Results

After completing a quiz with a mix of correct/wrong answers, you'll see:

```json
{
  "data": {
    "type": "quiz-attempts",
    "id": "<attempt-id>",
    "attributes": {
      "status": "completed",
      "score": 20,
      "totalAnswers": 5,
      "correctAnswers": 2,
      "accuracy": 40
    }
  }
}
```

| Answer Result                       | Points                             |
| ----------------------------------- | ---------------------------------- |
| ✅ Correct (multiple-choice)        | +`pointsPerQuestion` (default: 10) |
| ❌ Wrong                            | 0                                  |
| ✅ Correct (free-text, exact match) | +`pointsPerQuestion` (default: 10) |

> **Note:** The `pointsPerQuestion` value is set when creating the quiz. Free-text questions require exact string matching. Consider this a future enhancement opportunity for fuzzy matching or AI-powered grading.

## Time Spent

**Total: ~3 hours**

- Project setup and MongoDB integration: 30 minutes
- CRUD operations implementation: 45 minutes
- JSON:API compliance and error handling: 20 minutes
- Swagger/OpenAPI documentation: 20 minutes
- Relationship endpoints and many-to-many support: 20 minutes
- Environment variables and MongoDB Atlas setup: 10 minutes
- Docker Compose setup with full containerization: 20 minutes
- Documentation updates (README and Docker guide): 10 minutes
- Jest testing setup and comprehensive integration tests: 25 minutes

## Trade-offs Made

Due to the 3-hour time constraint, the following trade-offs were made:

1. **Authentication/Authorization** - Not implemented. All endpoints are publicly accessible.

   - Would add: JWT-based authentication, role-based access control

2. **Input Validation** - Basic validation exists but could be more comprehensive.

   - Would add: joi or zod for schema validation, detailed error messages

3. **Testing** - ✅ **Comprehensive integration tests implemented**

   - Implemented: Complete integration test suite with Jest and Supertest covering:
     - Quiz and Question CRUD operations
     - Many-to-many relationships between quizzes and questions
     - JSON:API compliance verification
     - Cascade deletion behavior
     - Custom points per question scoring
     - Quiz attempt flow (start, answer, complete)
     - Edge cases (2 quizzes, 5 questions each, 5 shared questions)
   - **34 integration tests** all passing
   - Would add: More granular unit tests for controllers and models, edge case testing, error scenario testing

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

### Answer Grading Improvements

- **Fuzzy matching** for free-text answers (e.g., using Levenshtein distance or cosine similarity)
- **AI-powered grading** using LLMs to evaluate semantic correctness of free-text responses
- **Partial credit** scoring for partially correct answers
- **Case-insensitive matching** and trimming of whitespace
- **Synonym recognition** for accepting alternative correct answers
- **Configurable grading modes** per question (strict, lenient, AI-assisted)

### Scoring Enhancements

- ✅ **Quiz-level point values** - Implemented! Set `pointsPerQuestion` when creating a quiz
- **Per-question point values** - Allow each question to have its own point value instead of using the quiz-level default
- **Weighted scoring** - Different question types could have different weights
- **Negative marking** - Optional penalty for incorrect answers
- **Bonus points** - Time-based bonuses for quick correct answers
- **Score normalization** - Percentage-based scoring alongside absolute points

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
- **Containerization:** Docker & Docker Compose
- **Documentation:** Swagger UI with OpenAPI 3.0
- **Testing:** Jest with Supertest
- **Environment:** dotenv for configuration

## Project Structure

```text
├── Dockerfile               # Node.js container image definition
├── docker-compose.yml       # Multi-container orchestration (MongoDB, app, tests)
├── package.json             # Dependencies and npm scripts
├── tsconfig.json            # TypeScript compiler configuration
├── jest.config.cjs          # Jest test runner configuration
├── mongo-init/              # MongoDB initialization scripts for Docker
├── scripts/                 # Utility scripts (wait-for-it, etc.)
└── src/
    ├── index.ts             # Application entry point, Express server setup
    ├── config/
    │   ├── database.ts      # MongoDB/Mongoose connection setup
    │   └── swagger.ts       # OpenAPI 3.0 specification and Swagger UI config
    ├── controllers/
    │   ├── quiz-controller.ts          # Quiz CRUD operations handler
    │   ├── question-controller.ts      # Question CRUD operations handler
    │   └── quiz-attempt-controller.ts  # Quiz play, answers, scoring logic
    ├── models/
    │   ├── quiz-model.ts               # Quiz Mongoose schema and model
    │   ├── question-model.ts           # Question schema (supports many-to-many)
    │   └── quiz-attempt-model.ts       # Quiz attempt tracking and answers
    ├── routes/
    │   ├── quiz-routes.ts              # Quiz API endpoint definitions
    │   ├── question-routes.ts          # Question API endpoint definitions
    │   └── quiz-attempt-routes.ts      # Quiz play/attempt API endpoints
    └── __tests__/
        ├── api.test.ts      # Comprehensive integration tests (34 tests)
        └── setup.ts         # Test environment and database setup
```
