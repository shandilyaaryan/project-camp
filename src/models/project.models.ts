import mongoose, { Document, Schema } from "mongoose";

export interface IProject extends Document {
  name: string;
  description?: string;
  owner: mongoose.Types.ObjectId;
  members: {
    userId: mongoose.Types.ObjectId;
    role: "admin" | "project_admin" | "member";
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
    },
    description: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
          enum: ["admin", "project_admin", "member"],
          default: "member",
        },
      },
    ],
  },
  { timestamps: true }
);

export const ProjectModel = mongoose.model<IProject>("Project", projectSchema);
