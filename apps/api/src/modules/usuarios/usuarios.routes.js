import { Router } from 'express';
import { login } from './usuarios.controller.js';

const router = Router();

router.post('/login', login);

export default router;