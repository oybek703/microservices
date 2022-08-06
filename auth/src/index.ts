import express from 'express'
import 'express-async-errors'
import {currentUserRoutes} from './routes/currentUser'
import {signInRoutes} from './routes/signIn'
import {signUpRoutes} from './routes/signUp'
import {signOutRoutes} from './routes/signOut'
import errorHandler from './middlewares/errorHandler'
import NotFoundError from './errors/notFoundError'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'

const app = express()

app.set('trust proxy', true)

app.use(express.json())

app.use(cookieSession({
    signed: false,
    secure: true
}))

app.use(currentUserRoutes)
app.use(signUpRoutes)
app.use(signInRoutes)
app.use(signOutRoutes)

app.all('*', async () => {
    throw new NotFoundError()
})

app.use(errorHandler)

async function start() {
    if(!process.env.JWT_KEY) throw Error('JWT_KEY is not defined!')
    try {
        await mongoose.connect('mongodb://auth-mongo-srv/auth')
        console.log('Successfully connected to database!')
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