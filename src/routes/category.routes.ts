import { Router } from 'express';
import { auth } from '../middleware/auth.middleware.js';
import { create, list, update, remove } from '../controllers/category.controller.js';

const router = Router();
router.post('/', auth, create);
router.get('/', auth, list);
router.put('/:id', auth, update);
router.delete('/:id', auth, remove);

export default router;
