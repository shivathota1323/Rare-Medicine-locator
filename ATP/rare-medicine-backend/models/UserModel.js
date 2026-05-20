import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["USER", "PHARMACY", "ADMIN"],
      default: "USER"
    },
    phone: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

export const UserModel = model("User", userSchema);
