import { Request, Response } from 'express';
import { KeycloakService } from '../services/keycloak.service';
import { StudentService } from '../services/student.service';
import prisma from '../config/database';

const keycloakService = new KeycloakService();
const studentService = new StudentService();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password, firstName, lastName } = req.body;

    console.log('Registration request received for:', username);

    // Créer l'utilisateur dans Keycloak
    const keycloakUser = await keycloakService.createUser({
      email,
      username,
      password,
      firstName,
      lastName,
    });

    console.log('User created in Keycloak with ID:', keycloakUser.id);

    // Créer l'utilisateur dans notre base de données
    const user = await prisma.user.create({
      data: {
        email,
        username,
        keycloakId: keycloakUser.id,
        firstName,
        lastName,
      },
    });

    console.log('User created in database with ID:', user.id);

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error: any) {
    console.error('Registration error:', error.message);
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

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const approveStudent = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Vérifier si l'étudiant existe déjà dans le student-service
    try {
      const existingStudents = await studentService.getStudentByEmail(user.email);
      if (existingStudents) {
        return res.status(400).json({ error: 'Student already approved' });
      }
    } catch (checkError) {
      // L'étudiant n'existe pas, on peut continuer
    }

    // Créer le profil étudiant dans le student-service
    try {
      await studentService.createStudent({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });

      res.json({ message: 'Student approved successfully' });
    } catch (studentError: any) {
      console.error('Failed to create student profile:', studentError);
      
      // Vérifier si c'est une erreur de duplication
      if (studentError.response?.status === 409 || studentError.message?.includes('duplicate')) {
        return res.status(400).json({ error: 'Student already exists' });
      }
      
      res.status(500).json({ error: 'Failed to create student profile: ' + studentError.message });
    }
  } catch (error: any) {
    console.error('Error approving student:', error);
    res.status(500).json({ error: 'Failed to approve student: ' + error.message });
  }
};
