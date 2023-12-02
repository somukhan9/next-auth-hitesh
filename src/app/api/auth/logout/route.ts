import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully!',
  })

  response.cookies.set('token', '', { httpOnly: true, expires: Date.now() })

  return response
}
