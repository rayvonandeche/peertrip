import { createPool, createConnection } from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = createPool(dbConfig);

// Database initialization
async function initializeDatabase() {
  try {
    // First, create the database if it doesn't exist
    const tempConnection = await createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await tempConnection.end();
    
    console.log(`Database '${dbConfig.database}' created or already exists`);
    
    // Test connection with the pool
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database successfully');
    
    // Create tables
    await createTables();
    
    connection.release();
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}

// Create all necessary tables
async function createTables() {
  const tables = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      avatar VARCHAR(500),
      location VARCHAR(255),
      travel_style VARCHAR(100),
      budget_range VARCHAR(100),
      preferred_activities TEXT,
      interests TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    
    // Bookings table
    `CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      trip_id VARCHAR(100) NOT NULL,
      trip_title VARCHAR(255) NOT NULL,
      destination VARCHAR(255) NOT NULL,
      duration VARCHAR(100),
      price DECIMAL(10,2),
      currency VARCHAR(10) DEFAULT 'KSH',
      max_people INT DEFAULT 1,
      booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
      special_requests TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    
    // Chat history table
    `CREATE TABLE IF NOT EXISTS chat_history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      message TEXT NOT NULL,
      response TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    
    // User preferences table (for AI context)
    `CREATE TABLE IF NOT EXISTS user_preferences (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT UNIQUE NOT NULL,
      preferred_destinations TEXT,
      travel_frequency VARCHAR(50),
      group_size_preference VARCHAR(50),
      accommodation_preference VARCHAR(100),
      activity_level VARCHAR(50),
      cultural_interests TEXT,
      dietary_restrictions TEXT,
      accessibility_needs TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`
  ];
  
  for (const table of tables) {
    try {
      await pool.execute(table);
      console.log('Table created or already exists');
    } catch (error) {
      console.error('Error creating table:', error);
      throw error;
    }
  }
  
  // Insert sample data
  await insertSampleData();
}

// Insert sample data for testing
async function insertSampleData() {
  try {
    // Check if demo user already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      ['demo@peertrip.com']
    );
    
    if (existingUsers.length === 0) {
      // Insert demo users
      const demoUsers = [
        {
          email: 'demo@peertrip.com',
          password: '$2a$10$J6rUJJTib3vcrzHhrtBuVutj8pkhJtaiUAN9YNk0RIf/iuBWmHp1e', // demo123
          name: 'Demo User',
          location: 'Nairobi, Kenya',
          travel_style: 'Adventure',
          budget_range: '$500-$1000',
          preferred_activities: 'Safari, Hiking, Cultural Tours',
          interests: 'Wildlife, Photography, Local Cuisine'
        },
        {
          email: 'john@example.com',
          password: '$2a$10$J6rUJJTib3vcrzHhrtBuVutj8pkhJtaiUAN9YNk0RIf/iuBWmHp1e', // password123
          name: 'John Doe',
          location: 'Mombasa, Kenya',
          travel_style: 'Relaxation',
          budget_range: '$300-$700',
          preferred_activities: 'Beach, Diving, Sailing',
          interests: 'Marine Life, History, Architecture'
        }
      ];
      
      for (const user of demoUsers) {
        await pool.execute(
          'INSERT INTO users (email, password, name, location, travel_style, budget_range, preferred_activities, interests) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [user.email, user.password, user.name, user.location, user.travel_style, user.budget_range, user.preferred_activities, user.interests]
        );
      }
      
      console.log('Sample users inserted successfully');
    }
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
}

// Database query helpers
const db = {
  // Generic query method
  async query(sql, params = []) {
    try {
      const [results] = await pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },
  
  // Find user by email
  async findUserByEmail(email) {
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return users[0];
  },
  
  // Create new user
  async createUser(userData) {
    const { email, password, name, location } = userData;
    const [result] = await pool.execute(
      'INSERT INTO users (email, password, name, location) VALUES (?, ?, ?, ?)',
      [email, password, name, location || 'Kenya']
    );
    return result.insertId;
  },
  
  // Get user by ID
  async getUserById(id) {
    const [users] = await pool.execute(
      'SELECT id, email, name, avatar, location, travel_style, budget_range, preferred_activities, interests, created_at FROM users WHERE id = ?',
      [id]
    );
    return users[0];
  },
  
  // Update user profile
  async updateUserProfile(userId, updates) {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(userId);
    
    await pool.execute(
      `UPDATE users SET ${fields} WHERE id = ?`,
      values
    );
  },
  
  // Booking methods
  async createBooking(bookingData) {
    const { 
      userId, 
      tripId, 
      tripTitle, 
      destination, 
      duration, 
      price, 
      currency, 
      maxPeople, 
      bookingDate, 
      status = 'pending',
      specialRequests
    } = bookingData;
    
    // Ensure no undefined values
    const safeData = [
      userId,
      tripId || 'TRIP_' + Date.now(),
      tripTitle || 'Untitled Trip',
      destination || 'Unknown Destination',
      duration || '1 day',
      price || 0,
      currency || 'KSH',
      maxPeople || 1,
      bookingDate || new Date(),
      status,
      specialRequests || null
    ];
    
    const [result] = await pool.execute(
      `INSERT INTO bookings (
        user_id, 
        trip_id, 
        trip_title, 
        destination, 
        duration, 
        price, 
        currency, 
        max_people, 
        booking_date, 
        status,
        special_requests
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      safeData
    );
    return result.insertId;
  },
  
  async getUserBookings(userId) {
    const [bookings] = await pool.execute(
      'SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return bookings;
  },
  
  async getRecentBookings(userId, limit = 5) {
    const [bookings] = await pool.execute(
      'SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
      [userId, limit]
    );
    return bookings;
  },
  
  // Chat history methods
  async saveChatHistory(userId, message, response) {
    await pool.execute(
      'INSERT INTO chat_history (user_id, message, response) VALUES (?, ?, ?)',
      [userId, message, response]
    );
  },
  
  async getUserChatHistory(userId, limit = 10) {
    const [history] = await pool.execute(
      'SELECT * FROM chat_history WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
      [userId, limit]
    );
    return history;
  },
  
  // User preferences methods
  async updateUserPreferences(userId, preferences) {
    await pool.execute(
      `INSERT INTO user_preferences (user_id, preferred_destinations, travel_frequency, group_size_preference, accommodation_preference, activity_level, cultural_interests, dietary_restrictions, accessibility_needs) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       preferred_destinations = VALUES(preferred_destinations),
       travel_frequency = VALUES(travel_frequency),
       group_size_preference = VALUES(group_size_preference),
       accommodation_preference = VALUES(accommodation_preference),
       activity_level = VALUES(activity_level),
       cultural_interests = VALUES(cultural_interests),
       dietary_restrictions = VALUES(dietary_restrictions),
       accessibility_needs = VALUES(accessibility_needs)`,
      [userId, preferences.preferredDestinations, preferences.travelFrequency, preferences.groupSizePreference, preferences.accommodationPreference, preferences.activityLevel, preferences.culturalInterests, preferences.dietaryRestrictions, preferences.accessibilityNeeds]
    );
  },
  
  async getUserPreferences(userId) {
    const [preferences] = await pool.execute(
      'SELECT * FROM user_preferences WHERE user_id = ?',
      [userId]
    );
    return preferences[0];
  }
};

export default { initializeDatabase, db };
