const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const mongoose = require('mongoose')
const http = require('http')
const { Server } = require('socket.io')

const userRoutes = require('./routes/userRoutes')
const { protect } = require('./middleware/authMiddleware')

// Load environment variables
dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

// API routes
app.use('/api/user', userRoutes)

// Protected route example
app.get('/api/user/profile', protect, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  })
})

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: 'chatapp',
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })

// Start server with Socket.IO
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow frontend
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log('New client connected')

  // Join personal room
  socket.on('join', (userId) => {
    socket.join(userId)
    console.log(`User ${userId} joined room`)
  })

  // Handle private message
  socket.on('private-message', ({ senderId, receiverId, message }) => {
    console.log(`Message from ${senderId} to ${receiverId}: ${message}`)
    io.to(receiverId).emit('private-message', { senderId, message })
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
