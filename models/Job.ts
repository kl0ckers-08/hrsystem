// models/Job.ts
import mongoose, { Schema, model, models } from "mongoose";

export interface JobDocument {
    title: string;
    department: string;
    employmentType: string;
    location: string;
    deadline: Date;
    description?: string;
    qualifications?: string[];
    requirements?: string[];
    views?: number;
    applicants?: number;
    status?: string;
}

const JobSchema = new Schema<JobDocument>({
    title: { type: String, required: true },
    department: { type: String, required: true },
    employmentType: { type: String, required: true },
    location: { type: String, required: true },
    deadline: { type: Date, required: true },
    description: { type: String },
    qualifications: { type: [String] },
    requirements: { type: [String] },
    views: { type: Number, default: 0 },
    applicants: { type: Number, default: 0 },
    status: { type: String, default: "Active" },
}, { timestamps: true });

export const Job = models.jobposting || model<JobDocument>("jobposting", JobSchema);
