import request from 'supertest'
import app from '../../app'
import {Types} from 'mongoose'
import Ticket from '../../models/Ticket'
import Order from '../../models/Order'
import {OrderStatus} from '@yticketing/common'
import {natsWrapper} from '../../natsWrapper'

it('should return error if ticket does not exist', async function () {
    const ticketId = new Types.ObjectId()
    await request(app).post('/api/orders')
        .set('Cookie', global.signIn())
        .send({ticketId}).expect(404)
})

it('should return an error if the ticket is already reserved', async function () {
    const ticket = Ticket.build({
        price: 20,
        title: 'Test title',
        id: new Types.ObjectId().toHexString()
    })
    await ticket.save()
    const order = Order.build({
        userId: 'test_user_id',
        ticket,
        expiresAt: new Date(),
        status: OrderStatus.Complete
    })
    await order.save()
    await request(app).post('/api/orders')
        .set('Cookie', global.signIn())
        .send({ticketId: ticket.id})
        .expect(400)
})

it('should reserve a ticket', async function () {
    const ticket = Ticket.build({
        price: 20,
        title: 'Test title',
        id: new Types.ObjectId().toHexString()
    })
    await ticket.save()
    await request(app).post('/api/orders')
        .set('Cookie', global.signIn())
        .send({ticketId: ticket.id})
        .expect(201)
})

it('should emit an order created event', async function () {
    const ticket = Ticket.build({
        price: 20,
        title: 'Test title',
        id: new Types.ObjectId().toHexString()
    })
    await ticket.save()
    await request(app).post('/api/orders')
        .set('Cookie', global.signIn())
        .send({ticketId: ticket.id})
        .expect(201)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})