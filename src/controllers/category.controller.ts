import { Request, Response } from 'express';
import { createCategory, getCategoryTree, updateCategory, deleteCategory } from '../services/category.service.js';
import { categoryCreateBody, categoryUpdateBody } from '../validation/schemas.js';
import { sendError, sendSuccess } from '../utils/response.js';

export async function create(req: Request, res: Response) {
  const { error, value } = categoryCreateBody.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) return sendError(res, 'Validation error', 400, error.details);
  const { name, parentId, status } = value;
  const doc = await createCategory(name, parentId, status);
  return sendSuccess(res, 'Category created', doc, 201);
}

export async function list(req: Request, res: Response) {
  const tree = await getCategoryTree();
  return sendSuccess(res, 'Categories fetched', tree);
}

export async function update(req: Request, res: Response) {
  const { id } = req.params;
  const { error, value } = categoryUpdateBody.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) return sendError(res, 'Validation error', 400, error.details);
  const { name, status } = value;
  const updated = await updateCategory(id, { name, status });
  return sendSuccess(res, 'Category updated', updated);
}

export async function remove(req: Request, res: Response) {
  const { id } = req.params;
  const result = await deleteCategory(id);
  return sendSuccess(res, 'Category deleted', result);
}
