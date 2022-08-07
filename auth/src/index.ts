import mongoose from 'mongoose'
import app from './app'

async function start() {
    if(!process.env.JWT_KEY) throw Error('JWT_KEY is not defined!')
    try {
        await mongoose.connect('mongodb://auth-mongo-srv/auth')
        console.log('Successfully connected to MongoDB database!')
    } catch (e) {
        console.log(e)
    }
    app.listen(3000, () => {
        console.log('Auth service is running on port 3000...')
    })
}

(async function () {
    await start()
})()