import {connect, Message, Stan} from 'node-nats-streaming'
import {randomBytes} from 'crypto'

console.clear()

const stan: Stan = connect(
    'ticketing',
    randomBytes(16).toString('hex'),
    {
        url: 'http://localhost:4222'
    }
)

stan.on('connect', function () {
    console.log('Listener connected to NATS.')

    stan.on('close', function () {
        console.log('NATS client closed.')
        process.exit()
    })

    const options = stan.subscriptionOptions()
        .setManualAckMode(true)
        .setDeliverAllAvailable()
        .setDurableName('accounting-service')
    const subscription = stan.subscribe(
        'ticket:created',
        'order-service-queue-group',
        options
    )
    subscription.on('message', function (message: Message) {
        console.log(
            `Received message #${message.getSequence()} with data: ${message.getData()}`
        )
        message.ack()
    })
})

process.on('SIGINT', stan.close)
process.on('SIGTERM', stan.close)