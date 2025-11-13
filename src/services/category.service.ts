import { Types } from 'mongoose';
import { Category, ICategory } from '../models/category.model.js';

export async function createCategory(name: string, parentId?: string | null, status: 'active' | 'inactive' = 'active') {
  let ancestors: Types.ObjectId[] = [];
  let parent: Types.ObjectId | null = null;
  if (parentId) {
    const parentDoc = await Category.findById(parentId);
    if (!parentDoc) throw Object.assign(new Error('Parent not found'), { status: 404 });
    ancestors = [...parentDoc.ancestors, parentDoc._id];
    parent = parentDoc._id;
  }
  const doc = await Category.create({ name, parent, status, ancestors });
  return doc;
}

export async function getCategoryTree() {
  const all = await Category.find().lean();
  const map = new Map<string, any>();
  all.forEach((c) => map.set(c._id.toString(), { ...c, children: [] }));
  const roots: any[] = [];
  all.forEach((c) => {
    const node = map.get(c._id.toString());
    if (c.parent) {
      const parent = map.get(c.parent.toString());
      if (parent) parent.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

export async function updateCategory(id: string, updates: Partial<Pick<ICategory, 'name' | 'status'>>) {
  const doc = await Category.findById(id);
  if (!doc) throw Object.assign(new Error('Category not found'), { status: 404 });

  const prevStatus = doc.status;
  if (updates.name !== undefined) doc.name = updates.name;
  if (updates.status !== undefined) doc.status = updates.status;
  await doc.save();

  if (prevStatus !== 'inactive' && doc.status === 'inactive') {
    await Category.updateMany({ ancestors: doc._id }, { $set: { status: 'inactive' } });
  }
  return doc;
}

export async function deleteCategory(id: string) {
  const doc = await Category.findById(id);
  if (!doc) throw Object.assign(new Error('Category not found'), { status: 404 });

  // Reassign immediate children to this doc's parent
  await Category.updateMany({ parent: doc._id }, { $set: { parent: doc.parent } });
  // Remove this id from all descendants' ancestors
  await Category.updateMany({ ancestors: doc._id }, { $pull: { ancestors: doc._id } });
  await Category.deleteOne({ _id: doc._id });
  return { ok: true };
}
