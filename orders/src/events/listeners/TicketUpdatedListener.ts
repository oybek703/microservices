import {Listener, Subjects, TicketUpdatedEvent} from '@yticketing/common'
import {queueGroupName} from './queueGroupName'
import {Message} from 'node-nats-streaming'
import Ticket from '../../models/Ticket'

class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
    queueGroupName = queueGroupName

    async onMessage(data: TicketUpdatedEvent['data'], message: Message) {
        const {version, id: _id, title, price} = data
        const ticket = await Ticket.findOne({ _id, version: version - 1 })
        if(!ticket) throw new Error('Ticket not found.')
        ticket.set({title, price})
        await ticket.save()
        message.ack()
    }
}

export default TicketUpdatedListener