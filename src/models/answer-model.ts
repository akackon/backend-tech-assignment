import mongoose, { Schema, Document } from "mongoose";

export interface IAnswer extends Document {
  sessionId: mongoose.Types.ObjectId;
  questionId: mongoose.Types.ObjectId;
  userAnswer: string; // For free-text or selected choice text
  selectedChoiceIndex?: number; // For multiple-choice questions
  isCorrect: boolean;
  pointsEarned: number;
  answeredAt: Date;
  timeSpentSeconds?: number;
  createdAt: Date;
  updatedAt: Date;
}

const answerSchema = new Schema<IAnswer>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "GameSession",
      required: true,
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    userAnswer: {
      type: String,
      required: true,
      trim: true,
    },
    selectedChoiceIndex: {
      type: Number,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    pointsEarned: {
      type: Number,
      default: 0,
    },
    answeredAt: {
      type: Date,
      default: Date.now,
    },
    timeSpentSeconds: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a question can only be answered once per session
answerSchema.index({ sessionId: 1, questionId: 1 }, { unique: true });

export const AnswerModel = mongoose.model<IAnswer>("Answer", answerSchema);
