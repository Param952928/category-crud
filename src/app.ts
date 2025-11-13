import express from 'express';
import apiRoutes from './routes/index.js';

const app = express();
app.use(express.json());

app.get('/health', (_req: express.Request, res: express.Response) => {
  res.json({ ok: true });
});

app.use('/api', apiRoutes);

// Global error handler (minimal)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
});

export default app;
