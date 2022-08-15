import {natsWrapper} from '../../../natsWrapper'
import {TicketUpdatedEvent} from '@yticketing/common'
import {Types} from 'mongoose'
import {Message} from 'node-nats-streaming'
import Ticket from '../../../models/Ticket'
import TicketUpdatedListener from '../ticketUpdatedListener'

async function setup() {
    // create an instance of listener
    const listener = new TicketUpdatedListener(natsWrapper.client)

    // create ticket and save it to database
    const ticket = await Ticket.build({
        price: 10,
        title: 'Test',
        id: new Types.ObjectId().toHexString()
    })
    await ticket.save()
    // create fake data event
    const data: TicketUpdatedEvent['data'] = {
        version: ticket.version + 1,
        price: 10,
        title: 'Updated title',
        id: ticket.id,
        userId: new Types.ObjectId().toHexString()
    }
    // create fake message object
    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }
    return {listener, data, message, ticket}
}

it('should find, update and save ticket', async function () {
    const {ticket, message, listener, data} = await setup()
    // call onMessage function with data and message object
    await listener.onMessage(data, message)
    // write assertions to make sure a ticket was created
    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket!.price).toEqual(data.price)
    expect(updatedTicket!.title).toEqual(data.title)
    expect(updatedTicket!.version).toEqual(data.version)
})

it('should ack the message', async function () {
    const {message, listener, data} = await setup()
    // call onMessage function with data and message object
    await listener.onMessage(data, message)
    // write assertions to make sure that ack function is called
    expect(message.ack).toHaveBeenCalled()
})

it('should not call ack if versions differ', async function () {
    const {message, data, listener} = await setup()
    data.version = 10
    try {
        await listener.onMessage(data, message)
    } catch (e) {

    }
    expect(message.ack).not.toHaveBeenCalled()
})