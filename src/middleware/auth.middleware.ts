import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt.js';

export function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const payload = verifyJwt<{ id: string }>(token);
    req.user = { id: payload.id };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
