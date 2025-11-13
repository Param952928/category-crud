import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type CategoryStatus = 'active' | 'inactive';

export interface ICategory extends Document {
  name: string;
  parent?: Types.ObjectId | null;
  status: CategoryStatus;
  ancestors: Types.ObjectId[];
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null, index: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
  ancestors: { type: [Schema.Types.ObjectId], ref: 'Category', default: [], index: true }
}, { timestamps: true });

CategorySchema.index({ name: 1, parent: 1 }, { unique: true });

export const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
