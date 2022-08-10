import {connect, Stan} from 'node-nats-streaming'
import {TicketCreatedPublisher} from './events/ticketCreatedPublisher'

console.clear()

const stan: Stan = connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
})


stan.on('connect', async function () {
    console.log('Publisher connected to NATS.')
    const publisher = new TicketCreatedPublisher(stan)
    await publisher.publish({
        id: '123',
        price: 20,
        title: 'Test title'
    })
    // const message = JSON.stringify({id: '123', title: 'test', price: 10})
    // stan.publish('ticket:created', message, function () {
    //     console.log('Event published.')
    // })
})