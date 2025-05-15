// app/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  preferences: {
    topics: string[];
    resourceTypes: string[];
    platforms: string[];
  };
  savedResources: mongoose.Types.ObjectId[];
  searchHistory: {
    query: string;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    preferences: {
      topics: [String],
      resourceTypes: [String],
      platforms: [String],
    },
    savedResources: [{ type: Schema.Types.ObjectId, ref: 'Resource' }],
    searchHistory: [
      {
        query: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Check if the model already exists to prevent overwriting it
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
