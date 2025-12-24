import { Router } from "express";
import { QuizAttemptController } from "../controllers/quiz-attempt-controller.js";

const router = Router();
const controller = new QuizAttemptController();

/**
 * @swagger
 * components:
 *   schemas:
 *     QuizAttempt:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           example: quiz-attempts
 *         id:
 *           type: string
 *         attributes:
 *           type: object
 *           properties:
 *             quizId:
 *               type: string
 *             quizTitle:
 *               type: string
 *             status:
 *               type: string
 *               enum: [in-progress, completed, abandoned]
 *             score:
 *               type: number
 *             totalQuestions:
 *               type: number
 *     Answer:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           example: answers
 *         id:
 *           type: string
 *         attributes:
 *           type: object
 *           properties:
 *             questionId:
 *               type: string
 *             answer:
 *               type: string
 *             isCorrect:
 *               type: boolean
 *             pointsEarned:
 *               type: number
 *             currentScore:
 *               type: number
 */

/**
 * @swagger
 * /quizzes/{quizId}/play:
 *   post:
 *     summary: Start playing a quiz
 *     description: Creates a new quiz attempt and returns the questions to answer
 *     tags: [Quiz Attempts]
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *         description: The quiz ID
 *     responses:
 *       201:
 *         description: Quiz attempt started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/QuizAttempt'
 *       404:
 *         description: Quiz not found
 */
router.post("/quizzes/:quizId/play", controller.startQuiz.bind(controller));

/**
 * @swagger
 * /quiz-attempts/{attemptId}/answers:
 *   post:
 *     summary: Submit an answer for a question
 *     description: Submit an answer and get immediate feedback on correctness
 *     tags: [Quiz Attempts]
 *     parameters:
 *       - in: path
 *         name: attemptId
 *         required: true
 *         schema:
 *           type: string
 *         description: The quiz attempt ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionId
 *               - answer
 *             properties:
 *               questionId:
 *                 type: string
 *               answer:
 *                 type: string
 *     responses:
 *       201:
 *         description: Answer submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Answer'
 *       400:
 *         description: Question already answered or attempt not in progress
 *       404:
 *         description: Attempt or question not found
 */
router.post(
  "/quiz-attempts/:attemptId/answers",
  controller.submitAnswer.bind(controller)
);

/**
 * @swagger
 * /quiz-attempts/{attemptId}/complete:
 *   post:
 *     summary: Complete a quiz attempt
 *     description: Mark the quiz attempt as completed and get final score
 *     tags: [Quiz Attempts]
 *     parameters:
 *       - in: path
 *         name: attemptId
 *         required: true
 *         schema:
 *           type: string
 *         description: The quiz attempt ID
 *     responses:
 *       200:
 *         description: Quiz attempt completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: quiz-attempts
 *                     id:
 *                       type: string
 *                     attributes:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           example: completed
 *                         score:
 *                           type: number
 *                         totalAnswers:
 *                           type: number
 *                         correctAnswers:
 *                           type: number
 *                         accuracy:
 *                           type: number
 *       400:
 *         description: Attempt is not in progress
 *       404:
 *         description: Attempt not found
 */
router.post(
  "/quiz-attempts/:attemptId/complete",
  controller.completeAttempt.bind(controller)
);

/**
 * @swagger
 * /quiz-attempts/{attemptId}:
 *   get:
 *     summary: Get quiz attempt details
 *     description: Get the details of a specific quiz attempt
 *     tags: [Quiz Attempts]
 *     parameters:
 *       - in: path
 *         name: attemptId
 *         required: true
 *         schema:
 *           type: string
 *         description: The quiz attempt ID
 *     responses:
 *       200:
 *         description: Quiz attempt details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/QuizAttempt'
 *       404:
 *         description: Attempt not found
 */
router.get("/quiz-attempts/:attemptId", controller.getAttempt.bind(controller));

/**
 * @swagger
 * /quizzes/{quizId}/attempts:
 *   get:
 *     summary: Get all attempts for a quiz
 *     description: Get the top 10 completed attempts for a quiz sorted by score
 *     tags: [Quiz Attempts]
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *         description: The quiz ID
 *     responses:
 *       200:
 *         description: List of quiz attempts
 */
router.get(
  "/quizzes/:quizId/attempts",
  controller.getAttemptsByQuiz.bind(controller)
);

export const quizAttemptRoutes = router;
