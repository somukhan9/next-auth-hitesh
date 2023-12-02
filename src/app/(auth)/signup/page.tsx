'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Spinner from '@/components/Spinner'

export default function SignUpPage() {
  const router = useRouter()
  const [disabled, setDisabled] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [formUser, setFormUser] = React.useState({
    username: '',
    email: '',
    password: '',
  })

  const { username, email, password } = formUser

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormUser((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }))
  }

  const handleSignUp = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    try {
      if (
        username.length === 0 ||
        email.length === 0 ||
        password.length === 0
      ) {
        toast('Please provide valid username, email and password')
        setLoading(false)
        return
      }

      const response = await axios.post('/api/auth/signup', formUser)

      if (response.data.success) {
        setFormUser({ username: '', email: '', password: '' })
        toast.success(response.data.message)
        toast.success(
          `A email verification link has been sent to your email address which is "${response.data.user.email}". Link on the link or copy paste the link on the browser and enjoy owr application.`
        )
        router.push(`/login`)
      } else {
        toast.error(response.data.message)
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (username.length === 0 || email.length === 0 || password.length === 0) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [username, email, password])

  if (loading) {
    return <Spinner />
  }

  return (
    <section className="flex flex-col gap-3 items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold tracking-[1.5px]">Sign Up Here</h1>
      <form
        onSubmit={handleSignUp}
        className="flex flex-col gap-2 items-center justify-center min-w-[380px]"
      >
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          value={username}
          onChange={handleOnChange}
          className="p-2 w-full outline-none bg-slate-100 rounded-md text-black"
        />
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email Address"
          value={email}
          onChange={handleOnChange}
          className="p-2 w-full outline-none bg-slate-100 rounded-md text-black"
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={handleOnChange}
          className="p-2 w-full outline-none bg-slate-100 rounded-md text-black"
        />
        <button
          type="submit"
          disabled={disabled}
          // disabled={true}
          className="text-slate-100 bg-slate-800 uppercase tracking-[1.5px] py-2 px-5 w-full rounded-lg hover:bg-slate-600 disabled:opacity-70 disabled:cursor-text"
        >
          Sign Up
        </button>
      </form>
      <p>
        Already have an account?
        <Link href="/login" className="ml-2 text-slate-500">
          Login
        </Link>
      </p>
    </section>
  )
}
