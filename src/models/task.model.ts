import mongoose, { Document, Schema } from "mongoose";
import { AvailableTaskPriority, AvailableTaskStatus } from "../utils";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: (typeof AvailableTaskStatus)[number];
  priority?: (typeof AvailableTaskPriority)[number];
  dueDate?: Date;
  project: mongoose.Types.ObjectId;
  assignee?: mongoose.Types.ObjectId;
  reporter: mongoose.Types.ObjectId;
  subtasks?: {
    title: string;
    isCompleted: boolean;
  }[];
  attachments?: {
    originalName: string,
    filename: string;
    url: string;
  }[];
}

export const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: AvailableTaskStatus,
      default: "todo",
      required: true,
    },
    priority: {
      type: String,
      enum: AvailableTaskPriority,
      index: true,
    },
    dueDate: {
      type: Date,
    },
    project: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Project",
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reporter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subtasks: [
      {
        title: { type: String, required: true },
        isCompleted: { type: Boolean, default: false },
      },
    ],
    attachments: [
      {
        originalName: String,
        filename: String,
        url: String,
      },
    ],
  },
  { timestamps: true },
);

export const TaskModel = mongoose.model<ITask>("Task", taskSchema);
