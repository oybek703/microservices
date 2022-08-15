import {Types} from 'mongoose'
import {OrderCancelledEvent} from '@yticketing/common'
import {Message} from 'node-nats-streaming'
import {natsWrapper} from '../../../natsWrapper'
import Ticket from '../../../models/Ticket'
import OrderCancelledListener from '../orderCancelledListener'

async function setup() {
    // create an instance of listener
    const listener = new OrderCancelledListener(natsWrapper.client)

    // create ticket and save it to database
    const orderId = new Types.ObjectId().toHexString()
    const ticket = await Ticket.build({
        price: 10,
        title: 'Test',
        userId: 'test_user_id'
    })
    ticket.set({orderId})
    await ticket.save()
    // create fake data event
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    }
    // create fake message object
    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }
    return {listener, data, message, ticket, orderId}
}

it('should update ticket, publish event and ack message', async function () {
    const {ticket, message, data, listener} = await setup()
    await listener.onMessage(data, message)
    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket!.orderId).not.toBeDefined()
    expect(natsWrapper.client.publish).toHaveBeenCalled()
    expect(message.ack).toHaveBeenCalled()
})