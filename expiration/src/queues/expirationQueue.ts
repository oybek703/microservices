import Queue from 'bull'
import ExpirationCompletedPublisher from '../events/publishers/expirationCompletedPublisher'
import {natsWrapper} from '../natsWrapper'

interface Payload {
    orderId: string
}

const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
})

expirationQueue.process(async function(job) {
    await new ExpirationCompletedPublisher(natsWrapper.client).publish({
        orderId: job.data.orderId
    })
})

export default expirationQueue