import request from 'supertest'
import Ticket from '../../models/Ticket'
import app from '../../app'
import {Types} from 'mongoose'

jest.setTimeout(10000)

it('should return all orders for specific user', async function () {
    // Create three tickets
    const ticket1 = await Ticket.build({
        price: 10,
        title: 'T1',
        id: new Types.ObjectId().toHexString()
    }).save()
    const ticket2 = await Ticket.build({
        price: 10,
        title: 'T2',
        id: new Types.ObjectId().toHexString()
    }).save()
    const ticket3 = await Ticket.build({
        price: 10,
        title: 'T3',
        id: new Types.ObjectId().toHexString()
    }).save()
    // Create two users via global.signIn
    const userOne = global.signIn()
    const userTwo = global.signIn()
    // Assign first ticket with order to user one and assign two left to user two with order creating
    await request(app).post('/api/orders')
        .set('Cookie', userOne)
        .send({ticketId: ticket1.id}).expect(201)
    const {body: orderOne} = await request(app).post('/api/orders')
        .set('Cookie', userTwo)
        .send({ticketId: ticket2.id})
    const {body: orderTwo} = await request(app).post('/api/orders')
        .set('Cookie', userTwo)
        .send({ticketId: ticket3.id})
    // Check expected values in response body,
    const {body: orders} = await request(app).get('/api/orders').set('Cookie', userTwo)
    expect(orders.length).toEqual(2)
    expect(orders[0].ticket.id).toEqual(ticket2.id)
    expect(orders[1].ticket.id).toEqual(ticket3.id)

})