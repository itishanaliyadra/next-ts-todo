import { model, models, type Model, Schema } from "mongoose";

const todoSchema = new Schema(
  {
    task: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type TodoDocument = {
  task: string;
  userId: string;
  description: string;
  status: "Pending" | "Completed";
  priority: "Low" | "Medium" | "High";
  dueDate: Date | null;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type TodoModel = Model<TodoDocument>;

export const TodoModel =
  (models.Todo as TodoModel) || model<TodoDocument, TodoModel>("Todo", todoSchema);
