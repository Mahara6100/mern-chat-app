// ✅ src/pages/Register.js
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../api'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await register({ name, email, password })
      localStorage.setItem('userInfo', JSON.stringify(data))
      navigate('/chat')
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message)
  setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Register

