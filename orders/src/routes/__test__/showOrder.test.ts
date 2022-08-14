import request from 'supertest'
import Ticket from '../../models/Ticket'
import app from '../../app'
import {Types} from 'mongoose'

it('should fetch order by order id', async function () {
    const ticket = await Ticket.build({
        price: 10,
        title: 'Test ticket title',
        id: new Types.ObjectId().toHexString()
    }).save()
    const user = global.signIn()
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user).send({ticketId: ticket.id}).expect(201)
    const {body: fetchedOrder} = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
    expect(fetchedOrder.id).toEqual(order.id)
})

it('should return error if user is not order owner', async function () {
    const ticket = await Ticket.build({
        price: 10,
        title: 'Test ticket title',
        id: new Types.ObjectId().toHexString()
    }).save()
    const user = global.signIn()
    const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user).send({ticketId: ticket.id}).expect(201)
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', global.signIn()).expect(401)
})