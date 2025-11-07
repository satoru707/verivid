import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/error-handler';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fileUpload = require('express-fileupload');
const { config } = require('dotenv');

config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(fileUpload({ limits: { fileSize: 500 * 1024 * 1024 } }));

app.get('/health', (req, res) => {
  res.json({ error: null, data: { timestamp: Date.now() } });
});

import { authRoutes } from './routes/auth';
import { videoRoutes } from './routes/videos';
import { userRoutes } from './routes/users';
import { verificationRoutes } from './routes/verification';

app.use('/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/verify', verificationRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
});
