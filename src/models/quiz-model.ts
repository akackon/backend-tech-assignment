import mongoose, { Schema, Document } from "mongoose";

export interface IQuiz extends Document {
  title: string;
  description: string;
  instructions: string;
  pointsPerQuestion: number;
  createdAt: Date;
  updatedAt: Date;
}

const quizSchema = new Schema<IQuiz>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    instructions: {
      type: String,
      required: true,
      trim: true,
    },
    pointsPerQuestion: {
      type: Number,
      required: false,
      default: 10,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

export const QuizModel = mongoose.model<IQuiz>("Quiz", quizSchema);
