import mongoose, { Schema, model, models } from "mongoose";

export interface ITask {
    title: string;
    assignedTo: string; // Employee name or ID
    status: "completed" | "inProgress" | "pending";
    dueDate?: Date;
    createdAt?: Date;
}

const TaskSchema = new Schema<ITask>({
    title: { type: String, required: true },
    assignedTo: { type: String, required: true },
    status: { type: String, enum: ["completed","inProgress","pending"], default: "pending" },
    dueDate: Date,
    createdAt: { type: Date, default: Date.now },
});

export default models.Task || model<ITask>("Task", TaskSchema);
