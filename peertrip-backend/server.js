const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { initializeDatabase, db } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Initialize database on server start
async function startServer() {
  try {
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      console.error('Failed to initialize database');
      process.exit(1);
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 PeerTrip Backend Server running on port ${PORT}`);
      console.log(`📊 Database: MySQL (${process.env.DB_NAME})`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'PeerTrip Backend API is running',
    timestamp: new Date().toISOString(),
    database: 'MySQL'
  });
});

// Auth Routes

// Sign up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, location } = req.body;

    // Check if user already exists
    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = await db.createUser({
      name,
      email,
      password: hashedPassword,
      location
    });

    // Generate JWT token
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

    // Get user data (without password)
    const user = await db.getUserById(userId);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user,
      token
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Sign in
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Signed in successfully',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get user profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await db.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Booking Routes

// Create booking
app.post('/api/bookings', authenticateToken, async (req, res) => {
  try {
    console.log('Raw request body:', req.body);
    
    // Handle both old format (tripId, tripTitle...) and new format (destinationId, destinationName...)
    const { 
      // New format fields
      destinationId,
      destinationName,
      category,
      startDate,
      endDate,
      guests,
      totalPrice,
      specialRequests,
      // Old format fields (for backward compatibility)
      tripId, 
      tripTitle, 
      destination, 
      duration, 
      price, 
      currency, 
      maxPeople, 
      bookingDate, 
      status 
    } = req.body;

    // Map new format to old format for consistency
    const rawBookingDate = bookingDate || startDate || new Date().toISOString();
    const formattedBookingDate = new Date(rawBookingDate)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    const mappedData = {
      tripId: tripId || destinationId?.toString() || 'TRIP_' + Date.now(),
      tripTitle: tripTitle || destinationName || 'Travel Experience',
      destination: destination || destinationName || 'Kenya',
      duration: duration || (startDate && endDate ? 
        `${Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))} days` : 
        '1 day'),
      price: price || totalPrice || 0,
      currency: currency || 'KSH',
      maxPeople: maxPeople || guests || 1,
      bookingDate: formattedBookingDate,
      status: status || 'pending'
    };

    console.log('DEBUG - Raw values:');
    console.log('destinationId:', destinationId);
    console.log('destinationName:', destinationName);
    console.log('totalPrice:', totalPrice);
    console.log('guests:', guests);
    console.log('startDate:', startDate);
    console.log('endDate:', endDate);
    console.log('');
    console.log('DEBUG - Mapped values:');
    console.log('mappedData:', mappedData);

    // Log the mapped data for debugging
    console.log('Creating booking with mapped data:', {
      userId: req.user.userId,
      ...mappedData
    });
    
    // Validate required fields
    if (!mappedData.tripTitle || !mappedData.destination) {
      return res.status(400).json({
        success: false,
        message: 'Trip title and destination are required'
      });
    }

    const bookingId = await db.createBooking({
      userId: req.user.userId,
      tripId: mappedData.tripId,
      tripTitle: mappedData.tripTitle,
      destination: mappedData.destination,
      duration: mappedData.duration,
      price: mappedData.price,
      currency: mappedData.currency,
      maxPeople: mappedData.maxPeople,
      bookingDate: mappedData.bookingDate,
      status: mappedData.status,
      specialRequests: specialRequests || null
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      bookingId
    });

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create booking' 
    });
  }
});

// Get user bookings
app.get('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await db.getUserBookings(req.user.userId);

    res.json({
      success: true,
      bookings
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch bookings' 
    });
  }
});

// AI Context Routes

// Save chat history
app.post('/api/ai/chat', authenticateToken, async (req, res) => {
  try {
    const { message, response } = req.body;

    await db.saveChatHistory(req.user.userId, message, response);

    res.json({
      success: true,
      message: 'Chat history saved'
    });

  } catch (error) {
    console.error('Chat save error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to save chat history' 
    });
  }
});

// Get AI context for user
app.get('/api/ai/context', authenticateToken, async (req, res) => {
  try {
    const user = await db.getUserById(req.user.userId);
    const recentBookings = await db.getRecentBookings(req.user.userId, 5);
    const chatHistory = await db.getUserChatHistory(req.user.userId, 10);
    const preferences = await db.getUserPreferences(req.user.userId);

    res.json({
      success: true,
      data: {
        userContext: {
          ...user,
          preferences
        },
        recentBookings,
        chatHistory
      }
    });

  } catch (error) {
    console.error('AI context error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get AI context' 
    });
  }
});

// Demo data routes (for development)
app.get('/api/destinations', (req, res) => {
  // Return sample destinations data
  const destinations = [
    {
      id: 1,
      name: "Maasai Mara National Reserve",
      category: "safari",
      location: "Narok County, Kenya",
      price: 150,
      rating: 4.8,
      image: "/images/maasai-mara.jpg",
      description: "Experience the world's most spectacular wildlife migration"
    },
    {
      id: 2,
      name: "Diani Beach",
      category: "beach",
      location: "Kwale County, Kenya",
      price: 80,
      rating: 4.6,
      image: "/images/diani-beach.jpg",
      description: "Pristine white sand beaches and crystal clear waters"
    }
  ];

  res.json({
    success: true,
    destinations
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Start the server
startServer();
