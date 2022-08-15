import {Listener, OrderCreatedEvent, Subjects} from '@yticketing/common'
import {queueGroupName} from './queueGroupName'
import {Message} from 'node-nats-streaming'
import Ticket from '../../models/Ticket'
import {TicketUpdatedPublisher} from '../publishers/TicketUpdatedPublisher'

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], message: Message) {
        const ticket = await Ticket.findById(data.ticket.id)
        if(!ticket) throw new Error('Ticket not found.')
        ticket.set({orderId: data.id})
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

export default OrderCreatedListener