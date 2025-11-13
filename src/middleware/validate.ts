import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export function validateBody(schema: Joi.ObjectSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
      if (error) return res.status(400).json({ message: 'Validation error', details: error.details });
      req.body = value;
      next();
    } catch (err) {
      next(err);
    }
  };
}
