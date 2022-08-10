import {connect, Stan} from 'node-nats-streaming'

console.clear()

const stan: Stan = connect('ticketing', '123', {
    url: 'http://localhost:4222'
})

stan.on('connect', function () {
    console.log('Listener connected to NATS.')
    const subscription = stan.subscribe('ticket:created')
    subscription.on('message', function (message) {
        console.log('Message received.')
    })
})