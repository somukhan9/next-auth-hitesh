'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Spinner from '@/components/Spinner'

export default function LoginPage() {
  const router = useRouter()
  const [disabled, setDisabled] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [formUser, setFormUser] = React.useState({
    usernameOrEmail: '',
    password: '',
  })

  const { usernameOrEmail, password } = formUser

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormUser((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }))
  }

  const handleLogin = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    try {
      if (usernameOrEmail.length === 0 || password.length === 0) {
        toast('Please provide valid username, email and password')
        setLoading(false)
        return
      }

      const response = await axios.post('/api/auth/login', formUser)

      if (response.data.success) {
        setFormUser({ usernameOrEmail: '', password: '' })
        toast.success(response.data.message)
        router.replace('/')
      } else {
        toast.error(response.data.message)
      }
    } catch (error: any) {
      console.log(error.response.data.message)
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (usernameOrEmail.length === 0 || password.length === 0) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [usernameOrEmail, password])

  if (loading) {
    return <Spinner />
  }

  return (
    <section className="flex flex-col gap-3 items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold tracking-[1.5px]">Login Here</h1>
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-2 items-center justify-center min-w-[380px]"
      >
        <input
          type="text"
          name="usernameOrEmail"
          id="usernameOrEmail"
          placeholder="Username or Email"
          value={usernameOrEmail}
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
          className="text-slate-100 bg-slate-800 uppercase tracking-[1.5px] py-2 px-5 w-full rounded-lg hover:bg-slate-600 disabled:opacity-70 disabled:cursor-text"
        >
          Login
        </button>
      </form>
      <p>
        Don't an account?
        <Link href="/signup" className="ml-2 text-slate-500">
          Signup
        </Link>
      </p>
    </section>
  )
}
