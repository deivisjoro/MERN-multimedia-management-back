import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import initDb from './initDb.js';
import swaggerRoutes from './config/swagger.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import creatorRoutes from './routes/creatorRoutes.js';
import readerRoutes from './routes/readerRoutes.js';
import publicRoutes from './routes/publicRoutes.js';

dotenv.config();

const startServer = async () => {
  try {
    await connectDB();
    await initDb();

    const app = express();

    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use(cookieParser());
    app.use('/uploads', express.static('uploads'));

    app.use('/api/public', publicRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/user', userRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/creator', creatorRoutes);
    app.use('/api/reader', readerRoutes);
    app.use('/', swaggerRoutes);

    // Manejo de errores
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(err.status || 500).json({
        statusCode: err.status || 500,
        message: err.message || 'INTERNAL_SERVER_ERROR',
        data: null
      });
    })

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.error('Error starting server:', error.message);
    process.exit(1);
  }
};

startServer();

export default startServer;
