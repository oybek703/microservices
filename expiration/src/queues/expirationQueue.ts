import Queue from 'bull'

interface Payload {
    orderId: string
}

const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
})

expirationQueue.process(async function(job) {
    console.log('I want to publish a job', job.data.orderId)
})

export default expirationQueue