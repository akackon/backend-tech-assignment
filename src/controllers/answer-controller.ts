import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AnswerModel } from "../models/answer-model.js";
import { GameSessionModel } from "../models/game-session-model.js";
import { QuestionModel } from "../models/question-model.js";

const POINTS_PER_CORRECT_ANSWER = 10;

export class AnswerController {
  /**
   * Submit an answer for a question in a game session
   */
  public async submitAnswer(req: Request, res: Response) {
    try {
      const { sessionId, questionId, userAnswer, selectedChoiceIndex } =
        req.body;

      if (!sessionId || !questionId || userAnswer === undefined) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          errors: [
            {
              status: StatusCodes.BAD_REQUEST.toString(),
              title: "Validation Error",
              detail: "sessionId, questionId, and userAnswer are required",
            },
          ],
        });
      }

      // Verify session exists and is in progress
      const session = await GameSessionModel.findById(sessionId);
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

      if (session.status !== "in-progress") {
        return res.status(StatusCodes.BAD_REQUEST).json({
          errors: [
            {
              status: StatusCodes.BAD_REQUEST.toString(),
              title: "Bad Request",
              detail: "Game session is not in progress",
            },
          ],
        });
      }

      // Verify question exists and belongs to the quiz
      const question = await QuestionModel.findById(questionId);
      if (!question) {
        return res.status(StatusCodes.NOT_FOUND).json({
          errors: [
            {
              status: StatusCodes.NOT_FOUND.toString(),
              title: "Not Found",
              detail: "Question not found",
            },
          ],
        });
      }

      if (!question.quizIds.some((qid) => qid.equals(session.quizId))) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          errors: [
            {
              status: StatusCodes.BAD_REQUEST.toString(),
              title: "Bad Request",
              detail: "Question does not belong to this quiz",
            },
          ],
        });
      }

      // Check if already answered
      const existingAnswer = await AnswerModel.findOne({
        sessionId,
        questionId,
      });
      if (existingAnswer) {
        return res.status(StatusCodes.CONFLICT).json({
          errors: [
            {
              status: StatusCodes.CONFLICT.toString(),
              title: "Conflict",
              detail: "This question has already been answered in this session",
            },
          ],
        });
      }

      // Determine if answer is correct
      let isCorrect = false;

      if (question.type === "multiple-choice") {
        // For multiple choice, check if selected choice is correct
        if (
          selectedChoiceIndex !== undefined &&
          question.choices &&
          question.choices[selectedChoiceIndex]
        ) {
          isCorrect = question.choices[selectedChoiceIndex].isCorrect;
        }
      } else {
        // For free-text, do case-insensitive comparison
        // In a real app, you might use fuzzy matching or NLP
        isCorrect =
          userAnswer.toLowerCase().trim() ===
          question.correctAnswer?.toLowerCase().trim();
      }

      const pointsEarned = isCorrect ? POINTS_PER_CORRECT_ANSWER : 0;

      const answer = await AnswerModel.create({
        sessionId,
        questionId,
        userAnswer,
        selectedChoiceIndex,
        isCorrect,
        pointsEarned,
        answeredAt: new Date(),
      });

      // Update session stats
      await GameSessionModel.findByIdAndUpdate(sessionId, {
        $inc: {
          score: pointsEarned,
          correctAnswers: isCorrect ? 1 : 0,
        },
      });

      res.status(StatusCodes.CREATED).json({
        data: {
          type: "answers",
          id: answer._id.toString(),
          attributes: {
            sessionId: answer.sessionId.toString(),
            questionId: answer.questionId.toString(),
            userAnswer: answer.userAnswer,
            selectedChoiceIndex: answer.selectedChoiceIndex,
            isCorrect: answer.isCorrect,
            pointsEarned: answer.pointsEarned,
            answeredAt: answer.answeredAt,
            createdAt: answer.createdAt,
            updatedAt: answer.updatedAt,
          },
          meta: {
            correctAnswer:
              question.type === "multiple-choice"
                ? question.choices?.find((c) => c.isCorrect)?.text
                : question.correctAnswer,
          },
        },
      });
    } catch (error) {
      console.error("submitAnswer error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: "An error occurred while submitting the answer",
          },
        ],
      });
    }
  }

  /**
   * Get all answers for a session
   */
  public async getSessionAnswers(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;

      const session = await GameSessionModel.findById(sessionId);
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

      const answers = await AnswerModel.find({ sessionId }).sort({
        answeredAt: 1,
      });

      res.status(StatusCodes.OK).json({
        data: answers.map((answer) => ({
          type: "answers",
          id: answer._id.toString(),
          attributes: {
            sessionId: answer.sessionId.toString(),
            questionId: answer.questionId.toString(),
            userAnswer: answer.userAnswer,
            selectedChoiceIndex: answer.selectedChoiceIndex,
            isCorrect: answer.isCorrect,
            pointsEarned: answer.pointsEarned,
            answeredAt: answer.answeredAt,
            createdAt: answer.createdAt,
            updatedAt: answer.updatedAt,
          },
        })),
        meta: {
          totalAnswers: answers.length,
          correctAnswers: answers.filter((a) => a.isCorrect).length,
          totalPoints: answers.reduce((sum, a) => sum + a.pointsEarned, 0),
        },
      });
    } catch (error) {
      console.error("getSessionAnswers error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: "An error occurred while retrieving answers",
          },
        ],
      });
    }
  }

  /**
   * Get a specific answer by ID
   */
  public async getAnswer(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const answer = await AnswerModel.findById(id);
      if (!answer) {
        return res.status(StatusCodes.NOT_FOUND).json({
          errors: [
            {
              status: StatusCodes.NOT_FOUND.toString(),
              title: "Not Found",
              detail: "Answer not found",
            },
          ],
        });
      }

      res.status(StatusCodes.OK).json({
        data: {
          type: "answers",
          id: answer._id.toString(),
          attributes: {
            sessionId: answer.sessionId.toString(),
            questionId: answer.questionId.toString(),
            userAnswer: answer.userAnswer,
            selectedChoiceIndex: answer.selectedChoiceIndex,
            isCorrect: answer.isCorrect,
            pointsEarned: answer.pointsEarned,
            answeredAt: answer.answeredAt,
            createdAt: answer.createdAt,
            updatedAt: answer.updatedAt,
          },
        },
      });
    } catch (error) {
      console.error("getAnswer error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: "An error occurred while retrieving the answer",
          },
        ],
      });
    }
  }
}
