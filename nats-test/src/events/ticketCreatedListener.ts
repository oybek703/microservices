import {Listener} from './baseListener'
import {Message} from 'node-nats-streaming'
import {TicketCreatedEvent} from './ticketCreatedEvent'
import {Subjects} from './subjects'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated
    queueGroupName = 'payments-service'

    onMessage(data: TicketCreatedEvent['data'], message: Message) {
        console.log('Event data: ', data)
        message.ack()
    }
}