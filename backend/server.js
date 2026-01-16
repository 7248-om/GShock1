require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const admin = require('firebase-admin');

const connectDB = require('./src/config/db');
const routes = require('./src/routes');
const { notFoundHandler, errorHandler } = require('./src/middleware/error.middleware');

const app = express();

// ==========================================
// FIREBASE INITIALIZATION
// ==========================================
try {
  let serviceAccount;
  if (process.env.FIREBASE_CREDENTIALS) {
    serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
  } else {
    try {
      serviceAccount = require('./serviceAccountKey.json');
    } catch (err) {
      console.warn("⚠️ No Firebase credentials found.");
    }
  }

  if (serviceAccount && admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("✅ Firebase Admin Initialized");
  }
} catch (error) {
  console.error("❌ Firebase Init Error:", error.message);
}

// ==========================================
// SIMPLIFIED CORS (Allow All for Deployment)
// ==========================================
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(morgan('dev'));

// ==========================================
// HEALTH CHECK
// ==========================================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==========================================
// MAIN ROUTES
// ==========================================
app.use('/api', routes);

// ==========================================
// 🔥 GOOGLE REVIEWS ROUTE (ADDED – CORRECT PATH)
// ==========================================
app.use('/api', require('./src/routes/googleReviews.routes'));

// ==========================================
// ERROR HANDLERS
// ==========================================
app.use(notFoundHandler);
app.use(errorHandler);

// ==========================================
// SERVER START
// ==========================================
const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;