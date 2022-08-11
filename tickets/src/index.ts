import mongoose from 'mongoose'
import app from './app'
import {natsWrapper} from './natsWrapper'

async function start() {
    if(!process.env.JWT_KEY) throw Error('JWT_KEY is not defined!')
    if(!process.env.MONGO_URI) throw Error('MONGO_URI is not defined!')
    try {
        await natsWrapper.connect(
            'ticketing',
            'abc',
            'http://nats-srv:4222'
        )
        natsWrapper.client.on('close', function () {
            console.log('NATS connection closed.')
            process.exit()
        })
        process.on('SIGINT', natsWrapper.client.close)
        process.on('SIGTERM', natsWrapper.client.close)
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Successfully connected to MongoDB database!')
    } catch (e) {
        console.log(e)
    }
    app.listen(3000, () => {
        console.log('Tickets service is running on port 3000...')
    })
}

(async function () {
    await start()
})()