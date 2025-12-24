import request from 'supertest';
import app from '../index.js';
import { setupTestDatabase, teardownTestDatabase, clearDatabase } from './setup.js';

// Shared test data IDs
let quiz1Id: string;
let quiz2Id: string;
const questionIds: string[] = [];

beforeAll(async () => {
  await setupTestDatabase();
});

afterAll(async () => {
  await teardownTestDatabase();
});

describe('Quiz API Integration Tests', () => {
  describe('Quiz CRUD Operations', () => {
    it('POST /quizzes - should create first quiz', async () => {
      await clearDatabase();
      
      const res = await request(app)
        .post('/quizzes')
        .send({
          title: 'JavaScript Fundamentals',
          description: 'Test your JS knowledge',
          instructions: 'Answer all questions carefully'
        });

      expect(res.status).toBe(201);
      expect(res.body.data.type).toBe('quizzes');
      expect(res.body.data.attributes.title).toBe('JavaScript Fundamentals');
      quiz1Id = res.body.data.id;
    });

    it('POST /quizzes - should create second quiz', async () => {
      const res = await request(app)
        .post('/quizzes')
        .send({
          title: 'TypeScript Advanced',
          description: 'Advanced TypeScript concepts',
          instructions: 'Complete all questions'
        });

      expect(res.status).toBe(201);
      expect(res.body.data.type).toBe('quizzes');
      expect(res.body.data.attributes.title).toBe('TypeScript Advanced');
      quiz2Id = res.body.data.id;
    });

    it('GET /quizzes - should get all quizzes', async () => {
      const res = await request(app).get('/quizzes');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });

    it('GET /quizzes/:id - should get quiz by ID', async () => {
      const res = await request(app).get(`/quizzes/${quiz1Id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(quiz1Id);
      expect(res.body.data.attributes.title).toBe('JavaScript Fundamentals');
    });

    it('PATCH /quizzes/:id - should update quiz', async () => {
      const res = await request(app)
        .patch(`/quizzes/${quiz1Id}`)
        .send({
          title: 'JavaScript Fundamentals Updated'
        });

      expect(res.status).toBe(200);
      expect(res.body.data.attributes.title).toBe('JavaScript Fundamentals Updated');
    });
  });

  describe('Question CRUD Operations', () => {
    it('POST /questions - should create 5 questions for quiz 1 (mixed types)', async () => {
      const questions = [
        // Free-text questions
        { text: 'What is a closure?', type: 'free-text', correctAnswer: 'A closure is a function with access to its outer scope' },
        { text: 'What is hoisting?', type: 'free-text', correctAnswer: 'Hoisting moves declarations to the top' },
        // Multiple-choice questions
        { 
          text: 'Which keyword declares a block-scoped variable?', 
          type: 'multiple-choice', 
          choices: [
            { text: 'var', isCorrect: false },
            { text: 'let', isCorrect: true },
            { text: 'function', isCorrect: false },
            { text: 'class', isCorrect: false }
          ]
        },
        { 
          text: 'What does === compare?', 
          type: 'multiple-choice', 
          choices: [
            { text: 'Value only', isCorrect: false },
            { text: 'Type only', isCorrect: false },
            { text: 'Value and type', isCorrect: true }
          ]
        },
        { 
          text: 'Which is NOT a primitive type in JavaScript?', 
          type: 'multiple-choice', 
          choices: [
            { text: 'string', isCorrect: false },
            { text: 'number', isCorrect: false },
            { text: 'array', isCorrect: true },
            { text: 'boolean', isCorrect: false }
          ]
        }
      ];

      for (const q of questions) {
        const res = await request(app)
          .post('/questions')
          .send({ ...q, quizIds: [quiz1Id] });

        expect(res.status).toBe(201);
        expect(res.body.data.type).toBe('questions');
        expect(res.body.data.attributes.questionType).toBe(q.type);
        questionIds.push(res.body.data.id);
      }

      expect(questionIds).toHaveLength(5);
    });

    it('POST /questions - should create 5 questions for quiz 2 (mixed types)', async () => {
      const questions = [
        // Multiple-choice questions
        { 
          text: 'What is the correct syntax for a TypeScript interface?', 
          type: 'multiple-choice', 
          choices: [
            { text: 'interface MyInterface {}', isCorrect: true },
            { text: 'type interface MyInterface {}', isCorrect: false },
            { text: 'class interface MyInterface {}', isCorrect: false }
          ]
        },
        { 
          text: 'Which TypeScript feature allows null checking?', 
          type: 'multiple-choice', 
          choices: [
            { text: 'Generics', isCorrect: false },
            { text: 'Strict null checks', isCorrect: true },
            { text: 'Decorators', isCorrect: false },
            { text: 'Enums', isCorrect: false }
          ]
        },
        // Free-text questions
        { text: 'What are generics?', type: 'free-text', correctAnswer: 'Generics allow type parameters' },
        { text: 'What are type guards?', type: 'free-text', correctAnswer: 'Type guards narrow types at runtime' },
        { text: 'What is the purpose of the readonly modifier?', type: 'free-text', correctAnswer: 'Prevents property modification after initialization' }
      ];

      for (const q of questions) {
        const res = await request(app)
          .post('/questions')
          .send({ ...q, quizIds: [quiz2Id] });

        expect(res.status).toBe(201);
        expect(res.body.data.attributes.questionType).toBe(q.type);
        questionIds.push(res.body.data.id);
      }

      expect(questionIds).toHaveLength(10);
    });

    it('POST /questions - should create 5 questions appearing in both quizzes (mixed types)', async () => {
      const questions = [
        // Free-text questions
        { text: 'What is a variable?', type: 'free-text', correctAnswer: 'A named storage for data' },
        { text: 'What is a function?', type: 'free-text', correctAnswer: 'A reusable block of code' },
        // Multiple-choice questions
        { 
          text: 'Which data structure uses key-value pairs?', 
          type: 'multiple-choice', 
          choices: [
            { text: 'Array', isCorrect: false },
            { text: 'Object', isCorrect: true },
            { text: 'String', isCorrect: false }
          ]
        },
        { 
          text: 'What is the output of typeof []?', 
          type: 'multiple-choice', 
          choices: [
            { text: 'array', isCorrect: false },
            { text: 'object', isCorrect: true },
            { text: 'undefined', isCorrect: false }
          ]
        },
        { 
          text: 'Which loop is best for iterating over object properties?', 
          type: 'multiple-choice', 
          choices: [
            { text: 'for', isCorrect: false },
            { text: 'while', isCorrect: false },
            { text: 'for...in', isCorrect: true },
            { text: 'do...while', isCorrect: false }
          ]
        }
      ];

      for (const q of questions) {
        const res = await request(app)
          .post('/questions')
          .send({ ...q, quizIds: [quiz1Id, quiz2Id] });

        expect(res.status).toBe(201);
        expect(res.body.data.attributes.quizIds).toContain(quiz1Id);
        expect(res.body.data.attributes.quizIds).toContain(quiz2Id);
        expect(res.body.data.attributes.questionType).toBe(q.type);
        questionIds.push(res.body.data.id);
      }

      expect(questionIds).toHaveLength(15);
    });

    it('GET /questions - should get all questions', async () => {
      const res = await request(app).get('/questions');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(15);
    });

    it('GET /questions/:id - should get question by ID', async () => {
      const res = await request(app).get(`/questions/${questionIds[0]}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(questionIds[0]);
    });

    it('PATCH /questions/:id - should update question', async () => {
      const res = await request(app)
        .patch(`/questions/${questionIds[0]}`)
        .send({
          text: 'What is a closure in JavaScript?'
        });

      expect(res.status).toBe(200);
      expect(res.body.data.attributes.text).toBe('What is a closure in JavaScript?');
    });
  });

  describe('Quiz-Question Relationship Operations', () => {
    it('GET /quizzes/:id/questions - should get questions for quiz 1 (10 questions)', async () => {
      const res = await request(app).get(`/quizzes/${quiz1Id}/questions`);

      expect(res.status).toBe(200);
      // Quiz 1 has 5 exclusive + 5 shared = 10 questions
      expect(res.body.data).toHaveLength(10);
    });

    it('GET /quizzes/:id/questions - should get questions for quiz 2 (10 questions)', async () => {
      const res = await request(app).get(`/quizzes/${quiz2Id}/questions`);

      expect(res.status).toBe(200);
      // Quiz 2 has 5 exclusive + 5 shared = 10 questions
      expect(res.body.data).toHaveLength(10);
    });

    it('GET /quizzes/:id?include=questions - should include questions in response', async () => {
      const res = await request(app).get(`/quizzes/${quiz1Id}?include=questions`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(quiz1Id);
      expect(res.body.data.relationships.questions.data).toHaveLength(10);
      expect(res.body.included).toHaveLength(10);
    });
  });

  describe('Delete Operations', () => {
    it('DELETE /questions/:id - should delete a question', async () => {
      const questionToDelete = questionIds[0];
      const res = await request(app).delete(`/questions/${questionToDelete}`);

      expect(res.status).toBe(204);

      // Verify deletion
      const getRes = await request(app).get(`/questions/${questionToDelete}`);
      expect(getRes.status).toBe(404);
    });

    it('DELETE /quizzes/:id - should delete quiz and remove it from questions', async () => {
      // Get a shared question before deletion
      const sharedQuestionId = questionIds[10]; // First shared question
      const beforeRes = await request(app).get(`/questions/${sharedQuestionId}`);
      expect(beforeRes.body.data.attributes.quizIds).toContain(quiz1Id);

      // Delete quiz 1
      const deleteRes = await request(app).delete(`/quizzes/${quiz1Id}`);
      expect(deleteRes.status).toBe(204);

      // Verify quiz is deleted
      const quizRes = await request(app).get(`/quizzes/${quiz1Id}`);
      expect(quizRes.status).toBe(404);

      // Verify quizId is removed from shared question
      const afterRes = await request(app).get(`/questions/${sharedQuestionId}`);
      expect(afterRes.body.data.attributes.quizIds).not.toContain(quiz1Id);
      expect(afterRes.body.data.attributes.quizIds).toContain(quiz2Id);
    });
  });
});
