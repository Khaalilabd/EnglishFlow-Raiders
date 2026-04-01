import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import { registerWithEureka } from './config/eureka';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Pas de CORS ici - géré par l'API Gateway
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
  registerWithEureka();
});
