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

    // Authentifier avec Keycloak
    const tokens = await keycloakService.login(username, password);

    // Récupérer les infos utilisateur depuis Keycloak
    const keycloakUser = await keycloakService.getUserInfo(tokens.accessToken);

    // Chercher ou créer l'utilisateur dans notre base
    let user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      // Si l'utilisateur n'existe pas, le créer
      user = await prisma.user.create({
        data: {
          username,
          email: keycloakUser.email || `${username}@englishflow.com`,
          keycloakId: keycloakUser.sub,
          firstName: keycloakUser.given_name,
          lastName: keycloakUser.family_name,
        },
      });
    } else if (!user.keycloakId) {
      // Mettre à jour le keycloakId si nécessaire
      user = await prisma.user.update({
        where: { id: user.id },
        data: { keycloakId: keycloakUser.sub },
      });
    }

    // Retourner les tokens et les infos utilisateur
    res.json({
      ...tokens,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
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
