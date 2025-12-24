import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { QuizAttemptModel } from "../models/quiz-attempt-model.js";
import { QuizModel } from "../models/quiz-model.js";
import { QuestionModel } from "../models/question-model.js";

const POINTS_PER_CORRECT_ANSWER = 10;

export class QuizAttemptController {
  /**
   * Start playing a quiz - creates a new attempt
   * POST /quizzes/:quizId/play
   */
  public async startQuiz(req: Request, res: Response) {
    try {
      const { quizId } = req.params;

      // Check if quiz exists
      const quiz = await QuizModel.findById(quizId);
      if (!quiz) {
        return res.status(StatusCodes.NOT_FOUND).json({
          errors: [{ title: "Quiz not found", status: StatusCodes.NOT_FOUND }],
        });
      }

      // Get the questions for this quiz
      const questions = await QuestionModel.find({ quizIds: quizId });

      // Create new attempt
      const attempt = await QuizAttemptModel.create({
        quizId,
        status: "in-progress",
        score: 0,
        answers: [],
      });

      res.status(StatusCodes.CREATED).json({
        data: {
          type: "quiz-attempts",
          id: attempt._id,
          attributes: {
            quizId: attempt.quizId,
            quizTitle: quiz.title,
            status: attempt.status,
            score: attempt.score,
            totalQuestions: questions.length,
          },
          relationships: {
            questions: {
              data: questions.map((q) => ({
                type: "questions",
                id: q._id,
                attributes: {
                  text: q.text,
                  type: q.type,
                  choices: q.type === "multiple-choice" ? q.choices?.map(c => c.text) : undefined,
                },
              })),
            },
          },
        },
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [{ title: "Failed to start quiz", detail: String(error) }],
      });
    }
  }

  /**
   * Submit an answer for a question
   * POST /quiz-attempts/:attemptId/answers
   */
  public async submitAnswer(req: Request, res: Response) {
    try {
      const { attemptId } = req.params;
      const { questionId, answer } = req.body;

      // Find the attempt
      const attempt = await QuizAttemptModel.findById(attemptId);
      if (!attempt) {
        return res.status(StatusCodes.NOT_FOUND).json({
          errors: [{ title: "Quiz attempt not found", status: StatusCodes.NOT_FOUND }],
        });
      }

      if (attempt.status !== "in-progress") {
        return res.status(StatusCodes.BAD_REQUEST).json({
          errors: [{ title: "Quiz attempt is no longer in progress", status: StatusCodes.BAD_REQUEST }],
        });
      }

      // Check if question already answered
      const existingAnswer = attempt.answers.find(
        (a) => a.questionId.toString() === questionId
      );
      if (existingAnswer) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          errors: [{ title: "Question already answered", status: StatusCodes.BAD_REQUEST }],
        });
      }

      // Find the question
      const question = await QuestionModel.findById(questionId);
      if (!question) {
        return res.status(StatusCodes.NOT_FOUND).json({
          errors: [{ title: "Question not found", status: StatusCodes.NOT_FOUND }],
        });
      }

      // Check if the answer is correct
      let isCorrect = false;
      if (question.type === "free-text") {
        isCorrect = question.correctAnswer?.toLowerCase().trim() === answer.toLowerCase().trim();
      } else if (question.type === "multiple-choice") {
        const correctChoice = question.choices?.find((c) => c.isCorrect);
        isCorrect = correctChoice?.text.toLowerCase().trim() === answer.toLowerCase().trim();
      }

      // Add the answer to the attempt
      attempt.answers.push({
        questionId,
        answer,
        isCorrect,
        answeredAt: new Date(),
      });

      // Update score if correct
      if (isCorrect) {
        attempt.score += POINTS_PER_CORRECT_ANSWER;
      }

      await attempt.save();

      res.status(StatusCodes.CREATED).json({
        data: {
          type: "answers",
          id: attemptId + "-" + questionId,
          attributes: {
            questionId,
            answer,
            isCorrect,
            pointsEarned: isCorrect ? POINTS_PER_CORRECT_ANSWER : 0,
            currentScore: attempt.score,
          },
        },
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [{ title: "Failed to submit answer", detail: String(error) }],
      });
    }
  }

  /**
   * Complete a quiz attempt
   * POST /quiz-attempts/:attemptId/complete
   */
  public async completeAttempt(req: Request, res: Response) {
    try {
      const { attemptId } = req.params;

      const attempt = await QuizAttemptModel.findById(attemptId);
      if (!attempt) {
        return res.status(StatusCodes.NOT_FOUND).json({
          errors: [{ title: "Quiz attempt not found", status: StatusCodes.NOT_FOUND }],
        });
      }

      if (attempt.status !== "in-progress") {
        return res.status(StatusCodes.BAD_REQUEST).json({
          errors: [{ title: "Quiz attempt is no longer in progress", status: StatusCodes.BAD_REQUEST }],
        });
      }

      attempt.status = "completed";
      attempt.completedAt = new Date();
      await attempt.save();

      // Calculate stats
      const totalAnswers = attempt.answers.length;
      const correctAnswers = attempt.answers.filter((a) => a.isCorrect).length;

      res.status(StatusCodes.OK).json({
        data: {
          type: "quiz-attempts",
          id: attempt._id,
          attributes: {
            status: attempt.status,
            score: attempt.score,
            totalAnswers,
            correctAnswers,
            accuracy: totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0,
            completedAt: attempt.completedAt,
          },
        },
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [{ title: "Failed to complete quiz attempt", detail: String(error) }],
      });
    }
  }

  /**
   * Get a quiz attempt details
   * GET /quiz-attempts/:attemptId
   */
  public async getAttempt(req: Request, res: Response) {
    try {
      const { attemptId } = req.params;

      const attempt = await QuizAttemptModel.findById(attemptId);
      if (!attempt) {
        return res.status(StatusCodes.NOT_FOUND).json({
          errors: [{ title: "Quiz attempt not found", status: StatusCodes.NOT_FOUND }],
        });
      }

      res.status(StatusCodes.OK).json({
        data: {
          type: "quiz-attempts",
          id: attempt._id,
          attributes: {
            quizId: attempt.quizId,
            status: attempt.status,
            score: attempt.score,
            answers: attempt.answers,
            createdAt: attempt.createdAt,
            completedAt: attempt.completedAt,
          },
        },
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [{ title: "Failed to get quiz attempt", detail: String(error) }],
      });
    }
  }

  /**
   * Get all attempts for a quiz
   * GET /quizzes/:quizId/attempts
   */
  public async getAttemptsByQuiz(req: Request, res: Response) {
    try {
      const { quizId } = req.params;

      const attempts = await QuizAttemptModel.find({ quizId, status: "completed" })
        .sort({ score: -1 })
        .limit(10);

      res.status(StatusCodes.OK).json({
        data: attempts.map((attempt) => ({
          type: "quiz-attempts",
          id: attempt._id,
          attributes: {
            score: attempt.score,
            completedAt: attempt.completedAt,
          },
        })),
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [{ title: "Failed to get quiz attempts", detail: String(error) }],
      });
    }
  }
}

export const quizAttemptController = new QuizAttemptController();
