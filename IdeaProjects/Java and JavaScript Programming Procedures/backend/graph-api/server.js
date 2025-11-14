import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import routes
import cityRoutes from './src/routes/cityRoutes.js';
import distanceRoutes from './src/routes/distanceRoutes.js';
import graphRoutes from './src/routes/graphRoutes.js';

// Import database connection test
import { testConnection } from './src/config/database.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:8080',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8080'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Graph API is running',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/cities', cityRoutes);
app.use('/api/distances', distanceRoutes);
app.use('/api/graph', graphRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Graph API',
    version: '1.0.0',
    endpoints: {
      cities: '/api/cities',
      distances: '/api/distances',
      graph: '/api/graph',
      health: '/health'
    },
    documentation: {
      cities: {
        'GET /api/cities': 'Get all cities',
        'GET /api/cities/:id': 'Get city by ID',
        'GET /api/cities/search?q=:searchTerm': 'Search cities',
        'GET /api/cities/stats': 'Get city statistics',
        'GET /api/cities/connections': 'Get cities with connections',
        'POST /api/cities': 'Create new city',
        'PUT /api/cities/:id': 'Update city',
        'DELETE /api/cities/:id': 'Delete city'
      },
      distances: {
        'GET /api/distances': 'Get all distances',
        'GET /api/distances/:id': 'Get distance by ID',
        'GET /api/distances/cities/:city1Id/:city2Id': 'Get distance between cities',
        'GET /api/distances/cities-by-name?city1=:name1&city2=:name2': 'Get distance by city names',
        'GET /api/distances/city/:cityId/connections': 'Get city connections',
        'GET /api/distances/city/:cityId/nearby?maxDistance=:distance': 'Get nearby cities',
        'GET /api/distances/stats': 'Get distance statistics',
        'GET /api/distances/routes': 'Get all routes for visualization',
        'POST /api/distances': 'Create new distance',
        'PUT /api/distances/:id': 'Update distance',
        'DELETE /api/distances/:id': 'Delete distance'
      },
      graph: {
        'GET /api/graph': 'Get graph data for visualization',
        'GET /api/graph/matrix': 'Get adjacency matrix',
        'GET /api/graph/adjacency-list': 'Get adjacency list',
        'GET /api/graph/shortest-path?from=:city1&to=:city2': 'Find shortest path',
        'GET /api/graph/stats': 'Get graph statistics'
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Handle specific error types
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON payload'
    });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'Payload too large'
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    timestamp: new Date(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server with database connection test
async function startServer() {
  try {
    // Test database connection first
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.log('⚠️  Starting server without database connection');
    }
    
    app.listen(PORT, () => {
      console.log(`\n🚀 Graph API Server Running`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Server: http://localhost:${PORT}`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/`);
      console.log(`\n📋 Available Endpoints:`);
      console.log(`   • Distances: http://localhost:${PORT}/api/distances`);
      console.log(`   • Graph: http://localhost:${PORT}/api/graph`);
      console.log(`\n⚡ Ready to handle requests!`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Start the server
startServer();

export default app;