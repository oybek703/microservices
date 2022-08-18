import {natsWrapper} from '../../../natsWrapper'
import {OrderCancelledEvent, OrderStatus} from '@yticketing/common'
import {Types} from 'mongoose'
import {Message} from 'node-nats-streaming'
import Order from '../../../models/Order'
import OrderCancelledListener from '../orderCancelledListener'

async function setup() {
    // create an instance of listener
    const listener = new OrderCancelledListener(natsWrapper.client)
    // create fake data event
    const order = await Order.build({
        userId: 'test_user_id',
        status: OrderStatus.Created,
        version: 0,
        price: 10,
        id: new Types.ObjectId().toHexString()
    }).save()
    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: {
            id: new Types.ObjectId().toHexString()
        }
    }
    // create fake message object
    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }
    return {listener, data, message}
}

it('should update the status of order', async function () {
    const {message, data, listener} = await setup()
    await listener.onMessage(data, message)
    const order = await Order.findById(data.id)
    expect(order!.status).toEqual(OrderStatus.Cancelled)
})

it('should ack the message', async function () {
    const {message, data, listener} = await setup()
    await listener.onMessage(data, message)
    expect(message.ack).toHaveBeenCalled()
})