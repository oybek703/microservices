import {Types} from 'mongoose'
import OrderCreatedListener from '../orderCreatedListener'
import {OrderCreatedEvent, OrderStatus} from '@yticketing/common'
import {Message} from 'node-nats-streaming'
import {natsWrapper} from '../../../natsWrapper'
import Ticket from '../../../models/Ticket'

async function setup() {
    // create an instance of listener
    const listener = new OrderCreatedListener(natsWrapper.client)

    // create ticket and save it to database
    const ticket = await Ticket.build({
        price: 10,
        title: 'Test',
        userId: 'test_user_id'
    })
    await ticket.save()
    // create fake data event
    const data: OrderCreatedEvent['data'] = {
        id: new Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        userId: 'test_user_id',
        expiresAt: 'some_temp_date',
        version: 0,
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }
    // create fake message object
    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }
    return {listener, data, message, ticket}
}

it('should set orderId of ticket', async function () {
    const {ticket, message, data, listener} = await setup()
    await listener.onMessage(data, message)
    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket!.orderId).toEqual(data.id)
})

it('should ack the message', async function () {
    const {message, data, listener} = await setup()
    await listener.onMessage(data, message)
    expect(message.ack).toHaveBeenCalled()
})

it('should publish a ticket updated event', async function () {
    const {message, data, listener} = await setup()
    await listener.onMessage(data, message)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1)
    const ticketUpdatedData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    )
    expect(ticketUpdatedData.orderId).toEqual(data.id)
}) 