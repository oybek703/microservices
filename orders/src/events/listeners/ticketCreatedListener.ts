import {Listener, Subjects, TicketCreatedEvent} from '@yticketing/common'
import {queueGroupName} from './queueGroupName'
import {Message} from 'node-nats-streaming'
import Ticket from '../../models/Ticket'

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated
    queueGroupName = queueGroupName

    async onMessage(data: TicketCreatedEvent['data'], message: Message) {
        const {id, title, price} = data
        await Ticket.build({id, title, price}).save()
        message.ack()
    }
}

export default TicketCreatedListener