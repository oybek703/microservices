import express from 'express'
import 'express-async-errors'
import {currentUserRoutes} from './routes/currentUser'
import {signInRoutes} from './routes/signIn'
import {signUpRoutes} from './routes/signUp'
import {signOutRoutes} from './routes/signOut'
import errorHandler from './middlewares/errorHandler'
import NotFoundError from './errors/notFoundError'

const app = express()

app.use(express.json())

app.use(currentUserRoutes)
app.use(signUpRoutes)
app.use(signInRoutes)
app.use(signOutRoutes)

app.all('*', async () => {
    throw new NotFoundError()
})

app.use(errorHandler)

app.listen(3000, () => {
    console.log('Auth service is running on port 3000...')
})