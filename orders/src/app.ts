import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import {currentUser, errorHandler, NotFoundError} from '@yticketing/common'
import {showOrderRouter} from './routes/showOrder'
import {createOrderRouter} from './routes/createOrder'
import {getOrdersRouter} from './routes/getOrders'
import {deleteOrderRouter} from './routes/deleteOrder'

const app = express()

app.set('trust proxy', true)

app.use(express.json())

app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))

app.use(currentUser)

app.use(showOrderRouter)
app.use(createOrderRouter)
app.use(getOrdersRouter)
app.use(deleteOrderRouter)

app.all('*', async () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export default app