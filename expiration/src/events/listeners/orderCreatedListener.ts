import {Listener, OrderCreatedEvent, Subjects} from '@yticketing/common'
import {Message} from 'node-nats-streaming'
import {queueGroupName} from './queueGroupName'

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = queueGroupName

    onMessage(data: OrderCreatedEvent['data'], message: Message) {
    }
}

export default OrderCreatedListener