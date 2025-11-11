import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/error-handler.js';
import { authRoutes } from './routes/auth.js';
import { videoRoutes } from './routes/videos.js';
import { userRoutes } from './routes/users.js';
import { verificationRoutes } from './routes/verification.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fileUpload = require('express-fileupload');
const { config } = require('dotenv');

const app = express();
config();

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5175',
      'http://localhost:5173',
    ],
    credentials: true,
  })
);
app.use(errorHandler);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(fileUpload({ limits: { fileSize: 500 * 1024 * 1024 } }));

app.get('/health', (req, res) => {
  res.json({ error: null, data: { timestamp: Date.now() } });
});

app.use('/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/verify', verificationRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
