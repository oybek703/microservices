import {connect, Stan} from 'node-nats-streaming'

console.clear()

const stan: Stan = connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
})


stan.on('connect', function () {
    console.log('Publisher connected to NATS.')
    const message = JSON.stringify({id: '123', title: 'test', price: 10})
    stan.publish('ticket:created', message, function () {
        console.log('Event published.')
    })
})