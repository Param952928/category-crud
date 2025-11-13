import { Request, Response } from 'express';
import { User } from '../models/user.model.js';
import { signJwt } from '../utils/jwt.js';
import { authRegisterBody, authLoginBody } from '../validation/schemas.js';
import { sendError, sendSuccess } from '../utils/response.js';

export async function register(req: Request, res: Response) {
  const { error, value } = authRegisterBody.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) return sendError(res, 'Validation error', 400, error.details);
  const { email, password } = value;
  if (!email || !password) return sendError(res, 'email and password are required', 400);
  const existing = await User.findOne({ email });
  if (existing) return sendError(res, 'Email already registered', 409);
  const user = await User.create({ email, password });
  const token = signJwt({ id: user.id });
  return sendSuccess(res, 'Registered successfully', { token }, 201);
}

export async function login(req: Request, res: Response) {
  const { error, value } = authLoginBody.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) return sendError(res, 'Validation error', 400, error.details);
  const { email, password } = value;
  if (!email || !password) return sendError(res, 'email and password are required', 400);
  const user = await User.findOne({ email });
  if (!user) return sendError(res, 'Invalid credentials', 401);
  const ok = await user.comparePassword(password);
  if (!ok) return sendError(res, 'Invalid credentials', 401);
  const token = signJwt({ id: user.id });
  return sendSuccess(res, 'Login successful', { token });
}
