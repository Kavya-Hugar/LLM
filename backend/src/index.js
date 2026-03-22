const express = require('express');
const cors = require('./config/cors');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const config = require('./config');

const authRoutes = require('./modules/auth/authRoutes');
const userRoutes = require('./modules/users/userRoutes');
const subjectRoutes = require('./modules/subjects/subjectRoutes');
const sectionRoutes = require('./modules/sections/sectionRoutes');
const videoRoutes = require('./modules/videos/videoRoutes');
const progressRoutes = require('./modules/progress/progressRoutes');
const aiRoutes = require('./modules/ai/aiRoutes');

const app = express();

app.use(cors);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api', (req, res) => {
  res.json({
    message: 'AI-powered Learning Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      subjects: '/api/subjects',
      sections: '/api/sections',
      videos: '/api/videos',
      progress: '/api/progress',
      ai: '/api/ai',
      health: '/api/health'
    }
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = config.port || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 AI LMS Backend Server running on port ${PORT}`);
  console.log(`📚 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📖 API docs: http://localhost:${PORT}/api`);
});

const gracefulShutdown = (signal) => {
  console.log(`\n📡 Received ${signal}. Shutting down gracefully...`);
  
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('❌ Forced shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;
