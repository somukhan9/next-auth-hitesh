import mongoose from 'mongoose'

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!)
    const connection = mongoose.connection

    connection.on('connected', () => {
      console.log(`Database connected successfully!`)
    })

    connection.on('error', (err) => {
      console.log(`Error ocurred while connecting to the database~\n${err}`)
      process.exit()
    })
  } catch (error) {
    console.log(`Something went wrong!\n${error}`)
  }
}
