import {Publisher, Subjects, TicketUpdatedEvent} from '@yticketing/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}

