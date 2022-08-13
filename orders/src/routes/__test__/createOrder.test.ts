import request from 'supertest'
import app from '../../app'
import {Types} from 'mongoose'
import Ticket from '../../models/Ticket'
import Order from '../../models/Order'
import {OrderStatus} from '@yticketing/common'

it('should return error if ticket does not exist', async function () {
    const ticketId = new Types.ObjectId()
    await request(app).post('/api/orders')
        .set('Cookie', global.signIn())
        .send({ticketId}).expect(404)
})

it('should return an error if the ticket is already reserved', async function () {
    const ticket = Ticket.build({price: 20, title: 'Test title'})
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
    const ticket = new Ticket({price: 20, title: 'Test title'})
    await ticket.save()
    await request(app).post('/api/orders')
        .set('Cookie', global.signIn())
        .send({ticketId: ticket.id})
        .expect(201)
})