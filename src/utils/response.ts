import { Response } from 'express';

export interface ApiSuccess<T = any> {
  status: boolean;
  message: string;
  data?: T;
}

export interface ApiError {
  status: boolean;
  message: string;
  details?: any;
}

export function sendSuccess<T>(res: Response, message: string, data?: T, code = 200) {
  const payload: ApiSuccess<T> = { status: true, message };
  if (data !== undefined) payload.data = data;
  return res.status(code).json(payload);
}

export function sendError(res: Response, message: string, code = 400, details?: any) {
  const payload: ApiError = { status: false, message };
  if (details !== undefined) payload.details = details;
  return res.status(code).json(payload);
}
