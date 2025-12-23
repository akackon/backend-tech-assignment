import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { QuestionModel } from "../models/question-model.js";

export class QuestionController {
  public async createQuestion(req: Request, res: Response) {
    try {
      const { quizIds, text, type, choices, correctAnswer } = req.body;

      if (!text || !type) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          errors: [
            {
              status: StatusCodes.BAD_REQUEST.toString(),
              title: "Validation Error",
              detail: "text and type are required",
            },
          ],
        });
      }

      if (type === "multiple-choice" && (!choices || !Array.isArray(choices))) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          errors: [
            {
              status: StatusCodes.BAD_REQUEST.toString(),
              title: "Validation Error",
              detail: "choices array is required for multiple-choice questions",
            },
          ],
        });
      }

      if (type === "free-text" && !correctAnswer) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          errors: [
            {
              status: StatusCodes.BAD_REQUEST.toString(),
              title: "Validation Error",
              detail: "correctAnswer is required for free-text questions",
            },
          ],
        });
      }

      const question = await QuestionModel.create({
        quizIds: quizIds || [],
        text,
        type,
        choices,
        correctAnswer,
      });

      res.status(StatusCodes.CREATED).json({
        data: {
          type: "questions",
          id: question._id.toString(),
          attributes: {
            quizIds: question.quizIds.map((id) => id.toString()),
            text: question.text,
            questionType: question.type,
            choices: question.choices,
            correctAnswer: question.correctAnswer,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
          },
        },
      });
    } catch (error) {
      console.error("createQuestion error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: "An error occurred while creating the question",
          },
        ],
      });
    }
  }

  public async getQuestionById(req: Request, res: Response) {
    try {
      const question = await QuestionModel.findById(req.params.id);

      if (!question) {
        return res.status(StatusCodes.NOT_FOUND).json({
          errors: [
            {
              status: StatusCodes.NOT_FOUND.toString(),
              title: "Not Found",
              detail: `Question with id ${req.params.id} not found`,
            },
          ],
        });
      }

      res.status(StatusCodes.OK).json({
        data: {
          type: "questions",
          id: question._id.toString(),
          attributes: {
            quizIds: question.quizIds.map((id) => id.toString()),
            text: question.text,
            questionType: question.type,
            choices: question.choices,
            correctAnswer: question.correctAnswer,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
          },
        },
      });
    } catch (error) {
      console.error("getQuestionById error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: "An error occurred while fetching the question",
          },
        ],
      });
    }
  }

  public async getQuestions(req: Request, res: Response) {
    try {
      const { quizId } = req.query;

      const filter = quizId ? { quizIds: quizId } : {};
      const questions = await QuestionModel.find(filter);

      res.status(StatusCodes.OK).json({
        data: questions.map((question) => ({
          type: "questions",
          id: question._id.toString(),
          attributes: {
            quizIds: question.quizIds.map((id) => id.toString()),
            text: question.text,
            questionType: question.type,
            choices: question.choices,
            correctAnswer: question.correctAnswer,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
          },
        })),
      });
    } catch (error) {
      console.error("getQuestions error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: "An error occurred while fetching questions",
          },
        ],
      });
    }
  }

  public async updateQuestion(req: Request, res: Response) {
    try {
      const { quizIds, text, type, choices, correctAnswer } = req.body;

      const question = await QuestionModel.findByIdAndUpdate(
        req.params.id,
        { quizIds, text, type, choices, correctAnswer },
        { new: true, runValidators: true }
      );

      if (!question) {
        return res.status(StatusCodes.NOT_FOUND).json({
          errors: [
            {
              status: StatusCodes.NOT_FOUND.toString(),
              title: "Not Found",
              detail: `Question with id ${req.params.id} not found`,
            },
          ],
        });
      }

      res.status(StatusCodes.OK).json({
        data: {
          type: "questions",
          id: question._id.toString(),
          attributes: {
            quizIds: question.quizIds.map((id) => id.toString()),
            text: question.text,
            questionType: question.type,
            choices: question.choices,
            correctAnswer: question.correctAnswer,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
          },
        },
      });
    } catch (error) {
      console.error("updateQuestion error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: "An error occurred while updating the question",
          },
        ],
      });
    }
  }

  public async deleteQuestion(req: Request, res: Response) {
    try {
      const question = await QuestionModel.findByIdAndDelete(req.params.id);

      if (!question) {
        return res.status(StatusCodes.NOT_FOUND).json({
          errors: [
            {
              status: StatusCodes.NOT_FOUND.toString(),
              title: "Not Found",
              detail: `Question with id ${req.params.id} not found`,
            },
          ],
        });
      }

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      console.error("deleteQuestion error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: "An error occurred while deleting the question",
          },
        ],
      });
    }
  }
}
