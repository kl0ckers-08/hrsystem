import mongoose, { Schema, model, models } from "mongoose";

const StandardSchema = new Schema({
  role: String,
  minimumLevel: String,
  skills: [String]
});

export const Standard = models.Standard || model("Standard", StandardSchema);
