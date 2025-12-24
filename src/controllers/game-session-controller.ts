import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { GameSessionModel } from "../models/game-session-model.js";
import { QuizModel } from "../models/quiz-model.js";
import { QuestionModel } from "../models/question-model.js";
import { AnswerModel } from "../models/answer-model.js";

export class GameSessionController {
  /**
   * Start a new game session for a quiz
   */
  public async startSession(req: Request, res: Response) {
    try {
      const { quizId, playerName, playerEmail } = req.body;

      if (!quizId || !playerName) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          errors: [
            {
              status: StatusCodes.BAD_REQUEST.toString(),
              title: "Validation Error",
              detail: "quizId and playerName are required",
            },
          ],
        });
      }

      // Verify quiz exists
      const quiz = await QuizModel.findById(quizId);
      if (!quiz) {
        return res.status(StatusCodes.NOT_FOUND).json({
          errors: [
            {
              status: StatusCodes.NOT_FOUND.toString(),
              title: "Not Found",
              detail: "Quiz not found",
            },
          ],
        });
      }

      // Count questions for this quiz
      const totalQuestions = await QuestionModel.countDocuments({
        quizIds: quizId,
      });

      const session = await GameSessionModel.create({
        quizId,
        playerName,
        playerEmail,
        totalQuestions,
        startedAt: new Date(),
      });

      res.status(StatusCodes.CREATED).json({
        data: {
          type: "game-sessions",
          id: session._id.toString(),
          attributes: {
            quizId: session.quizId.toString(),
            playerName: session.playerName,
            playerEmail: session.playerEmail,
            status: session.status,
            score: session.score,
            totalQuestions: session.totalQuestions,
            correctAnswers: session.correctAnswers,
            startedAt: session.startedAt,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
          },
          relationships: {
            quiz: {
              data: { type: "quizzes", id: quiz._id.toString() },
            },
          },
        },
      });
    } catch (error) {
      console.error("startSession error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: "An error occurred while starting the game session",
          },
        ],
      });
    }
  }

  /**
   * Get a game session by ID
   */
  public async getSession(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { include } = req.query;

      const session = await GameSessionModel.findById(id);
      if (!session) {
        return res.status(StatusCodes.NOT_FOUND).json({
          errors: [
            {
              status: StatusCodes.NOT_FOUND.toString(),
              title: "Not Found",
              detail: "Game session not found",
            },
          ],
        });
      }

      const response: any = {
        data: {
          type: "game-sessions",
          id: session._id.toString(),
          attributes: {
            quizId: session.quizId.toString(),
            playerName: session.playerName,
            playerEmail: session.playerEmail,
            status: session.status,
            score: session.score,
            totalQuestions: session.totalQuestions,
            correctAnswers: session.correctAnswers,
            startedAt: session.startedAt,
            completedAt: session.completedAt,
            timeSpentSeconds: session.timeSpentSeconds,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
          },
        },
      };

      // Include answers if requested
      if (include === "answers") {
        const answers = await AnswerModel.find({ sessionId: id });
        response.data.relationships = {
          answers: {
            data: answers.map((a) => ({
              type: "answers",
              id: a._id.toString(),
            })),
          },
        };
        response.included = answers.map((a) => ({
          type: "answers",
          id: a._id.toString(),
          attributes: {
            questionId: a.questionId.toString(),
            userAnswer: a.userAnswer,
            selectedChoiceIndex: a.selectedChoiceIndex,
            isCorrect: a.isCorrect,
            pointsEarned: a.pointsEarned,
            answeredAt: a.answeredAt,
          },
        }));
      }

      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      console.error("getSession error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: "An error occurred while retrieving the game session",
          },
        ],
      });
    }
  }

  /**
   * Complete/end a game session
   */
  public async completeSession(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const session = await GameSessionModel.findById(id);
      if (!session) {
        return res.status(StatusCodes.NOT_FOUND).json({
          errors: [
            {
              status: StatusCodes.NOT_FOUND.toString(),
              title: "Not Found",
              detail: "Game session not found",
            },
          ],
        });
      }

      if (session.status === "completed") {
        return res.status(StatusCodes.BAD_REQUEST).json({
          errors: [
            {
              status: StatusCodes.BAD_REQUEST.toString(),
              title: "Bad Request",
              detail: "Game session is already completed",
            },
          ],
        });
      }

      // Calculate final stats
      const answers = await AnswerModel.find({ sessionId: id });
      const correctAnswers = answers.filter((a) => a.isCorrect).length;
      const totalScore = answers.reduce((sum, a) => sum + a.pointsEarned, 0);

      const completedAt = new Date();
      const timeSpentSeconds = Math.floor(
        (completedAt.getTime() - session.startedAt.getTime()) / 1000
      );

      const updatedSession = await GameSessionModel.findByIdAndUpdate(
        id,
        {
          status: "completed",
          completedAt,
          timeSpentSeconds,
          correctAnswers,
          score: totalScore,
        },
        { new: true }
      );

      res.status(StatusCodes.OK).json({
        data: {
          type: "game-sessions",
          id: updatedSession!._id.toString(),
          attributes: {
            quizId: updatedSession!.quizId.toString(),
            playerName: updatedSession!.playerName,
            playerEmail: updatedSession!.playerEmail,
            status: updatedSession!.status,
            score: updatedSession!.score,
            totalQuestions: updatedSession!.totalQuestions,
            correctAnswers: updatedSession!.correctAnswers,
            startedAt: updatedSession!.startedAt,
            completedAt: updatedSession!.completedAt,
            timeSpentSeconds: updatedSession!.timeSpentSeconds,
            createdAt: updatedSession!.createdAt,
            updatedAt: updatedSession!.updatedAt,
          },
        },
      });
    } catch (error) {
      console.error("completeSession error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: "An error occurred while completing the game session",
          },
        ],
      });
    }
  }

  /**
   * Get leaderboard for a quiz
   */
  public async getLeaderboard(req: Request, res: Response) {
    try {
      const { quizId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      // Verify quiz exists
      const quiz = await QuizModel.findById(quizId);
      if (!quiz) {
        return res.status(StatusCodes.NOT_FOUND).json({
          errors: [
            {
              status: StatusCodes.NOT_FOUND.toString(),
              title: "Not Found",
              detail: "Quiz not found",
            },
          ],
        });
      }

      const sessions = await GameSessionModel.find({
        quizId,
        status: "completed",
      })
        .sort({ score: -1, timeSpentSeconds: 1 })
        .limit(limit);

      res.status(StatusCodes.OK).json({
        data: sessions.map((session, index) => ({
          type: "leaderboard-entries",
          id: session._id.toString(),
          attributes: {
            rank: index + 1,
            playerName: session.playerName,
            score: session.score,
            correctAnswers: session.correctAnswers,
            totalQuestions: session.totalQuestions,
            timeSpentSeconds: session.timeSpentSeconds,
            completedAt: session.completedAt,
          },
        })),
        meta: {
          quizId,
          quizTitle: quiz.title,
          totalEntries: sessions.length,
        },
      });
    } catch (error) {
      console.error("getLeaderboard error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: "An error occurred while retrieving the leaderboard",
          },
        ],
      });
    }
  }

  /**
   * Get all sessions for a player (by email)
   */
  public async getPlayerSessions(req: Request, res: Response) {
    try {
      const { email } = req.params;

      const sessions = await GameSessionModel.find({ playerEmail: email }).sort(
        { createdAt: -1 }
      );

      res.status(StatusCodes.OK).json({
        data: sessions.map((session) => ({
          type: "game-sessions",
          id: session._id.toString(),
          attributes: {
            quizId: session.quizId.toString(),
            playerName: session.playerName,
            playerEmail: session.playerEmail,
            status: session.status,
            score: session.score,
            totalQuestions: session.totalQuestions,
            correctAnswers: session.correctAnswers,
            startedAt: session.startedAt,
            completedAt: session.completedAt,
            timeSpentSeconds: session.timeSpentSeconds,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
          },
        })),
      });
    } catch (error) {
      console.error("getPlayerSessions error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: "An error occurred while retrieving player sessions",
          },
        ],
      });
    }
  }
}
