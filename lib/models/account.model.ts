import { model, models, type Model, Schema } from "mongoose";

const accountSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type AccountDocument = {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

type AccountModel = Model<AccountDocument>;

export const AccountModel =
  (models.Account as AccountModel) || model<AccountDocument, AccountModel>("Account", accountSchema);
