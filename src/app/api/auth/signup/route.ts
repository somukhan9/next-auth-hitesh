import { connectDB } from '@/db/dbConfig'
import { sendMail } from '@/helpers/mailer'
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import { EmailType } from '@/helpers/emailType'
import bcrypt from 'bcryptjs'

connectDB()

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()
    let user = await User.findOne({
      $or: [{ username }, { email }],
    })

    if (user) {
      return NextResponse.json({
        success: false,
        message: `User already exists with this email or username`,
      })
    }

    // const salt = bcrypt.genSaltSync(10)
    // const hashedPassword = bcrypt.hashSync(password, salt)

    user = new User({ username, email, password })
    user = await user.save({ validateBeforeSave: true })

    const { password: userPassword, ...restUser } = user._doc

    sendMail({
      email: user.email,
      emailType: EmailType.verify,
      userId: user._id,
    })

    return NextResponse.json({
      success: true,
      message: 'User created successfully!',
      user: restUser,
    })
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
