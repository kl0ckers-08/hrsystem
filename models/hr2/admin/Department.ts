import mongoose, { Schema, model, models } from "mongoose";

export interface IDepartment {
    name: string;
    totalEmployees: number;
    completedTrainings: number;
    createdAt?: Date;
}

const DepartmentSchema = new Schema<IDepartment>({
    name: { type: String, required: true, unique: true },
    totalEmployees: { type: Number, default: 0 },
    completedTrainings: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

export default models.Department || model<IDepartment>("Department", DepartmentSchema);
