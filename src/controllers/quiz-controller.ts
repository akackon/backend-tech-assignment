import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { QuizModel } from "../models/quiz-model.js";
import { QuestionModel } from "../models/question-model.js";

export class QuizController {
  public async createQuiz(req: Request, res: Response) {
    try {
      const { title, description, instructions, pointsPerQuestion } = req.body;

      if (!title || !description || !instructions) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          errors: [
            {
              status: StatusCodes.BAD_REQUEST.toString(),
              title: "Validation Error",
              detail: "title, description, and instructions are required",
            },
          ],
        });
      }

      const quiz = await QuizModel.create({
        title,
        description,
        instructions,
        pointsPerQuestion,
      });

      res.status(StatusCodes.CREATED).json({
        data: {
          type: "quizzes",
          id: quiz._id.toString(),
          attributes: {
            title: quiz.title,
            description: quiz.description,
            instructions: quiz.instructions,
            pointsPerQuestion: quiz.pointsPerQuestion,
            createdAt: quiz.createdAt,
            updatedAt: quiz.updatedAt,
          },
        },
      });
    } catch (error) {
      console.error("createQuiz error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: "An error occurred while creating the quiz",
          },
        ],
      });
    }
  }

  public async getQuizById(req: Request, res: Response) {
    try {
      const { include } = req.query;
      const quiz = await QuizModel.findById(req.params.id);

      if (!quiz) {
        return res.status(StatusCodes.NOT_FOUND).json({
          errors: [
            {
              status: StatusCodes.NOT_FOUND.toString(),
              title: "Not Found",
              detail: `Quiz with id ${req.params.id} not found`,
            },
          ],
        });
      }

      const response: any = {
        data: {
          type: "quizzes",
          id: quiz._id.toString(),
          attributes: {
            title: quiz.title,
            description: quiz.description,
            instructions: quiz.instructions,
            pointsPerQuestion: quiz.pointsPerQuestion,
            createdAt: quiz.createdAt,
            updatedAt: quiz.updatedAt,
          },
        },
      };

      // Include questions if requested
      if (include === "questions") {
        const questions = await QuestionModel.find({ quizIds: quiz._id });
        response.data.relationships = {
          questions: {
            data: questions.map((q) => ({
              type: "questions",
              id: q._id.toString(),
            })),
          },
        };
        response.included = questions.map((question) => ({
          type: "questions",
          id: question._id.toString(),
          attributes: {
            text: question.text,
            questionType: question.type,
            choices: question.choices,
            correctAnswer: question.correctAnswer,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
          },
        }));
      }

      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      console.error("getQuizById error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: "An error occurred while fetching the quiz",
          },
        ],
      });
    }
  }

  public async getQuizzes(req: Request, res: Response) {
    try {
      const quizzes = await QuizModel.find();

      res.status(StatusCodes.OK).json({
        data: quizzes.map((quiz) => ({
          type: "quizzes",
          id: quiz._id.toString(),
          attributes: {
            title: quiz.title,
            description: quiz.description,
            instructions: quiz.instructions,
            pointsPerQuestion: quiz.pointsPerQuestion,
            createdAt: quiz.createdAt,
            updatedAt: quiz.updatedAt,
          },
        })),
      });
    } catch (error) {
      console.error("getQuizzes error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: "An error occurred while fetching quizzes",
          },
        ],
      });
    }
  }

  public async updateQuiz(req: Request, res: Response) {
    try {
      const { title, description, instructions, pointsPerQuestion } = req.body;

      const quiz = await QuizModel.findByIdAndUpdate(
        req.params.id,
        { title, description, instructions, pointsPerQuestion },
        { new: true, runValidators: true }
      );

      if (!quiz) {
        return res.status(StatusCodes.NOT_FOUND).json({
          errors: [
            {
              status: StatusCodes.NOT_FOUND.toString(),
              title: "Not Found",
              detail: `Quiz with id ${req.params.id} not found`,
            },
          ],
        });
      }

      res.status(StatusCodes.OK).json({
        data: {
          type: "quizzes",
          id: quiz._id.toString(),
          attributes: {
            title: quiz.title,
            description: quiz.description,
            instructions: quiz.instructions,
            pointsPerQuestion: quiz.pointsPerQuestion,
            createdAt: quiz.createdAt,
            updatedAt: quiz.updatedAt,
          },
        },
      });
    } catch (error) {
      console.error("updateQuiz error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: "An error occurred while updating the quiz",
          },
        ],
      });
    }
  }

  public async deleteQuiz(req: Request, res: Response) {
    try {
      const quiz = await QuizModel.findByIdAndDelete(req.params.id);

      if (!quiz) {
        return res.status(StatusCodes.NOT_FOUND).json({
          errors: [
            {
              status: StatusCodes.NOT_FOUND.toString(),
              title: "Not Found",
              detail: `Quiz with id ${req.params.id} not found`,
            },
          ],
        });
      }

      // Remove this quiz ID from all questions that reference it
      await QuestionModel.updateMany(
        { quizIds: req.params.id },
        { $pull: { quizIds: req.params.id } }
      );

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      console.error("deleteQuiz error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: "An error occurred while deleting the quiz",
          },
        ],
      });
    }
  }

  public async getQuizQuestions(req: Request, res: Response) {
    try {
      // First verify the quiz exists
      const quiz = await QuizModel.findById(req.params.id);

      if (!quiz) {
        return res.status(StatusCodes.NOT_FOUND).json({
          errors: [
            {
              status: StatusCodes.NOT_FOUND.toString(),
              title: "Not Found",
              detail: `Quiz with id ${req.params.id} not found`,
            },
          ],
        });
      }

      // Get all questions for this quiz
      const questions = await QuestionModel.find({ quizIds: req.params.id });

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
      console.error("getQuizQuestions error:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            status: StatusCodes.INTERNAL_SERVER_ERROR.toString(),
            title: "Internal Server Error",
            detail: "An error occurred while fetching quiz questions",
          },
        ],
      });
    }
  }
}
