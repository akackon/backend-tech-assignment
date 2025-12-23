# Quiz API# Quiz API# Quiz API



A RESTful API server for managing quizzes and questions, built with Express, TypeScript, and MongoDB.



## Features ImplementedA RESTful API server for managing quizzes and questions, built with Express, TypeScript, and MongoDB.## Assignment



✅ **Core Requirements:**

- Quiz resource with title, description, and candidate instructions

- Question resource supporting both free-text and multiple-choice questions## Features ImplementedThe assignment is to build a light weight restful API server to power a quiz UI.

- Full CRUD operations for both resources

- MongoDB Atlas for data persistence

- OpenAPI v3 specification with interactive Swagger UI

- JSON:API compliant responses✅ **Core Requirements:**## Functional requirements



✅ **Additional Features:**- Quiz resource with title, description, and candidate instructions

- Many-to-many relationship between quizzes and questions

- Questions can belong to multiple quizzes- Question resource supporting both free-text and multiple-choice questions - Implement 2 API resources

- Relationship endpoints for fetching quiz questions

- Environment variable configuration for security- Full CRUD operations for both resources   - A Quiz resource, providing at a minimum a title, description and candidate instructions.

- Cascade cleanup when quizzes are deleted

- MongoDB Atlas for data persistence   - A Question resource. This should support both free text  and multiple choice questions.

## Instructions to Run

- OpenAPI v3 specification with interactive Swagger UI   - Any additional resources you feel are necessary for a functional client experience.

### Prerequisites

- Node.js (v18 or higher)- JSON:API compliant responses - The API should follow the [OpenAPI v3](https://swagger.io/specification/) and [JSON:API](https://jsonapi.org/) Specifications.

- npm

- MongoDB Atlas account (or local MongoDB instance) - Provide implementations for CRUD operations for all resources.



### Setup✅ **Additional Features:** - The server should persist data records to a NoSQL database.



1. **Clone the repository**- Many-to-many relationship between quizzes and questions

   ```bash

   git clone <repository-url>- Questions can belong to multiple quizzes

   cd backend-tech-assignment

   ```- Relationship endpoints for fetching quiz questions## Tech stack



2. **Install dependencies**- Environment variable configuration for security

   ```bash

   npm install- Cascade cleanup when quizzes are deletedYour solution should be written in typescript. Preferably use an express powered server to host the API.

   ```



3. **Configure environment variables**

   ## Instructions to RunFeel free to use whatever tools you’re comfortable with (IDE, workflow, AI assistants/LLMs), just as you would in your normal day-to-day work.

   Create a `.env` file in the root directory (use `.env.example` as a template):

   ```bash

   cp .env.example .env

   ```### PrerequisitesThis repository has already been bootstrapped to provide the basic project structure, extend it as you need.

   

   Update the `.env` file with your MongoDB connection string:- Node.js (v18 or higher)

   ```

   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/quiz-api- npm## Timebox

   PORT=3000

   ```- MongoDB Atlas account (or local MongoDB instance)



4. **Build the project**You should aim to spend no more than 3 hours. If you don’t finish everything, that’s fine. We’ll talk about trade-offs during the interview.

   ```bash

   npm run build### Setup

   ```

## Submission

5. **Start the server**

   1. **Clone the repository**

   For production:

   ```bash   ```bashSend a link to the repo, which should contain a short README.md with:

   npm run start

   ```   git clone <repository-url>

   

   For development (with hot reload and debugging):   cd backend-tech-assignment- Instructions to run

   ```bash

   npm run debug   ```- Time spent

   ```

- Any trade-offs made and what you would improve with more time

6. **Access the API**

   - API Server: `http://localhost:3000`2. **Install dependencies**

   - Swagger UI Documentation: `http://localhost:3000/api-docs`

   ```bashIf you choose to use this repository as your base, please do not create a public fork.

## API Endpoints

   npm install

### Quizzes

- `POST /quizzes` - Create a new quiz   ```## Using this repo

- `GET /quizzes` - Get all quizzes

- `GET /quizzes/:id` - Get a quiz by ID

- `GET /quizzes/:id?include=questions` - Get quiz with related questions (JSON:API format)

- `GET /quizzes/:id/questions` - Get all questions for a specific quiz3. **Configure environment variables**This repository provides a basic application containing an express server with stubbed routes for quiz and question.

- `PATCH /quizzes/:id` - Update a quiz

- `DELETE /quizzes/:id` - Delete a quiz   



### Questions   Create a `.env` file in the root directory (use `.env.example` as a template):To run:

- `POST /questions` - Create a new question

- `GET /questions` - Get all questions   ```bash

- `GET /questions?quizId=<id>` - Filter questions by quiz ID

- `GET /questions/:id` - Get a question by ID   cp .env.example .env```

- `PATCH /questions/:id` - Update a question

- `DELETE /questions/:id` - Delete a question   ```npm install



## Example Requests   npm run build



### Create a Quiz   Update the `.env` file with your MongoDB connection string:npm run start

```bash

curl -X POST http://localhost:3000/quizzes \   ``````

  -H "Content-Type: application/json" \

  -d '{   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/quiz-api

    "title": "JavaScript Basics",

    "description": "Test your knowledge of JavaScript fundamentals",   PORT=3000To run in debug:

    "instructions": "Answer all questions. You have 30 minutes."

  }'   ``````

