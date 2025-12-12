// models/User.ts
import { Schema, model, models } from "mongoose";

export type UserRole = 
  | "employee1"
  | "hr1admin"
  | "hr2admin"
  | "hr3admin"
  | "dead"
  | "superadmin";

interface IUser {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["employee1", "hr1admin", "hr2admin", "hr3admin", "dead", "superadmin"],
      default: "employee1",
    },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>("User", UserSchema);
