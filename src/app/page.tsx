'use client'

import * as React from 'react'
import axios from 'axios'
import Link from 'next/link'
import Spinner from '@/components/Spinner'

export default function Home() {
  const [user, setUser] = React.useState()
  const [loading, setLoading] = React.useState(true)

  async function fetchUser() {
    try {
      const res = await axios.get('/api/auth/me')
      if (res.data.success) {
        setUser(res.data.user)
      }
    } catch (error: any) {
      console.log(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchUser()
  }, [])

  if (loading) {
    return <Spinner />
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Welcome to Next JS Auth</h1>
      {user ? (
        <Link href="/profile" className="py-2 px-4 bg-blue-600 rounded-md mt-3">
          Profile
        </Link>
      ) : (
        <>
          <Link href="/login" className="py-2 px-4 bg-blue-800 rounded-md my-3">
            Login
          </Link>
          <Link href="/signup" className="py-2 px-4 bg-green-800 rounded-md">
            Signup
          </Link>
        </>
      )}
    </section>
  )
}
