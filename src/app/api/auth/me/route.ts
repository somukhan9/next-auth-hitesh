import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/db/dbConfig'
import { getUserIdTokenFromToken } from '@/helpers/getUserIdFromToken'
import User from '@/models/userModel'

connectDB()

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdTokenFromToken(request)
    const user = await User.findById(userId).select('-password')
    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.log(error)
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    )
  }
}
