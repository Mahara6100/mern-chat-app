// src/pages/Chat.js
import { useEffect, useState } from 'react'
import io from 'socket.io-client'

let socket

const Chat = () => {
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState([])
  const [receiverId, setReceiverId] = useState('')
  const user = JSON.parse(localStorage.getItem('userInfo'))

  useEffect(() => {
    socket = io('http://localhost:5000') // Only connect once

    if (user) {
      socket.emit('join', user._id)
    }

    socket.on('private-message', (data) => {
      setChat((prev) => [...prev, data])
    })

    return () => {
      if (socket) {
        socket.off('private-message') // Only turn off the listener
      }
    }
  }, [user]) // DON'T put socket in dependency array

  const sendMessage = () => {
    if (message.trim() && receiverId) {
      socket.emit('private-message', {
        senderId: user._id,
        receiverId,
        message,
      })

      // Show it in sender's screen immediately
      setChat((prev) => [...prev, { senderId: user._id, message }])
      setMessage('')
    }
  }

  return (
    <div>
      <h2>Chat as {user.name}</h2>
      <input
        type="text"
        placeholder="Receiver User ID"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
      />
      <div>
        {chat.map((msg, i) => (
          <p key={i}>
            <strong>{msg.senderId === user._id ? 'Me' : 'Them'}:</strong> {msg.message}
          </p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  )
}

export default Chat
