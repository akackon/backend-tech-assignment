import mongoose, { Schema, Document } from "mongoose";

export type GameSessionStatus = "in-progress" | "completed" | "abandoned";

export interface IGameSession extends Document {
  quizId: mongoose.Types.ObjectId;
  playerName: string;
  playerEmail?: string;
  status: GameSessionStatus;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  startedAt: Date;
  completedAt?: Date;
  timeSpentSeconds?: number;
  createdAt: Date;
  updatedAt: Date;
}

const gameSessionSchema = new Schema<IGameSession>(
  {
    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    playerName: {
      type: String,
      required: true,
      trim: true,
    },
    playerEmail: {
      type: String,
      trim: true,
      lowercase: true,
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
    totalQuestions: {
      type: Number,
      default: 0,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    timeSpentSeconds: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Index for leaderboard queries
gameSessionSchema.index({ quizId: 1, score: -1 });
gameSessionSchema.index({ playerEmail: 1 });

export const GameSessionModel = mongoose.model<IGameSession>(
  "GameSession",
  gameSessionSchema
);
