import {Listener, OrderCreatedEvent, Subjects} from '@yticketing/common'
import {Message} from 'node-nats-streaming'
import {queueGroupName} from './queueGroupName'
import expirationQueue from '../../queues/expirationQueue'

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], message: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
        console.log('Waiting milliseconds to process a job: ', delay)
        await expirationQueue.add({orderId: data.id}, {delay})
        message.ack()
    }
}

export default OrderCreatedListener