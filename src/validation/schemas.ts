import Joi from 'joi';

export const authRegisterBody = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required()
});

export const authLoginBody = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required()
});

export const categoryCreateBody = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  parentId: Joi.string().hex().length(24).optional().allow(null),
  status: Joi.string().valid('active', 'inactive').optional()
});

export const categoryIdParams = Joi.object({
  id: Joi.string().hex().length(24).required()
});

export const categoryUpdateBody = Joi.object({
  name: Joi.string().min(1).max(200),
  status: Joi.string().valid('active', 'inactive')
}).or('name', 'status');
