import {Listener, OrderCancelledEvent, OrderStatus, Subjects} from '@yticketing/common'
import {queueGroupName} from './queueGroupName'
import {Message} from 'node-nats-streaming'
import Order from '../../models/Order'

class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
    queueGroupName = queueGroupName

    async onMessage(data: OrderCancelledEvent['data'], message: Message) {
        const order = await Order.findByEvent(data)
        console.log(order)
        if(!order) throw new Error('Order not found!')
        order.set({status: OrderStatus.Cancelled})
        await order.save()
        message.ack()
    }
}

export default OrderCancelledListener