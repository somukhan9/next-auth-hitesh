import User from '@/models/userModel'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'
import { EmailType } from './emailType'

interface ParameterType {
  email: string
  emailType: string
  userId: any
}

export async function sendMail({ email, emailType, userId }: ParameterType) {
  try {
    const hashedToken = bcrypt.hashSync(userId.toString(), 10)

    const user = await User.findById(userId)

    if (emailType === EmailType.verify) {
      user.verifyToken = hashedToken
      user.verifyTokenExpiry = Date.now() + 1 * 24 * 60 * 60 * 1000
      await user.save()
      // await User.findByIdAndUpdate(userId, {
      //   verifyToken: hashedToken,
      //   verifyTokenExpiry: Date.now() + 1 * 24 * 60 * 60 * 1000,
      // })
    } else if (emailType === EmailType.reset) {
      // user.forgotPasswordToken = hashedToken
      // user.forgotPasswordTokenExpiry = Date.now() + 1 * 24 * 60 * 60 * 1000
      // await user.save({runValidator: false})
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 1 * 24 * 60 * 60 * 1000,
      })
    }

    var transport = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    })
    //TODO: add user and pass into .env

    const mailOptions = {
      from: 'wwhaisenbarg@gmail.com',
      to: email,
      subject:
        emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password',
      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verifyEmail?token=${hashedToken}">here</a> to ${
        emailType === EmailType.verify
          ? 'verify your email'
          : 'reset your password'
      }
            or copy and paste the link below in your browser. <br> ${
              process.env.DOMAIN
            }/verifyEmail?token=${hashedToken}
            </p>`,
    }

    await transport.sendMail(mailOptions)
  } catch (error: any) {
    throw new Error(error.message)
  }
}
