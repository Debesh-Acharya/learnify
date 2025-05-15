// app/models/Resource.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description?: string;
  url: string;
  platform: string;
  type: string;
  isPaid: boolean;
  price?: number;
  duration?: string;
  difficulty?: string;
  topics: string[];
  ratings: {
    average: number;
    count: number;
  };
  popularity: number;
  thumbnailUrl?: string;
  dateIndexed: Date;
}

const ResourceSchema = new Schema<IResource>({
  title: { type: String, required: true },
  description: String,
  url: { type: String, required: true },
  platform: { type: String, required: true },
  type: { type: String, required: true }, // video, article, course, etc.
  isPaid: { type: Boolean, default: false },
  price: Number,
  duration: String,
  difficulty: String,
  topics: [String],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  popularity: { type: Number, default: 0 },
  thumbnailUrl: String,
  dateIndexed: { type: Date, default: Date.now },
});

// Create a compound index for faster searches
ResourceSchema.index({ title: 'text', description: 'text', topics: 'text' });

export default mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema);