```

npm install

### Create a Multiple Choice Question

```bash4. **Build the project**npm run debug

curl -X POST http://localhost:3000/questions \

  -H "Content-Type: application/json" \   ```bash```

  -d '{

    "quizIds": ["<quiz-id>"],   npm run build

    "text": "What is a closure in JavaScript?",   ```

    "type": "multiple-choice",

    "choices": [5. **Start the server**

      {"text": "A function with access to outer scope", "isCorrect": true},   

      {"text": "A loop construct", "isCorrect": false}   For production:

    ]   ```bash

  }'   npm run start

```   ```

   

### Create a Free Text Question   For development (with hot reload and debugging):

```bash   ```bash

curl -X POST http://localhost:3000/questions \   npm run debug

  -H "Content-Type: application/json" \   ```

  -d '{

    "quizIds": ["<quiz-id>"],6. **Access the API**

    "text": "Explain what hoisting is in JavaScript",   - API Server: `http://localhost:3000`

    "type": "free-text",   - Swagger UI Documentation: `http://localhost:3000/api-docs`

    "correctAnswer": "Hoisting is JavaScript's behavior of moving declarations to the top"

  }'## API Endpoints

```

### Quizzes

## Time Spent- `POST /quizzes` - Create a new quiz

- `GET /quizzes` - Get all quizzes

**Total: ~3 hours**- `GET /quizzes/:id` - Get a quiz by ID

- `GET /quizzes/:id?include=questions` - Get quiz with related questions (JSON:API format)

- Project setup and MongoDB integration: 45 minutes- `GET /quizzes/:id/questions` - Get all questions for a specific quiz

- CRUD operations implementation: 60 minutes- `PATCH /quizzes/:id` - Update a quiz

- JSON:API compliance and error handling: 30 minutes- `DELETE /quizzes/:id` - Delete a quiz

- Swagger/OpenAPI documentation: 30 minutes

- Relationship endpoints and many-to-many support: 30 minutes### Questions

- Environment variables and MongoDB Atlas setup: 15 minutes- `POST /questions` - Create a new question

- `GET /questions` - Get all questions

## Trade-offs and Future Improvements- `GET /questions?quizId=<id>` - Filter questions by quiz ID

- `GET /questions/:id` - Get a question by ID

### Trade-offs Made (Due to Time Constraints)- `PATCH /questions/:id` - Update a question

- `DELETE /questions/:id` - Delete a question

1. **Authentication/Authorization**

   - Not implemented - all endpoints are publicly accessible## Example Requests

   - **Would add:** JWT-based authentication, role-based access control

### Create a Quiz

2. **Input Validation**```bash

   - Basic validation exists but could be more comprehensivecurl -X POST http://localhost:3000/quizzes \

   - **Would add:** joi or zod for schema validation, more detailed error messages  -H "Content-Type: application/json" \

  -d '{

3. **Testing**    "title": "JavaScript Basics",

   - No unit or integration tests    "description": "Test your knowledge of JavaScript fundamentals",

   - **Would add:** Jest for unit tests, Supertest for API integration tests    "instructions": "Answer all questions. You have 30 minutes."

  }'

4. **Pagination**```

   - GET endpoints return all records without pagination

   - **Would add:** Cursor-based or offset pagination with metadata### Create a Multiple Choice Question

```bash

5. **Error Handling**curl -X POST http://localhost:3000/questions \

   - Basic error handling exists but could be more granular  -H "Content-Type: application/json" \

   - **Would add:** Custom error classes, detailed error codes, better logging  -d '{

    "quizIds": ["<quiz-id>"],

### What I Would Improve With More Time    "text": "What is a closure in JavaScript?",

    "type": "multiple-choice",

1. **Data Validation & Constraints**    "choices": [

   - Add mongoose validators for better data integrity      {"text": "A function with access to outer scope", "isCorrect": true},

   - Validate quiz IDs exist when creating/updating questions      {"text": "A loop construct", "isCorrect": false}

   - Add unique constraints where appropriate    ]

  }'

2. **API Enhancements**```

   - Add filtering, sorting, and search capabilities

   - Implement sparse fieldsets (JSON:API feature)### Create a Free Text Question

   - Add bulk operations (create/update multiple resources)```bash

   - Add question ordering within quizzescurl -X POST http://localhost:3000/questions \

  -H "Content-Type: application/json" \

