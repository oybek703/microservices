import {
    ExpirationCompleteEvent,
    Listener, OrderStatus, Subjects
} from '@yticketing/common'
import {Message} from 'node-nats-streaming'
import {queueGroupName} from './queueGroupName'
import Order from '../../models/Order'
import OrderCancelledPublisher from '../publishers/orderCancelledPublisher'

class ExpirationCompletedListener extends Listener<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted
    queueGroupName = queueGroupName

    async onMessage(data: ExpirationCompleteEvent['data'], message: Message) {
        const order = await Order.findById(data.orderId).populate('ticket')
        if (!order) throw new Error('Order not found!')
        if (order.status === OrderStatus.Complete) return message.ack()
        order.set({status: OrderStatus.Cancelled})
        await order.save()
        await new OrderCancelledPublisher(this.client).publish({
            version: order.version,
            ticket: {
                id: order.ticket.id
            },
            id: order.id
        })
        message.ack()
    }
}

export default ExpirationCompletedListener