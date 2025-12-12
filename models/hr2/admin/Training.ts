import mongoose, { Schema, model, Model } from "mongoose";

export interface ITraining {
  title: string;
  type: "Workshop" | "Seminar" | "Conference" | "Webinar";
  date: string; 
  time: string;
  location: string;
  facilitator: string;
  registered: number;
  capacity: number;
  completed?: boolean;
  rating?: number; 
}

const trainingSchema = new Schema<ITraining>({
  title: { type: String, required: true },
  type: { type: String, enum: ["Workshop","Seminar","Conference","Webinar"], required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  facilitator: { type: String, required: true },
  registered: { type: Number, default: 0 },
  capacity: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  rating: { type: Number, default: 0 }, 
});

export const Training: Model<ITraining> = mongoose.models.Training || model<ITraining>("Training", trainingSchema);
