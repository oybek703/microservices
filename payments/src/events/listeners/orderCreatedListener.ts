import {Listener, OrderCreatedEvent, Subjects} from '@yticketing/common'
import {queueGroupName} from './queueGroupName'
import {Message} from 'node-nats-streaming'
import Order from '../../models/Order'

class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], message: Message) {
        await Order.build({
            status: data.status,
            userId: data.userId,
            id: data.id,
            price: data.ticket.price,
            version: data.version
        }).save()
        message.ack()
    }
}

export default OrderCreatedListener