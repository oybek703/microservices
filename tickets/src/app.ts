import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import {currentUser, errorHandler, NotFoundError} from '@yticketing/common'
import {createTicketRouter} from './routes/createTicket'
import {showTicketRouter} from './routes/showTicket'
import {getTicketsRouter} from './routes/getTickets'
import {updateTicketRouter} from './routes/updateTicket'

const app = express()

app.set('trust proxy', true)

app.use(express.json())

app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))

app.use(currentUser)

app.use(showTicketRouter)
app.use(createTicketRouter)
app.use(getTicketsRouter)
app.use(updateTicketRouter)

app.all('*', async () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export default app