// 🔐 controllers/userController.js
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

const registerUser = async (req, res) => {
  const { name, email, password } = req.body
  const lowerCaseEmail = email.toLowerCase()

  try {
    const userExists = await User.findOne({ email: lowerCaseEmail })
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
      name,
      email: lowerCaseEmail,
      password: hashedPassword,
    })

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      })
    } else {
      res.status(400).json({ message: 'Invalid user data' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' })
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body
  const lowerCaseEmail = email.toLowerCase()

  console.log("LOGIN ATTEMPT:", lowerCaseEmail, password)

  try {
    const user = await User.findOne({ email: lowerCaseEmail })
    console.log("USER FOUND:", user)

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      })
    } else {
      console.log("❌ PASSWORD MISMATCH")
      res.status(401).json({ message: 'Invalid email or password' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' })
  }
}

const getUserProfile = async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  })
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
}