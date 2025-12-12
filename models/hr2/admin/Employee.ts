import mongoose, { Schema, model, models } from "mongoose";

const EmployeeSchema = new Schema({
  name: String,
  department: String,
  role: String,
  competencyScore: Number,
  skillProgress: Number,
  overallProgress: Number,
  lastAssessed: Date,
  status: { type: String, enum: ['Competent','Needs Improvement','Not Yet Assessed','Pending Assessment'], default: 'Not Yet Assessed' },
  skills: [{ name: String, score: Number }],
  trainings: [{ name: String, completedDate: Date, score: Number }]
});

export const Employee = models.Employee || model("Employee", EmployeeSchema);
