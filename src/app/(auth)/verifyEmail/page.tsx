'use client'

import * as React from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Spinner from '@/components/Spinner'

export default function VerifyEmail() {
  const [token, setToken] = React.useState('')
  const [verified, setVerified] = React.useState(false)

  const verifyEmail = async () => {
    try {
      const { data } = await axios.post('/api/auth/verifyEmail', { token })
      if (!data.success) {
        toast.error(data.message)
      } else {
        setVerified(true)
      }
    } catch (error: any) {
      console.log(error.response.data.message)
      toast.error(error.response.data.message)
    }
  }

  React.useEffect(() => {
    const urlToken = window.location.search.split('=')[1]
    setToken(urlToken || '')
  }, [])

  React.useEffect(() => {
    if (token.length > 0) {
      verifyEmail()
    }
  }, [token])

  if (!verified) {
    return <Spinner />
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl">Verify Email</h1>
      <h2 className="p-2 bg-orange-500 text-black">
        {token ? `${token}` : 'no token'}
      </h2>

      {verified && (
        <div>
          <h2 className="text-2xl">Email Verified</h2>
          <Link href="/login">Login</Link>
        </div>
      )}
    </div>
  )
}
