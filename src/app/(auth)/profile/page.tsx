'use client'
import * as React from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Spinner from '@/components/Spinner'
import Link from 'next/link'

interface UserType {
  username: string
  email: string
  isVerified: boolean
  isAdmin: boolean
  forgotPasswordToken?: string
  forgotPasswordTokenExpiry?: Date
  verifyToken?: string
  verifyTokenExpiry?: Date
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = React.useState<UserType>({
    username: '',
    email: '',
    isVerified: false,
    isAdmin: false,
  })
  const [loading, setLoading] = React.useState(true)

  const logUser = async () => {
    await axios.get('/api/auth/logout')
    router.replace('/login')
  }

  React.useEffect(() => {
    setLoading(true)
    axios
      .get('/api/auth/me')
      .then((res: any) => {
        console.log(res.data.user)
        setUser(res.data.user)
        toast.success('User data fetched successfully!')
        setLoading(false)
      })
      .catch((error: any) => {
        console.log(error.response.data.message)
        toast.error(error.response.data.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <Spinner />
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center gap-3">
      <h1 className="text-3xl font-bold">Profile Page for "{user.username}"</h1>
      <p>Username: {user.username}</p>
      <p>Email Address: {user.email}</p>
      <p>{user.isVerified ? 'Verified' : 'Not Verified'}</p>
      <button
        onClick={logUser}
        className="px-4 py-2 mt-4 bg-blue-600 text-white outline-none rounded-md"
      >
        Logout
      </button>
      <Link href="/" className="py-2 px-4 bg-green-800 rounded-md my-3">
        Home
      </Link>
    </section>
  )
}
