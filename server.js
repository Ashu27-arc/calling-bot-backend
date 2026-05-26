require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Configure Socket.io
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://calling-bot-frontend.vercel.app'
    ],
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://calling-bot-frontend.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pass io to the request object so routes can use it
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Basic Routes
app.get('/', (req, res) => {
  res.send('AI Calling Bot API is running...');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));
app.use('/api/calls', require('./routes/callRoutes'));

const WebAIPipeline = require('./services/webAIPipeline');

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  // Initialize the Web AI Pipeline for browser testing
  new WebAIPipeline(socket, { systemPrompt: 'You are a helpful assistant testing from the browser.' });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
