import {natsWrapper} from './natsWrapper'
import OrderCreatedListener from './events/listeners/orderCreatedListener'

async function start() {
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
        new OrderCreatedListener(natsWrapper.client).listen()
    } catch (e) {
        console.log(e)
    }
}

(async function () {
    await start()
})()