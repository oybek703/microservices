import mongoose from 'mongoose'
import app from './app'
import {natsWrapper} from './natsWrapper'
import TicketCreatedListener from './events/listeners/ticketCreatedListener'
import TicketUpdatedListener from './events/listeners/ticketUpdatedListener'
import ExpirationCompletedListener from './events/listeners/expirationCompletedListener'
import PaymentCreatedListener from './events/listeners/paymentCreatedListener'

async function start() {
    if(!process.env.JWT_KEY) throw Error('JWT_KEY is not defined!')
    if(!process.env.MONGO_URI) throw Error('MONGO_URI is not defined!')
    if(!process.env.NATS_CLUSTER_ID) throw Error('NATS_CLUSTER_ID is not defined!')
    if(!process.env.NATS_CLIENT_ID) throw Error('NATS_CLIENT_ID is not defined!')
    if(!process.env.NATS_URL) throw Error('NATS_URL is not defined!')
    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        )
        natsWrapper.client.on('close', function () {
            console.log('NATS connection closed.')
            process.exit()
        })
        process.on('SIGINT', natsWrapper.client.close)
        process.on('SIGTERM', natsWrapper.client.close)
        new TicketCreatedListener(natsWrapper.client).listen()
        new TicketUpdatedListener(natsWrapper.client).listen()
        new ExpirationCompletedListener(natsWrapper.client).listen()
        new PaymentCreatedListener(natsWrapper.client).listen()
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Successfully connected to MongoDB database!')
    } catch (e) {
        console.log(e)
    }
    app.listen(3000, () => {
        console.log('Orders service is running on port 3000...')
    })
}

(async function () {
    await start()
})()