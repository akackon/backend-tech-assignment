import type {Application, Request, Response} from "express";
import { StatusCodes } from "http-status-codes";

export class QuestionController {
  public createQuestion(req: Request, res: Response) {
    console.log("createQuestion", req.body);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  public getQuestionById(req: Request, res: Response) {
    console.log("getQuestionById", req.params.id);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  public getQuestions(req: Request, res: Response) {
    console.log("getQuestions");
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  public updateQuestion(req: Request, res: Response) {
    console.log("updateQuestion", req.params.id);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }

  public deleteQuestion(req: Request, res: Response) {
    console.log("deleteQuestion", req.params.id);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}