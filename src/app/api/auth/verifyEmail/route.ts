import { connectDB } from '@/db/dbConfig'
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'

connectDB()

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid token',
        },
        { status: 400 }
      )
    }

    user.isVerified = true
    user.verifyToken = undefined
    user.verifyTokenExpiry = undefined

    await user.save({ validateBeforeSave: false })

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully!',
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
