import {connect, Stan} from 'node-nats-streaming'
import {randomBytes} from 'crypto'
import {TicketCreatedListener} from './events/ticketCreatedListener'

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

    new TicketCreatedListener(stan).listen()
})

process.on('SIGINT', stan.close)
process.on('SIGTERM', stan.close)