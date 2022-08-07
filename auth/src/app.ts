import express from 'express'
import 'express-async-errors'
import {currentUserRoutes} from './routes/currentUser'
import {signInRoutes} from './routes/signIn'
import {signUpRoutes} from './routes/signUp'
import {signOutRoutes} from './routes/signOut'
import errorHandler from './middlewares/errorHandler'
import NotFoundError from './errors/notFoundError'
import cookieSession from 'cookie-session'

const app = express()

app.set('trust proxy', true)

app.use(express.json())

app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))
app.use(signUpRoutes)
app.use(signInRoutes)
app.use(currentUserRoutes)
app.use(signOutRoutes)

app.all('*', async () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export default app