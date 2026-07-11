import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import schedulerRoutes from './routes/scheduler';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT ?? 3001;

// ─── Middleware ───────────────────────────────────────────────

app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'YourPilot API',
    engine: 'Pilot Engine v1.0',
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes ───────────────────────────────────────────────────

app.use('/api/scheduler', schedulerRoutes);

// TODO (next sessions):
// app.use('/api/tasks', taskRoutes);
// app.use('/api/sessions', sessionRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/auth', authRoutes);

// ─── Error Handler (must be last) ────────────────────────────

app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║     YourPilot API — Pilot Engine      ║
  ║     "Stop deciding. Start doing."     ║
  ╠═══════════════════════════════════════╣
  ║  Server  →  http://localhost:${PORT}     ║
  ║  Health  →  /health                   ║
  ║  Env     →  ${process.env.NODE_ENV ?? 'development'}              ║
  ╚═══════════════════════════════════════╝
  `);
});

export default app;
