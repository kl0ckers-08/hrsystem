// models/CompetencyStandard.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ICompetencyStandard extends Document {
  role: string;
  minimumLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  skills: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const CompetencyStandardSchema = new Schema<ICompetencyStandard>({
  role: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  minimumLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate',
  },
  skills: {
    type: [String],
    required: true,
    validate: {
      validator: (v: string[]) => v.length > 0,
      message: 'At least one skill is required',
    },
  },
}, {
  timestamps: true, // automatically adds createdAt & updatedAt
});

export default mongoose.models.CompetencyStandard || 
  mongoose.model<ICompetencyStandard>('CompetencyStandard', CompetencyStandardSchema);