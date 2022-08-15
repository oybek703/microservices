import {natsWrapper} from '../../../natsWrapper'
import {ExpirationCompleteEvent, OrderStatus} from '@yticketing/common'
import {Types} from 'mongoose'
import {Message} from 'node-nats-streaming'
import ExpirationCompletedListener from '../expirationCompletedListener'
import Ticket from '../../../models/Ticket'
import Order from '../../../models/Order'

async function setup() {
    const listener = new ExpirationCompletedListener(natsWrapper.client)
    const ticket = await Ticket.build({
        id: new Types.ObjectId().toHexString(),
        title: 'Test title',
        price: 10
    }).save()
    const order = await Order.build({
        ticket,
        userId: 'test_user_id',
        status: OrderStatus.Created,
        expiresAt: new Date()
    }).save()
    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }
    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }
    return {listener, data, message, ticket}
}

it('should update order status to cancelled', async function () {
    const {listener, data, message} = await setup()
    await listener.onMessage(data, message)
    const updatedOrder = await Order.findById(data.orderId)
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('should emit and orderCancelled event', async function () {
    const {listener, data, message} = await setup()
    await listener.onMessage(data, message)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
    expect(eventData.id).toEqual(data.orderId)
})

it('should ack the message', async function () {
    const {listener, data, message} = await setup()
    await listener.onMessage(data, message)
    expect(message.ack).toHaveBeenCalled()
})