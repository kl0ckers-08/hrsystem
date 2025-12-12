import mongoose, { Schema, model, models } from "mongoose";

export interface IActivity {
    title: string;
    description: string;
    user: string; // User or Employee ID
    type: "application" | "interview" | "review" | "onboarding";
    createdAt?: Date;
}

const ActivitySchema = new Schema<IActivity>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: String, required: true },
    type: { type: String, enum: ["application","interview","review","onboarding"], required: true },
    createdAt: { type: Date, default: Date.now },
});

export default models.Activity || model<IActivity>("Activity", ActivitySchema);
