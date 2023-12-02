import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

interface UserType {
  username: string
  email: string
  password: string
  isVerified: boolean
  isAdmin: boolean
  forgotPasswordToken?: string
  forgotPasswordTokenExpiry?: Date
  verifyToken?: string
  verifyTokenExpiry?: Date
}

const userSchema = new mongoose.Schema<UserType>(
  {
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      minLength: [3, 'Username should be at least of 3 characters'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide a valid email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a valid and strong password'],
      minLength: [6, 'Password should be at least of 6 characters'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
  },
  { timestamps: true }
)

// Causing problem while verify email
userSchema.pre('save', function () {
  if (this.isNew) {
    try {
      const salt = bcrypt.genSaltSync(10)
      this.password = bcrypt.hashSync(this.password, salt)
    } catch (error: any) {
      console.log(`Error encrypting the password\n${error.toString()}`)
    }
  }
})

userSchema.methods.verifyPassword = function (password: string) {
  return bcrypt.compareSync(password, this.password)
}

userSchema.methods.generateJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRY,
  })
}

const User = mongoose.models.users || mongoose.model('users', userSchema)

export default User
