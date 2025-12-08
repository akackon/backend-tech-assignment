import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class QuizController {
  public createQuiz(req: Request, res: Response) {
    console.log("createQuiz", req.body);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  public getQuizById(req: Request, res: Response) {
    console.log("getQuizById", req.params.id);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  public getQuizzes(req: Request, res: Response) {
      console.log("getQuizzes");
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  public updateQuiz(req: Request, res: Response) {
    console.log("updateQuiz", req.params.id);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  public deleteQuiz(req: Request, res: Response) {
    console.log("deleteQuiz", req.params.id);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}