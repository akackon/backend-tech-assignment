import mongoose, { Schema, Document } from "mongoose";

export type QuestionType = "free-text" | "multiple-choice";

export interface IChoice {
  text: string;
  isCorrect: boolean;
}

export interface IQuestion extends Document {
  quizIds: mongoose.Types.ObjectId[];
  text: string;
  type: QuestionType;
  choices?: IChoice[];
  correctAnswer?: string;
  createdAt: Date;
  updatedAt: Date;
}

const choiceSchema = new Schema<IChoice>(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { _id: false }
);

const questionSchema = new Schema<IQuestion>(
  {
    quizIds: {
      type: [Schema.Types.ObjectId],
      ref: "Quiz",
      default: [],
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["free-text", "multiple-choice"],
      required: true,
    },
    choices: {
      type: [choiceSchema],
      required: function (this: IQuestion) {
        return this.type === "multiple-choice";
      },
    },
    correctAnswer: {
      type: String,
      required: function (this: IQuestion) {
        return this.type === "free-text";
      },
    },
  },
  {
    timestamps: true,
  }
);

export const QuestionModel = mongoose.model<IQuestion>(
  "Question",
  questionSchema
);
