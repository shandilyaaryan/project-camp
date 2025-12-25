import mongoose, { Document, Schema } from "mongoose";
import { AvailableRole } from "../utils";

export interface IProject extends Document {
  name: string;
  description?: string;
  owner: mongoose.Types.ObjectId;
  members: {
    userId: mongoose.Types.ObjectId;
    role: (typeof AvailableRole)[number];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, "Project Name is required"],
      trim: true,
      index: true,
      maxlength: [100, "Project name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Add index for queries
    },
    members: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: AvailableRole,
          default: "member",
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

export const ProjectModel = mongoose.model<IProject>("Project", projectSchema);
