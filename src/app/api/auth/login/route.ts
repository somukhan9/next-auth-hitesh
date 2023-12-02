import { NextRequest, NextResponse } from 'next/server'
import User from '@/models/userModel'
import { connectDB } from '@/db/dbConfig'

connectDB()

export async function POST(request: NextRequest) {
  try {
    const { usernameOrEmail, password } = await request.json()

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid credentials',
        },
        { status: 400 }
      )
    }

    if (!user.isVerified) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please verify your email address',
        },
        { status: 401 }
      )
    }

    const passwordVerified = user.verifyPassword(password)

    if (!passwordVerified) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid credentials',
        },
        { status: 400 }
      )
    }

    const token = user.generateJWTToken()

    const { password: userPassword, ...restUser } = user._doc

    const response = NextResponse.json({
      success: true,
      message: 'User logged in successfully',
      user: restUser,
    })

    response.cookies.set('token', token, { httpOnly: true })

    return response
  } catch (error: any) {
    console.log(`Error while signup\n${error}`)
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    )
  }
}
