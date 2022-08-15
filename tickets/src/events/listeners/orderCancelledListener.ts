import {Listener, OrderCancelledEvent, Subjects} from '@yticketing/common'
import {queueGroupName} from './queueGroupName'
import {Message} from 'node-nats-streaming'
import Ticket from '../../models/Ticket'
import {TicketUpdatedPublisher} from '../publishers/TicketUpdatedPublisher'

class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
    queueGroupName = queueGroupName

    async onMessage(data: OrderCancelledEvent['data'], message: Message) {
        const ticket = await Ticket.findById(data.ticket.id)
        if(!ticket) throw new Error('Ticket not found.')
        ticket.set({orderId: undefined})
        await ticket.save()
        await new TicketUpdatedPublisher(this.client).publish({
            version: ticket.version,
            userId: ticket.userId,
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            orderId: ticket.orderId
        })
        message.ack()
    }
}

export default OrderCancelledListener