import { Router } from 'express';
import { register, login, refresh, validate, getAllUsers, approveStudent } from '../controllers/auth.controller';
import prisma from '../config/database';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.get('/validate', validate);
router.get('/users', getAllUsers);
router.post('/users/:userId/approve', approveStudent);

// Endpoint de test pour vérifier les utilisateurs en base
router.get('/users/debug', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ count: users.length, users });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
