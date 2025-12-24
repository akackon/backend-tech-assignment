import mongoose, { Schema, Document } from "mongoose";

export type AttemptStatus = "in-progress" | "completed" | "abandoned";

export interface IAnswer {
  questionId: mongoose.Types.ObjectId;
  answer: string;
  isCorrect: boolean;
  answeredAt: Date;
}

export interface IQuizAttempt extends Document {
  quizId: mongoose.Types.ObjectId;
  status: AttemptStatus;
  score: number;
  answers: IAnswer[];
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const answerSchema = new Schema<IAnswer>(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    answeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const quizAttemptSchema = new Schema<IQuizAttempt>(
  {
    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    status: {
      type: String,
      enum: ["in-progress", "completed", "abandoned"],
      default: "in-progress",
    },
    score: {
      type: Number,
      default: 0,
    },
    answers: {
      type: [answerSchema],
      default: [],
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for queries by quiz
quizAttemptSchema.index({ quizId: 1, score: -1 });

export const QuizAttemptModel = mongoose.model<IQuizAttempt>(
  "QuizAttempt",
  quizAttemptSchema
);
