const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Controllers
const authController = require('./controllers/auth.controller');
const listingController = require('./controllers/listing.controller');

// Middleware
const authMiddleware = require('./middleware/auth.middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://realapp.ru', 'https://www.realapp.ru']
    : ['http://localhost:3000', 'http://localhost:8081'],
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', authMiddleware, authController.getProfile);
app.put('/api/auth/profile', authMiddleware, authController.updateProfile);
app.put('/api/auth/password', authMiddleware, authController.changePassword);

// User routes
app.get('/api/users/:id', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        avatar: true,
        rating: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения пользователя' });
  }
});

// Listing routes
app.get('/api/listings', listingController.getListings);
app.get('/api/listings/:id', listingController.getListing);
app.post('/api/listings', authMiddleware, listingController.createListing);
app.put('/api/listings/:id', authMiddleware, listingController.updateListing);
app.delete('/api/listings/:id', authMiddleware, listingController.deleteListing);

// Favorites
app.post('/api/favorites', authMiddleware, listingController.addToFavorites);
app.delete('/api/favorites/:listingId', authMiddleware, listingController.removeFromFavorites);
app.get('/api/favorites', authMiddleware, async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: {
        listing: {
          include: {
            photos: { where: { isPrimary: true }, take: 1 },
            owner: {
              select: { id: true, name: true, rating: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(favorites.map(f => f.listing));
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения избранных' });
  }
});

// Messages
app.get('/api/messages', authMiddleware, async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id },
          { receiverId: req.user.id },
        ],
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } },
        listing: { select: { id: true, title: true, primaryPhoto: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения сообщений' });
  }
});

app.post('/api/messages', authMiddleware, async (req, res) => {
  try {
    const { receiverId, listingId, content } = req.body;

    const message = await prisma.message.create({
      data: {
        senderId: req.user.id,
        receiverId,
        listingId,
        content,
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        listing: { select: { id: true, title: true } },
      },
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка отправки сообщения' });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Внутренняя ошибка сервера',
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend server running on http://0.0.0.0:${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
});
