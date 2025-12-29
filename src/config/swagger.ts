import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Quiz API",
      version: "1.0.0",
      description:
        "A RESTful API for managing quizzes and questions, following JSON:API specification",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Docker development server",
      },
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
    ],
    tags: [
      { name: "Quizzes", description: "Quiz management endpoints" },
      { name: "Questions", description: "Question management endpoints" },
      { name: "Quiz Attempts", description: "Play quizzes and submit answers" },
    ],
    components: {
      schemas: {
        Quiz: {
          type: "object",
          required: ["title", "description", "instructions"],
          properties: {
            title: {
              type: "string",
              description: "The title of the quiz",
              example: "JavaScript Basics Quiz",
            },
            description: {
              type: "string",
              description: "A description of the quiz",
              example: "Test your knowledge of JavaScript fundamentals",
            },
            instructions: {
              type: "string",
              description: "Instructions for candidates taking the quiz",
              example:
                "Answer all questions to the best of your ability. You have 30 minutes.",
            },
          },
        },
        Question: {
          type: "object",
          required: ["text", "type"],
          properties: {
            quizIds: {
              type: "array",
              items: {
                type: "string",
              },
              description:
                "Array of quiz IDs this question belongs to (optional)",
              example: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
            },
            text: {
              type: "string",
              description: "The question text",
              example: "What is a closure in JavaScript?",
            },
            type: {
              type: "string",
              enum: ["free-text", "multiple-choice"],
              description: "The type of question",
              example: "multiple-choice",
            },
            choices: {
              type: "array",
              description:
                "Array of choices (required for multiple-choice questions)",
              items: {
                type: "object",
                properties: {
                  text: {
                    type: "string",
                    example: "A function that has access to outer scope",
                  },
                  isCorrect: {
                    type: "boolean",
                    example: true,
                  },
                },
              },
            },
            correctAnswer: {
              type: "string",
              description:
                "The correct answer (required for free-text questions)",
              example:
                "A closure is a function that has access to variables in its outer scope",
            },
          },
        },
        JSONAPIResource: {
          type: "object",
          properties: {
            data: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  example: "quizzes",
                },
                id: {
                  type: "string",
                  example: "507f1f77bcf86cd799439011",
                },
                attributes: {
                  type: "object",
                },
              },
            },
          },
        },
        JSONAPICollection: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                  },
                  id: {
                    type: "string",
                  },
                  attributes: {
                    type: "object",
                  },
                },
              },
            },
          },
        },
        JSONAPIError: {
          type: "object",
          properties: {
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    example: "404",
                  },
                  title: {
                    type: "string",
                    example: "Not Found",
                  },
                  detail: {
                    type: "string",
                    example: "The requested resource was not found",
                  },
                },
              },
            },
          },
        },
      },
    },
    paths: {
      "/quizzes": {
        get: {
          summary: "Get all quizzes",
          tags: ["Quizzes"],
          responses: {
            "200": {
              description: "A list of quizzes",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPICollection",
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Create a new quiz",
          tags: ["Quizzes"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Quiz",
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Quiz created successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIResource",
                  },
                },
              },
            },
            "400": {
              description: "Bad request - validation error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
          },
        },
      },
      "/quizzes/{id}": {
        get: {
          summary: "Get a quiz by ID",
          tags: ["Quizzes"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "The quiz ID",
            },
            {
              name: "include",
              in: "query",
              required: false,
              schema: {
                type: "string",
                enum: ["questions"],
              },
              description:
                "Include related resources (use 'questions' to include quiz questions)",
            },
          ],
          responses: {
            "200": {
              description: "Quiz found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIResource",
                  },
                },
              },
            },
            "404": {
              description: "Quiz not found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
          },
        },
        patch: {
          summary: "Update a quiz",
          tags: ["Quizzes"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "The quiz ID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Quiz",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Quiz updated successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIResource",
                  },
                },
              },
            },
            "404": {
              description: "Quiz not found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
          },
        },
        delete: {
          summary: "Delete a quiz",
          tags: ["Quizzes"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "The quiz ID",
            },
          ],
          responses: {
            "204": {
              description: "Quiz deleted successfully",
            },
            "404": {
              description: "Quiz not found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
          },
        },
      },
      "/quizzes/{id}/questions": {
        get: {
          summary: "Get all questions for a specific quiz",
          tags: ["Quizzes", "Questions"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "The quiz ID",
            },
          ],
          responses: {
            "200": {
              description: "List of questions for the quiz",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPICollection",
                  },
                },
              },
            },
            "404": {
              description: "Quiz not found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
          },
        },
      },
      "/questions": {
        get: {
          summary: "Get all questions",
          tags: ["Questions"],
          parameters: [
            {
              name: "quizId",
              in: "query",
              required: false,
              schema: {
                type: "string",
              },
              description: "Filter questions by quiz ID",
            },
          ],
          responses: {
            "200": {
              description: "A list of questions",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPICollection",
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Create a new question",
          tags: ["Questions"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Question",
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Question created successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIResource",
                  },
                },
              },
            },
            "400": {
              description: "Bad request - validation error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
          },
        },
      },
      "/questions/{id}": {
        get: {
          summary: "Get a question by ID",
          tags: ["Questions"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "The question ID",
            },
          ],
          responses: {
            "200": {
              description: "Question found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIResource",
                  },
                },
              },
            },
            "404": {
              description: "Question not found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
          },
        },
        patch: {
          summary: "Update a question",
          tags: ["Questions"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "The question ID",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Question",
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Question updated successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIResource",
                  },
                },
              },
            },
            "404": {
              description: "Question not found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
          },
        },
        delete: {
          summary: "Delete a question",
          tags: ["Questions"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "The question ID",
            },
          ],
          responses: {
            "204": {
              description: "Question deleted successfully",
            },
            "404": {
              description: "Question not found",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
            "500": {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/JSONAPIError",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/quiz-attempt-routes.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
