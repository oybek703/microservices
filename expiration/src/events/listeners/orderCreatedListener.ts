import {Listener, OrderCreatedEvent, Subjects} from '@yticketing/common'
import {Message} from 'node-nats-streaming'
import {queueGroupName} from './queueGroupName'
import expirationQueue from '../../queues/expirationQueue'

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], message: Message) {
        await expirationQueue.add({
            orderId: data.id
        })
        message.ack()
    }
}

export default OrderCreatedListener