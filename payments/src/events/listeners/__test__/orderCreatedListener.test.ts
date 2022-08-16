import OrderCreatedListener from '../orderCreatedListener'
import {natsWrapper} from '../../../natsWrapper'
import {OrderCreatedEvent, OrderStatus} from '@yticketing/common'
import {Types} from 'mongoose'
import {Message} from 'node-nats-streaming'
import Order from '../../../models/Order'

async function setup() {
    // create an instance of listener
    const listener = new OrderCreatedListener(natsWrapper.client)
    // create fake data event
    const data: OrderCreatedEvent['data'] = {
        id: new Types.ObjectId().toHexString(),
        version: 0,
        expiresAt: 'test_data',
        ticket: {
            price: 10,
            id: new Types.ObjectId().toHexString()
        },
        userId: 'test_user_id',
        status: OrderStatus.Created
    }
    // create fake message object
    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }
    return {listener, data, message}
}

it('should replicate order info', async function () {
    const {message, data, listener} = await setup()
    await listener.onMessage(data, message)
    const order = await Order.findById(data.id)
    expect(order!.price).toEqual(data.ticket.price)
})

it('should ack the message', async function () {
    const {message, data, listener} = await setup()
    await listener.onMessage(data, message)
    expect(message.ack).toHaveBeenCalled()
})