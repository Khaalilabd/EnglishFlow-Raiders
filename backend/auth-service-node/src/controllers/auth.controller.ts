import { Request, Response } from 'express';
import { KeycloakService } from '../services/keycloak.service';
import { StudentService } from '../services/student.service';
import prisma from '../config/database';

const keycloakService = new KeycloakService();
const studentService = new StudentService();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password, firstName, lastName } = req.body;

    const keycloakUser = await keycloakService.createUser({
      email,
      username,
      password,
      firstName,
      lastName,
    });

    const user = await prisma.user.create({
      data: {
        email,
        username,
        keycloakId: keycloakUser.id,
      },
    });

    await studentService.createStudent({
      userId: user.id,
      email,
      firstName,
      lastName,
    });

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const tokens = await keycloakService.login(username, password);

    res.json(tokens);
  } catch (error: any) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    const tokens = await keycloakService.refreshToken(refreshToken);

    res.json(tokens);
  } catch (error: any) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

export const validate = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const isValid = await keycloakService.validateToken(token);

    res.json({ valid: isValid });
  } catch (error: any) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
