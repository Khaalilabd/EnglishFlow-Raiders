import { Router } from 'express';
import { register, login, refresh, validate } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.get('/validate', validate);

export default router;
