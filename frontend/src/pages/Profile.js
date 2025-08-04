import { useEffect, useState } from 'react'
import { getProfile } from '../api'

const Profile = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('userInfo'))
        if (storedUser?.token) {
          const { data } = await getProfile() // getProfile already includes token via interceptor
          setUser(data)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    fetchProfile()
  }, [])

  if (!user) return <p>Loading...</p>

  return (
    <div>
      <h2>{user.name}'s Profile</h2>
      <p>Email: {user.email}</p>
    </div>
  )
}

export default Profile

