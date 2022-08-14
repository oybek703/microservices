import TicketCreatedListener from '../TicketCreatedListener'
import {natsWrapper} from '../../../natsWrapper'
import {TicketCreatedEvent} from '@yticketing/common'
import {Types} from 'mongoose'
import {Message} from 'node-nats-streaming'
import Ticket from '../../../models/Ticket'

async function setup() {
    // create an instance of listener
    const listener = new TicketCreatedListener(natsWrapper.client)
    // create fake data event
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        price: 10,
        title: 'Test',
        id: new Types.ObjectId().toHexString()
    }
    // create fake message object
    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }
    return {listener, data, message}
}

it('should create and save ticket', async function () {
    // call onMessage function with data and message object
    const {listener, data, message} = await setup()
    await listener.onMessage(data, message)
    // write assertions to make sure a ticket was created
    const ticket = await Ticket.findById(data.id)
    expect(ticket).toBeDefined()
    expect(ticket!.title).toEqual(data.title)
    expect(ticket!.price).toEqual(data.price)
})

it('should ack the message', async function () {
    // call onMessage function with data and message object
    const {listener, data, message} = await setup()
    await listener.onMessage(data, message)
    // write assertions to make sure that ack function is called
    expect(message.ack).toHaveBeenCalled()
})