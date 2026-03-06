import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// TODO: подключить маршруты
// app.use('/api/v1/news', newsRouter);
// app.use('/api/v1/trends', trendsRouter);
// app.use('/api/v1/chat', chatRouter);
// app.use('/api/v1/map', mapRouter);
// app.use('/api/v1/auth', authRouter);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`API server running on port ${config.port}`);
});

export { app };