3. **Documentation**  -d '{

   - Add more detailed OpenAPI examples and descriptions    "quizIds": ["<quiz-id>"],

   - Create a Postman collection    "text": "Explain what hoisting is in JavaScript",

   - Add API versioning strategy    "type": "free-text",

    "correctAnswer": "Hoisting is JavaScript's behavior of moving declarations to the top"

4. **Performance**  }'

   - Add database indexing for commonly queried fields```

   - Implement caching (Redis) for frequently accessed data

   - Add request rate limiting## Time Spent



5. **Developer Experience****Total: ~3 hours**

   - Add database seeding scripts for local development

   - Add Docker support for easy setup- Project setup and MongoDB integration: 45 minutes

   - Add pre-commit hooks (husky) for linting and formatting- CRUD operations implementation: 60 minutes

   - Add CI/CD pipeline- JSON:API compliance and error handling: 30 minutes

- Swagger/OpenAPI documentation: 30 minutes

6. **Additional Features**- Relationship endpoints and many-to-many support: 30 minutes

   - Quiz attempts/submissions tracking- Environment variables and MongoDB Atlas setup: 15 minutes

   - Question randomization

   - Time limits for quizzes## Trade-offs and Future Improvements

   - Question categories/tags

   - Question difficulty levels### Trade-offs Made (Due to Time Constraints)

   - Analytics and reporting

1. **Authentication/Authorization**

7. **Code Quality**   - Not implemented - all endpoints are publicly accessible

   - Add comprehensive logging (Winston or Pino)   - **Would add:** JWT-based authentication, role-based access control

   - Add monitoring and health check endpoints

   - Implement repository pattern for better separation of concerns2. **Input Validation**

   - Add request/response DTOs for better type safety   - Basic validation exists but could be more comprehensive

   - **Would add:** joi or zod for schema validation, more detailed error messages

## Tech Stack

3. **Testing**

- **Runtime:** Node.js   - No unit or integration tests

- **Language:** TypeScript   - **Would add:** Jest for unit tests, Supertest for API integration tests

- **Framework:** Express.js

- **Database:** MongoDB (via Mongoose ODM)4. **Pagination**

- **Documentation:** Swagger UI with OpenAPI 3.0   - GET endpoints return all records without pagination

- **Environment:** dotenv for configuration   - **Would add:** Cursor-based or offset pagination with metadata



## Project Structure5. **Error Handling**

   - Basic error handling exists but could be more granular

```   - **Would add:** Custom error classes, detailed error codes, better logging

src/

├── config/### What I Would Improve With More Time

│   ├── database.ts      # MongoDB connection setup

│   └── swagger.ts       # OpenAPI/Swagger configuration1. **Data Validation & Constraints**

├── controllers/   - Add mongoose validators for better data integrity

│   ├── quiz-controller.ts   - Validate quiz IDs exist when creating/updating questions

│   └── question-controller.ts   - Add unique constraints where appropriate

├── models/

│   ├── quiz-model.ts2. **API Enhancements**

│   └── question-model.ts   - Add filtering, sorting, and search capabilities

├── routes/   - Implement sparse fieldsets (JSON:API feature)

│   ├── quiz-routes.ts   - Add bulk operations (create/update multiple resources)

│   └── question-routes.ts   - Add question ordering within quizzes

└── index.ts             # Application entry point

```3. **Documentation**

   - Add more detailed OpenAPI examples and descriptions

## Notes   - Create a Postman collection

   - Add API versioning strategy

- All responses follow the JSON:API specification

- MongoDB Atlas is used for cloud database hosting4. **Performance**

- Questions can belong to multiple quizzes (many-to-many relationship)   - Add database indexing for commonly queried fields

- When a quiz is deleted, the quiz ID is removed from associated questions   - Implement caching (Redis) for frequently accessed data

- Environment variables are used to keep sensitive information secure   - Add request rate limiting


5. **Developer Experience**
   - Add database seeding scripts for local development
   - Add Docker support for easy setup
   - Add pre-commit hooks (husky) for linting and formatting
   - Add CI/CD pipeline

6. **Additional Features**
   - Quiz attempts/submissions tracking
   - Question randomization
   - Time limits for quizzes
   - Question categories/tags
   - Question difficulty levels
   - Analytics and reporting

7. **Code Quality**
   - Add comprehensive logging (Winston or Pino)
   - Add monitoring and health check endpoints
   - Implement repository pattern for better separation of concerns
   - Add request/response DTOs for better type safety

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

## Notes

- All responses follow the JSON:API specification
- MongoDB Atlas is used for cloud database hosting
- Questions can belong to multiple quizzes (many-to-many relationship)
- When a quiz is deleted, the quiz ID is removed from associated questions
- Environment variables are used to keep sensitive information secure
