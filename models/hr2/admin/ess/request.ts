import mongoose, { Schema, model, Model } from "mongoose";

export interface IRequest {
  name: string;
  role: string;
  type: string;
  reason: string;
  status: "Approved" | "Pending" | "Rejected";
  submitted: string; // ISO date string
  processed?: string; // ISO date string
}

const requestSchema = new Schema<IRequest>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  type: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ["Approved", "Pending", "Rejected"], default: "Pending" },
  submitted: { type: String, required: true },
  processed: { type: String },
});

export const Request: Model<IRequest> = mongoose.models.Request || model<IRequest>("Request", requestSchema);
