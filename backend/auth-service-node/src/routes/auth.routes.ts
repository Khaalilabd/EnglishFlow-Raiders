import { Router } from 'express';
import { register, login, refresh, validate } from '../controllers/auth.controller';
import prisma from '../config/database';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.get('/validate', validate);

// Endpoint de test pour vérifier les utilisateurs en base
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ count: users.length, users });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
